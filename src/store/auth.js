import axios from "@/services/request";

export default {
    state: {
        token: null,
        user: null
    },

    actions: {
        createSateUser({ commit }, data) {
            const user = { "first_name": data.first_name, "last_name": data.last_name }
            commit('setUserInfo', user);
            commit('setToken', data.token);
            localStorage.setItem('userInfo', JSON.stringify(user));
            localStorage.setItem('auth', data.token);
        },
        authUser(ctx, vk_code) {
            var data = {
                "provider": "vk-oauth2",
                "code": vk_code
            };

            return axios.post('login/social/jwt-pair-user/', data)
                .then((response) => {
                    this.dispatch('createSateUser', response.data);
                });
        },
        logoutUser({ commit }) {
            localStorage.removeItem('auth');
            localStorage.removeItem('userInfo');
            return commit('logout');
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
