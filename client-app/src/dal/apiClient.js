import axios from "axios";
import Cookies from "js-cookie";
import { config } from "process";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api',
    headers: {
        "content-type" : "application/json"
    }
})

apiClient.interceptors.request.use((config)=>{
    const token = Cookies.get("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const message = error.response?.data?.message || error.message || "Unknown Error!";
        const errorMessage = message || "Unknown error occurred.";
        return Promise.reject(new Error(errorMessage));
    }
)

export default apiClient;