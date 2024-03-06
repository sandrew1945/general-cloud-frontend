import axios from 'axios'
import { getToken } from 'src/utils/auth'
import qs from 'qs'
import { Platform } from 'quasar'
import { errorNotify } from 'src/utils/Notify'

const request = axios.create({
  baseURL: process.env.API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
export default ({ store, router, Vue }) => {
// request interceptor
  request.interceptors.request.use(
    config => {
    // do something before request is sent
      if (store.getters['user/getToken']) {
        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation
        config.headers['X-Token'] = Platform.is.electron ? getToken() || store.getters['user/getToken'] : getToken()
        config.headers.sid = Platform.is.electron ? getToken() || store.getters['user/getToken'] : getToken()
      }
      // fromdata提交
      if (config.method === 'post' && config.contentType === 'multipart') {
        config.headers['Content-Type'] = 'multipart/form-data'
      } else if (config.method === 'post' && config.contentType !== 'application/json') {
        config.data = qs.stringify(config.data)
      }
      return config
    },
    error => {
    // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )

  // response interceptor
  request.interceptors.response.use(
    response => {
      const res = response.data
      // if the custom code is not 20000, it is judged as an error.
      if (res.result === false || res.result === 0) {
        errorNotify(res.msg)
        return res
      } else {
        return res
      }
    },
    error => {
      // errorNotify(error.message)
      if (error.response.status === 401) {
        // router.push({ path: '/login' })
        store.dispatch('user/resetToken')
        store.dispatch('user/setCode', '')
        store.dispatch('user/setRole', '')
        store.dispatch('user/setRoles', [])
        router.push('/')
      }
      return Promise.reject(error)
    }
  )

  // for use inside Vue files through this.$axios
  Vue.prototype.$axios = request
}
export { request }
