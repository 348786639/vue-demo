import Vue from 'vue'



import Router from 'vue-router'

import login from '@/page/login'



Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      component: login
    },

    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../page/index.vue'),
      meta: { title: '自述文件' },
      children: [
          {
              path: '/dashboard',
              component: () => import(/* webpackChunkName: "dashboard" */ '../page/dashboard.vue'),
              meta: { title: '系统首页' }
          },
          {
            path: '/user',
            component: () => import(/* webpackChunkName: "dashboard" */ '../page/system/user.vue'),
            meta: { title: '用户管理' }
          },
          {
            path: '/resource',
            component: () => import(/* webpackChunkName: "dashboard" */ '../page/system/resource.vue'),
            meta: { title: '权限管理' }
          },
          {
            path: '/role',
            component: () => import(/* webpackChunkName: "dashboard" */ '../page/system/role.vue'),
            meta: { title: '角色管理' }
          },
          {
            path: '/dept',
            component: () => import(/* webpackChunkName: "dashboard" */ '../page/system/dept.vue'),
            meta: { title: '部门管理' }
          },

      ]
  },

  ]
})
