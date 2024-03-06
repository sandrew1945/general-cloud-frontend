import Permssion from './permisson'

const routes = [
  {
    path: '/login',
    component: () => import('pages/login/index'),
    hidden: true
  },
  {
    path: '/role',
    component: () => import('pages/login/roletable'),
    hidden: true
  },
  {
    path: '/index',
    component: () => import('layouts/MainLayout.vue'),
    redirect: 'noRedirect',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('pages/Todo.vue'),
        meta: { title: '系统首页', icon: 'home' }
      }
    ]
  },
  {
    path: '/401',
    component: () => import('pages/Error401.vue'),
    hidden: true
  },
  Permssion,
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
    hidden: true
  }
]

export default routes
