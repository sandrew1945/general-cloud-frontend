import { setToken, removeToken } from 'src/utils/auth'
import { doLogin, doLogout, getUserInfo, getMenuByRole } from 'src/api/user'

export function login ({ commit }, userInfo) {
  const { username, password } = userInfo
  return new Promise((resolve, reject) => {
    doLogin({ userCode: username.trim(), password: password }).then(response => {
      const { data } = response
      commit('SET_TOKEN', data.token)
      setToken(data.token)
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

export function setName ({ commit }, name) {
  commit('SET_NAME', name)
}

export function setRole ({ commit }, roleId) {
  commit('SET_ROLE_ID', roleId)
}

export function setRoles ({ commit }, roles) {
  commit('SET_ROLES', roles)
}

export function setCode ({ commit }, code) {
  commit('SET_CODE', code)
}

export function getInfo ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getUserInfo(state.token).then(response => {
      const { data } = response
      if (!data) {
        reject('Verification failed, please Login again.')
      }
      const { userId, userCode, userName, sex, avatar, roleList } = data
      commit('SET_ID', userId)
      commit('SET_CODE', userCode)
      commit('SET_NAME', userName)
      commit('SET_SEX', sex)
      commit('SET_AVATAR', avatar)
      commit('SET_ROLES', roleList)
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
}

export function getMenu ({ commit }, roleId) {
  return new Promise((resolve, reject) => {
    getMenuByRole(roleId).then(response => {
      const { data } = response
      resolve(data)
    })
  })
}

export function setMenu ({ commit }, menuList) {
  commit('SET_MENU', menuList)
}

export function resetSelectedRole ({ commit }) {
  commit('SET_ROLE_ID', '')
}

export function logout ({ commit, state }) {
  return new Promise((resolve, reject) => {
    doLogout(state.token).then((response) => {
      commit('SET_TOKEN', '')
      commit('SET_CODE', '')
      commit('SET_NAME', '')
      commit('SET_ROLE_ID', '')
      commit('SET_MENU', [])
      commit('SET_ROLES', [])
      commit('SET_AVATAR', '')
      removeToken()
      // resetRouter()
      resolve()
    }).catch(error => {
      commit('SET_TOKEN', '')
      commit('SET_CODE', '')
      commit('SET_NAME', '')
      commit('SET_ROLE_ID', '')
      commit('SET_MENU', [])
      commit('SET_ROLES', [])
      commit('SET_AVATAR', '')
      removeToken()
      // resetRouter()
      // resolve()
      reject(error)
    })
  })
}

export function resetToken ({ commit }) {
  return new Promise(resolve => {
    commit('SET_TOKEN', '')
    removeToken()
    resolve()
  })
}
