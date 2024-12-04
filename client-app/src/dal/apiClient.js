import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.local.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
    headers: {
        "content-type" : "application/json"
    }
})

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const message = error.response?.data?.message || "Unknown Error!";
        return Promise.reject(new Error(message));
    }
)k

export default apiClient;