import apiClient from "@/dal/apiClient";


const getCart = async (tableNumber, customerId)=>{
    try {
        const response = await apiClient.get(`/customer/orderpage/table/${tableNumber}/customer/${customerId}/cart`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const addToCart = async (tableNumber, customerId, data) => {
    try {
        const response = await apiClient.post(`/customer/orderpage/table/${tableNumber}/customer/${customerId}/cart/add`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default { getCart, addToCart };