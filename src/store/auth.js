import axios from 'axios';

export default {
    state: {
        token: null,
        user: null
    },

    actions: {
        createSateUser({ commit }, token) {
            commit('setToken', token);
            axios.get(this.state.serverDomain + 'api/v1/users/me/', { headers: { 'Authorization': "Bearer " + localStorage.getItem('auth') } })
                .then((response) => {
                    commit('setUserInfo', response.data);
                });
        },
        authUser({ commit }, vk_token) {
            var data = {
                "client_id": process.env.VUE_APP_VK_CLIENT_ID,
                "grant_type": "convert_token",
                "backend": "vk-oauth2",
                "token": vk_token
            };

            return axios.post(this.state.serverDomain + 'auth/convert-token/', data)
                .then((response) => {
                    this.dispatch('createSateUser', response.data.access_token);
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