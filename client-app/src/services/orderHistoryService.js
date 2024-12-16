import apiClient from '@/dal/apiClient';


const getOrderHistory = async() => {
  try {
    const response = await apiClient.get("/order/history");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default getOrderHistory;