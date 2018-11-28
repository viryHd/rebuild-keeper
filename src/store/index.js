import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        userLogin: {
            id: 0,
            companyId: 0,
            isRegister: 0,
            isAdmin: null,
            phone: "",
            token: ""
        },
        imgInfo: {
            avatarfile: null,
            imgData: ""
        }
    },
    mutations: {

    },
    actions: {

    },
    getters: {

    }
})
export default store