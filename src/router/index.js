import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  /* {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  }, */
  /* {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }, */
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  },
  {
    path: '/reportDesign',
    component: Layout,
    children: [{
      path: 'index',
      name: 'ReportDesign',
      meta: { title: '报表设计器', icon: 'example', noCache: false },
      component: () => import('@/views/reportDesign/index')
    }]
  },
  {
    path: '/report/ReportDetail',
    component: Layout,
    // hidden: true,
    children: [
      {
        path: 'listReport/reportId/:reportId',
        name: 'ListReport',
        meta: { title: '设计器列表详情', noCache: false, icon: 'table' },
        component: () => import('@/views/reportDesign/listReport.vue')
      }
    ]
  },
  {
    path: '/report/ReportDesign',
    component: Layout,
    // hidden: true,
    children: [
      {
        path: 'modelManagement',
        name: 'ModelManagement',
        component: () => import('@/views/reportDesign/modelManagement.vue'),
        meta: { title: '模型管理', icon: 'chart', noCache: false }
      }
    ]
  },
  {
    path: '/report/ReportDesign',
    component: Layout,
    // hidden: true,
    children: [
      {
        path: 'fieldManagement',
        name: 'FieldManagement',
        component: () => import('@/views/reportDesign/fieldManagement.vue'),
        meta: { title: '字段管理', icon: 'chart', noCache: false }
      }
    ]
  },
  {
    path: '/report/ReportDesign',
    component: Layout,
    // hidden: true,
    children: [
      {
        path: 'dataOriginManagement',
        name: 'DataOriginManagement',
        component: () => import('@/views/reportDesign/dataOriginManagement.vue'),
        meta: { title: '数据源管理', icon: 'chart', noCache: false }
      }
    ]
  }
]

/* const router = new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
}) */
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router // 对router.matcher属性做修改，即新的routes就会替换老的routes
}

export default router
