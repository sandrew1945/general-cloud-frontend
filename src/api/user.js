import { request } from 'boot/axios'

export function doLogin (data) {
  return request({
    url: 'auth/login',
    method: 'post',
    data
  })
}

export function getUserInfo (token) {
  return request({
    url: 'auth/userInfo',
    method: 'get',
    params: { token }
  })
}

// export function getRole(token) {
//   return request({
//     url: '/'
//   })
// }

export function getMenuByRole (param) {
  return request({
    url: 'auth/getMenuByRole',
    method: 'get',
    params: { roleId: param }
  })
}

export function doLogout () {
  return request({
    url: 'auth/logout',
    method: 'post'
  })
}
