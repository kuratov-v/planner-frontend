import axios from "axios";

export const HTTP = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
    headers: {
        Authorization: "Bearer " + localStorage.getItem("auth")
    }
})