import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { title: '首页' },
    component: () => import('@/views/Home.vue')
  }
]

const router = new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
