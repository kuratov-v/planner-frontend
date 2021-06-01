import axios from "@/services/request";

export default {
    state: {
        token: null,
        user: null
    },

    actions: {
        authUser({ commit }, vk_code) {
            const data = {
                "provider": "vk-oauth2",
                "code": vk_code
            };

            return axios.post('login/social/jwt-pair-user/', data)
                .then((response) => {
                    const user = { "first_name": response.data.first_name, "last_name": response.data.last_name }
                    commit('setUserInfo', user);
                    commit('setToken', response.data.token);
                    localStorage.setItem('userInfo', JSON.stringify(user));
                    localStorage.setItem('auth', response.data.token);
                });
        },
        logoutUser({ commit }) {
            localStorage.removeItem('auth');
            localStorage.removeItem('userInfo');
            return commit('logout');
        },
        tokenVerify({ dispatch, getters }) {
            const data = { "token": getters.getToken }
            return axios.post('token-verify/', data)
                .catch(() => {
                    dispatch('logoutUser');
                });
        },
    },

    mutations: {
        setUserInfo(state, user) {
            state.user = user
        },
        setToken(state, token) {
            state.token = token
        },
        logout(state) {
            state.token = null
            state.user = null
        },
    },

    getters: {
        getUserInfo(state) {
            if (state.user) return state.user;
            return JSON.parse(localStorage.getItem('userInfo'));
        },
        getToken(state) {
            if (state.token) return state.token;
            return localStorage.getItem('auth');
        },
    },
}
