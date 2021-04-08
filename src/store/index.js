import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth.js';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        serverDomain: process.env.VUE_APP_BACKEND_DOMAIN
    },
    mutations: {},
    actions: {},
    getters: {
        serverDomain(state) {
            return state.serverDomain
        }
    },
    modules: {
        auth
    }
})
