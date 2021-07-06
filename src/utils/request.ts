import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

const request = axios.create({
  // 配置选项
  // baseURL
  // timeout
})

// 请求拦截器
request.interceptors.request.use(config => {
  // 在这改写 config 的配置信息来实现业务功能的统一处理
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  // 注意：这里一定要返回 config，否则请求发不出去
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
let isRefreshing = false // 控制刷新 token 状态
let requests: any[] = [] // 存储刷新 token 期间过来的 401 请求

request.interceptors.response.use(response => {
  // 状态码 2xx 都会进入这里
  // 如果是自定义错误状态码，错误处理就写到这里
  return response
}, async (err) => { // 超出 2xx 状态码都在这执行
  // 如果使用 HTTP 状态码，错误处理就写到这里
  if (err.response) { // 请求发出去收到响应了，但是状态码超出了 2xx 范围
    const { status } = err.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token 无效（没有提供 token、token 无效、token 过期）
      // 如果有 refresh_token 则尝试使用 refresh_token 获取新的 access_token
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(err)
      }

      if (!isRefreshing) {
        isRefreshing = true // 开启刷新状态
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新 Token 失败')
          }
          // 成功了 -> 把本次失败的请求重新发出去
          // 把刷新拿到的新的 access_token 更新到容器和本地存储中
          store.commit('setUser', res.data.content)
          // 把 requests 队列中的请求重新发出去
          requests.forEach((cb: any) => cb())
          // 重置 requests
          requests = []
          // 把本次失败的请求重新发出去
          return request(err.config)
        }).catch(() => {
          // 失败了 -> 跳转登录页重新登录获取新的 token
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(err)
        }).finally(() => {
          isRefreshing = false // 重置刷新状态
        })
      }
      // 尝试获取新的 token
      // try {
      //   const { data } = await axios.create()({
      //     method: 'POST',
      //     url: '/front/user/refresh_token',
      //     data: qs.stringify({
      //       refreshtoken: store.state.user.refresh_token
      //     })
      //   })
      //   // 成功了 -> 把本次失败的请求重新发出去
      //   // 把刷新拿到的新的 access_token 更新到容器和本地存储中
      //   store.commit('setUser', data.content)
      //   // 把本次失败的请求重新发出去
      //   console.log(data)
      //   return request(err.config)
      // } catch {
      //   // 失败了 -> 跳转登录页重新登录获取新的 token
      //   store.commit('setUser', null)
      //   redirectLogin()
      //   return Promise.reject(err)
      // }
      // 如果没有，直接跳转登录页

      // 刷新状态下，把请求挂起放到 request 数组中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(err.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (err.request) { // 请求发出去没有收到响应
    Message.error('请求超时，请刷新重试')
  } else { // 在设置请求时发生了一些事情，触发了一个错误
    Message.error(`请求失败：${err.message}`)
  }
  // 把请求失败的错误对象继续抛出，扔给下一个上一个调用者
  return Promise.reject(err)
})

export default request
