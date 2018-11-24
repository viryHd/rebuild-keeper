import Vue from 'vue'
import axios from "axios";
// 抽取接口的基地址，全局的axios默认值default
// axios.defaults.baseURL = 'http://';
// 注意这个是axios跨域带cookie的设置，不然在不同的router下无法记录登录状态
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios; 

// 不暴露出去也可以，但main.js只能用Vue.prototype.$axios点出来
export default axios