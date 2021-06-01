import axios from "axios";
import store from "@/store/index";

const instance = axios.create({
    baseURL: `${store.state.serverDomain}api/v1/`,
});

instance.interceptors.request.use(
    function (config) {
        if (store.getters.getToken) config.headers["Authorization"] = `Bearer ${store.getters.getToken}`
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

export default instance;
