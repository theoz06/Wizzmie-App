import apiClient from "@/dal/apiClient";


const getAllUser = async () => {
    try {
        const response = await apiClient.get("/admin/users");
        return response.data;
    } catch (error) {
        throw error;
    }
}


const createUser = async (data) => {
    try {
        const response = await apiClient.post("/admin/user/create", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const updateUser = async (id, data) => {
    try {
        const response = await apiClient.put(`/admin/user/update/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default {getAllUser, createUser, updateUser};