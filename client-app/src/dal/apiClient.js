import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api',
    headers: {
        "content-type" : "application/json"
    }
})

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const message = error.response?.data?.message || error.message || "Unknown Error!";
        console.error(message); 
        const errorMessage = message || "Unknown error occurred.";
        return Promise.reject(new Error(errorMessage));
    }
)

export default apiClient;