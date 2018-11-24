import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false

// 导入路由
import router from './router'
// 导入UI框架
import '@/lib/ui'
// 导入axios
import axios from '@/lib/axios'

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

