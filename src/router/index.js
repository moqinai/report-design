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
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    name: 'home',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/reportDesign',
    name: 'ReportDesign',
    component: Layout,
    children: [{
      path: 'index',
      meta: { title: '报表设计器' },
      component: () => import('@/views/reportDesign/index')
    }]
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
