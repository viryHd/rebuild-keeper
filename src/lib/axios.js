import Vue from 'vue'
import axios from "axios";
// 抽取接口的基地址，全局的axios默认值default
// axios.defaults.baseURL = 'http://';
// 注意这个是axios跨域带cookie的设置，不然在不同的router下无法记录登录状态
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;
// CryptoJS加密
import CryptoJS from 'crypto-js'
const KEY = 'bb635dd47e5861f717472df95652077356a8f38dea6347851c191f66b7cf9dc8'
// 导入vuex
import store from "@/store"

// 请求、响应拦截器
axios.interceptors.request.use((config) => {
  if(localStorage.userLogin){
    window.user = JSON.parse(localStorage.userLogin)
  }
  console.log(config);
  if (config.method === 'get') {
    let params = getUrlVars(config.url)
    let arr = params.map((p) => `${p}=${params[p]}`)
    let arrTmp = params.map((p) => `${p}=${params[p]}`)
    if (window.user && window.user.token) {
      arr.push('token=' + window.user.token)
      arrTmp.push('token=' + window.user.token)
    }
    let timestamp = new Date().getTime()
    arr.push('timestamp=' + timestamp)
    arrTmp.push('timestamp=' + timestamp)
    // console.log(arrTmp)
    arr.push('sign=' + CryptoJS.MD5(arrTmp.sort().join('&') + '#' + KEY))
    if (config.url.match(/[^=]\?/)) {
      config.url = config.url.slice(0, config.url.indexOf('?') + 1) + arr.join('&')
    } else {
      config.url = config.url + '?' + arr.join('&')
    }
  } else {
    let arr = []
    if (!config.data) {
      config.data = new FormData()
    }
    if (window.user && window.user.token) {
      config.data.append('token', window.user.token)
    }
    config.data.forEach((value, key) => {
      if (!key.match(/\[/) && typeof (value) !== 'object') {
        arr.push(key + '=' + value)
      }
    })
    if (config.method !== 'post') {
      arr.push('_method=' + config.method.toLocaleUpperCase())
    }
    let timestamp = new Date().getTime()
    config.data.append('timestamp', timestamp)
    arr.push('timestamp=' + timestamp)
    console.log(arr.sort().join('&') + '#' + KEY)
    config.data.append('sign', CryptoJS.MD5(arr.sort().join('&') + '#' + KEY))
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

axios.interceptors.response.use((config) => {
  if (config.data.code === 401) {
    router.push('/Login')
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 拿到请求体参数键值对
function getUrlVars(url) {
  // url = url.replace(/[=]&/, '=' + escape('&'))
  var vars = []
  if (url.indexOf('?') !== -1) {
    var hash = ''
    var hashes = url.slice(url.indexOf('?') + 1).split('&')
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=')
      vars.push(hash[0])
      vars[hash[0]] = hash[1]
    }
  }
  // console.log('参数', vars)
  return vars
}

// 不暴露出去也可以，但main.js只能用Vue.prototype.$axios点出来
export default axios