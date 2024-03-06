import { request } from 'boot/axios'

/**
 *  查询菜单树
 * @param {*} queryParams
 */
export function getMenuTree () {
  return request({
    url: 'auth/menumanager/getMenuTree',
    method: 'get'
  })
}

/**
 *  更新菜单节点
 */
export function updateMenu (data) {
  return request({
    url: 'auth/menumanager/updateMenu',
    method: 'post',
    data
  })
}

/**
 *  删除菜单
 * @param {*} data
 */
export function deleteMenu (data) {
  return request({
    url: 'auth/menumanager/deleteMenu',
    method: 'post',
    data
  })
}

/**
 *  创建菜单
 * @param {*} data
 */
export function createMenu (data) {
  return request({
    url: 'auth/menumanager/createMenu',
    method: 'post',
    data
  })
}
