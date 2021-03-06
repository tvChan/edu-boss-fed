/**
 * 资源相关的请求
 */

import request from '@/utils/request'

export const getResourcePages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

// // 获取编辑菜单列表
// export const getEditMenuInfo = (id: string | number = -1) => {
//   return request({
//     method: 'GET',
//     url: '/boss/menu/getEditMenuInfo',
//     params: {
//       id
//     }
//   })
// }

// // 获取所有菜单
// export const getAllMenus = () => {
//   return request({
//     method: 'GET',
//     url: '/boss/menu/getAll'
//   })
// }

// // 删除菜单
// export const deleteMenu = (id: number) => {
//   return request({
//     method: 'DELETE',
//     url: `/boss/menu/${id}`
//   })
// }
