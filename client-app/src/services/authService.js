import apiClient from "@/dal/apiClient";

const loginUser = async (nik, password) => {
    
    try {
        const response = await apiClient.post("/auth/login", {
            nik,
            password
        })

        return response.data;
    } catch (error) {
        console.error("Login error :", error)
        throw error;
    }
}

export default loginUser;