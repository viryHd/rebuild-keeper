import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const login = () => import('@/views/login/index.vue')
const loginByCode = () => import('@/views/login/byCode.vue')

const routes = [
    {
        path: '/',
        component: login,
        meta: {
            title: '登录'
        }
    },
    {
        path: '/login',
        component: login,
        meta: {
            title: '登录'
        }
    },
    {
        path: '/loginByCode',
        component: loginByCode,
        meta: {
            title: '验证码登录'
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router