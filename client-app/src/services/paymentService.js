import apiClient from "@/dal/apiClient";

const generateQRIS = async (orderId) => {
    try {
        const response = await apiClient.post(`/customer/payments/order/${orderId}/qris`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const checkStatuspaid = async (orderId) => {
    try {
        const response = await apiClient.get(`/customer/payments/order/${orderId}/status`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default {
    generateQRIS,
    checkStatuspaid
}