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
        return response.status;
    } catch (error) {
        throw error;
    }
}

const updateCart = async (tableNumber, customerId, menuId, params) => {
    try {
        const response = await apiClient.put(`/customer/orderpage/table/${tableNumber}/customer/${customerId}/cart/update/${menuId}`, params);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const updateItemDescription = async (tableNumber, customerId, menuId, params) => {
    try {
        const response = await apiClient.put(`/customer/orderpage/table/${tableNumber}/customer/${customerId}/cart/update/description/${menuId}`, params);
        return response.data;
    } catch (error) {
        throw error;
    };
}

const removeItem = async (tableNumber, customerId, menuId) => {
    try {
        const response = await apiClient.delete(`/customer/orderpage/table/${tableNumber}/customer/${customerId}/cart/remove/${menuId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const clearCart = async (tableNumber, customerId) => {
    try {
        const response = await apiClient.delete(`/customer/orderpage/table/${tableNumber}/customer/${customerId}/cart/clear`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default { getCart, addToCart, updateCart, removeItem, clearCart , updateItemDescription };