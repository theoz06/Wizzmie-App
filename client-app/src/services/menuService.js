import apiClient from "@/dal/apiClient";



const getAllMenu = async () => {
    try {
        const response = await apiClient.get("menu/public");
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const createMenu = async (data) => {
    try {
        const response = await apiClient.post("menu/admin/create", data);
        return response.data
    } catch (error) {
        throw error;
    }
}

export default {getAllMenu, createMenu};