import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const login = () => import('@/views/login/index.vue')
const loginByCode = () => import('@/views/login/byCode.vue')
const loginByPic = () => import('@/views/login/byPic.vue')
const record = () => import('@/views/record/index.vue')
const person = () => import('@/views/person/index.vue')

const routes = [{
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
            title: '验证码登录',
            auth: true
        }
    },
    {
        path: '/loginByPic',
        component: loginByPic,
        meta: {
            title: '头像验证',
            auth: true
        }
    },
    {
        path: '/record',
        component: record,
        meta: {
            title: '打卡记录',
            auth: true,
            authLogin: true
        }
    },
    {
        path: '/person',
        component: person,
        meta: {
            title: '个人信息',
            auth: true,
            authLogin: true
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    if (to.meta.auth && !localStorage.userLogin) {
        router.push('/login')
        next(false)
    } else if (to.meta.authLogin && !localStorage.userInfo && !from.meta.auth) {
        router.push('/login')
        next(false)
    }
    next()
})
export default router