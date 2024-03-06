import { request } from 'boot/axios'

/**
 *  查询用户列表
 * @param {*} queryParams
 */
export function getUserList (data) {
  return request({
    url: 'auth/usermanager/userManagerPageQuery',
    method: 'post',
    data
  })
}
/**
 *  创建用户
 * @param {*} userInfo
 */
export function createUser (data) {
  return request({
    url: 'auth/usermanager/createUserInfo',
    method: 'post',
    data
  })
}
/**
 *  查询用户信息
 * @param {*} id
 */
export function fetchUserInfo (id) {
  return request({
    url: 'auth/usermanager/getUserInfoById',
    method: 'get',
    params: { userId: id }
  })
}
/**
 *  更新用户信息
 * @param {*} data
 */
export function updateUserInfo (data) {
  return request({
    url: 'auth/usermanager/updateUserInfo',
    method: 'post',
    data
  })
}
/**
 *  删除用户
 * @param {*} data
 */
export function deleteUser (data) {
  return request({
    url: 'auth/usermanager/deleteUserInfo',
    method: 'post',
    data
  })
}

export function getRelationRoles (userId) {
  return request({
    url: 'auth/usermanager/queryRelationRoles',
    method: 'get',
    params: { userId: userId }
  })
}

export function getUnRelationRoles (data) {
  return request({
    url: 'auth/usermanager/queryUnRelationRoles',
    method: 'post',
    data
  })
}

export function addRole (data) {
  return request({
    url: 'auth/usermanager/createRelation',
    method: 'post',
    data
  })
}

export function deleteRole (data) {
  return request({
    url: 'auth/usermanager/deleteRoleRelation',
    method: 'post',
    data
  })
}

/**
 *  修改个人密码
 * @param {*} data
 */
export function updatePassword (data) {
  return request({
    url: 'auth/usermanager/updatePassword',
    method: 'post',
    data
  })
}

/**
 *  修改个人密码
 * @param {*} data
 */
export function uploadAvatar (data) {
  return request({
    url: 'auth/generate/uploadImg',
    method: 'post',
    contentType: 'multipart',
    data
  })
}

/**
 *  用户代码验证
 * @param {*} userCode
 */
export function userValidate (userCode) {
  return request({
    url: 'auth/usermanager/userValidate',
    method: 'get',
    params: { userCode: userCode }
  })
}
