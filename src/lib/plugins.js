import Vue from 'vue'
// 1.1图片懒加载
import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload, {
  // preLoad: 1.3,
  // 需要使用require
  error: require('@/assets/images/error.jpg'),
  loading: require('@/assets/images/loading.gif'),
  // attempt: 1
});