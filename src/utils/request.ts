import axios from 'axios'
import store from '@/store'

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

export default request
