// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
import { LoadingBar } from 'quasar'
import getPageTitle from 'src/utils/get-page-title'
import { getToken } from 'src/utils/auth' // get token from cookie
import { errorNotify } from 'src/utils/Notify'

const whiteList = ['/login'] // no redirect whitelist

export default async ({ store, router }) => {
  router.beforeEach(async (to, from, next) => {
    // start progress bar
    LoadingBar.start()
    // set page title
    document.title = getPageTitle(to.meta.title)

    // determine whether the user has logged in
    const hasToken = getToken() || store.getters['user/getToken']
    if (hasToken) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
        LoadingBar.stop()
      } else {
        const hasGetUserInfo = store.getters['user/getName']
        if (hasGetUserInfo) {
          next()
        } else {
          try {
            // get user info
            await store.dispatch('user/getInfo')
            if (store.getters['user/getRoles'].length > 1) {
              next('/role')
              LoadingBar.stop()
            } else if (store.getters['user/getRoles'].length === 1) {
              const roleId = store.getters['user/getRoles']['0'].roleId
              store.dispatch('user/setRole', roleId)
              store.dispatch('user/getMenu', roleId).then(response => {
                // const routers = rFormat(response)
                store.dispatch('user/setMenu', response)
                console.debug('to.path =======>' + to.path)
                if (to.path === '/') {
                  next('/index/dashboard')
                } else {
                  next(to.path)
                }
                LoadingBar.stop()
              })
            } else {
              // 跳转到无权限页面
              next('/401')
              LoadingBar.stop()
            }
          } catch (error) {
            // remove token and go to login page to re-login
            await store.dispatch('user/resetToken')
            errorNotify(error)
            LoadingBar.stop()
            next(`/login?redirect=${to.path}`)
          }
        }
      }
    } else {
      /* has no token */
      LoadingBar.stop()
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        // LoadingBar.stop()
        next()
      } else {
        store.dispatch('user/setName', '')
        // other pages that do not have permission to access are redirected to the login page.
        // LoadingBar.stop()
        next(`/login?redirect=${to.path}`)
      }
    }
  })

  router.afterEach(() => {
    // finish progress bar
    LoadingBar.stop()
  })
}
