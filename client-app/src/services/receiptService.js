import apiClient from "@/dal/apiClient";

const generateReceipt = async (orderId) => {
    try {
        const response = await apiClient.get(`/receipt/${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
} 

export default {generateReceipt};