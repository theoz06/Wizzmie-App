import apiClient from "@/dal/apiClient";

const getOrCreateCustomer = async (data) => {
    try {
        const response = await apiClient.post("/customer", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default {getOrCreateCustomer};