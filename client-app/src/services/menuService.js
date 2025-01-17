import apiClient from "@/dal/apiClient";



const getAllMenu = async () => {
    try {
        const response = await apiClient.get("menu/public");
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

const updateMenu = async (id, data) => {
    try {
        const response = await apiClient.put(`menu/admin/update/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const updateMenuAvailability = async (id, data) => {
    try {
        const response = await apiClient.put(`menu/admin/update-availability/${id}`, data);

        return response.data;
    } catch (error) {
        throw error;
    }
}

const deleteMenu = async (id)=> {
    try {
        const response = await apiClient.delete(`menu/admin/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const getRecommendationMenu = async (customerId) => {
    try {
        const response = await apiClient.get(`/recommendations/${customerId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default {
    getAllMenu, 
    createMenu, 
    updateMenuAvailability, 
    updateMenu, 
    deleteMenu, 
    getRecommendationMenu
};