import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/element-variables.scss' // 引入自定义主题色

import '@/styles/index.scss' // global css

import App from './App.vue'
import router from './router'
import store from './store'

import * as filters from './filters' // global filters 全局过滤器

import '@/icons' // icon
import '@/permission' // permission control

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.config.productionTip = false

Vue.use(ElementUI, {
  size: 'small',
  zIndex: 3000
}) // 项目中所有拥有 size 属性的组件的默认尺寸均为 'small'，弹框的初始 z-index 为 3000

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
