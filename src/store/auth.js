import axios from 'axios';

export default {
    state: {
        token: null,
        user: null
    },

    actions: {
        createSateUser({ commit }, data) {
            commit('setToken', data.token);
            commit('setUserInfo', { "first_name": data.first_name, "last_name": data.last_name });
        },
        authUser({ commit }, vk_code) {
            var data = {
                "provider": "vk-oauth2",
                "code": vk_code
            };

            return axios.post(this.state.serverDomain + 'api/login/social/jwt-pair-user/', data)
                .then((response) => {
                    this.dispatch('createSateUser', response.data);
                });
        },
        logoutUser({ commit }) {
            return commit('logout');
        },
    },

    mutations: {
        setUserInfo(state, user) {
            state.user = user
            localStorage.setItem('userInfo', JSON.stringify(user));
        },
        setToken(state, token) {
            state.token = token
            localStorage.setItem('auth', token);
        },
        logout(state) {
            localStorage.removeItem('auth');
            localStorage.removeItem('userInfo');
        },
    },

    getters: {
        getUserInfo(state) {
            if (state.user) return state.user;
            return JSON.parse(localStorage.getItem('userInfo'));
        },
        getToken(state) {
            return localStorage.getItem('auth');
        },
    },
}