const permissionRouter = {
  path: '/perm',
  component: () => import('layouts/MainLayout.vue'),
  redirect: 'noRedirect',
  name: '权限管理',
  children: [
    {
      path: 'user',
      name: 'User',
      redirect: 'noRedirect',
      component: {
        render (h) { return h('router-view') }
      },
      meta: { title: '用户管理', icon: 'user2' },
      children: [
        {
          path: 'manager',
          name: 'userlist',
          component: () => import('pages/usermanager/user-list.vue'),
          meta: { title: '用户管理', icon: 'user2' }
        },
        {
          path: 'roles',
          name: 'manageroles',
          component: () => import('pages/usermanager/user-roles.vue'),
          hidden: true
        }
      ]
    },
    {
      path: 'role',
      name: 'Role',
      component: {
        render (h) { return h('router-view') }
      },
      children: [
        {
          path: 'manager',
          name: 'rolelist',
          component: () => import('pages/rolemanager/role-list.vue'),
          meta: { title: '角色管理', icon: 'role' }
        },
        {
          path: 'permission',
          name: 'permission',
          component: () => import('pages/rolemanager/role-permission.vue'),
          hidden: true
        }
      ]
    },
    {
      path: 'function',
      name: 'Function',
      component: {
        render (h) { return h('router-view') }
      },
      children: [
        {
          path: 'manager',
          name: 'function',
          component: () => import('pages/funcmanager/function-mng.vue'),
          meta: { title: '菜单管理', icon: 'role' }
        }
      ]
    }
  ]
}

export default permissionRouter
