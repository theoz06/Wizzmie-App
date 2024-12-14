import apiClient from '@/dal/apiClient'
import React from 'react'

const getAllOrders = async () => {
  try {
    const response = await apiClient.get("/order")
    return response.data;
  } catch (error) {
    throw error;
  }
}

const updateStatusOrder = async (orderId) => {
  try {
    const response = await apiClient.post(`/order/active-orders/update-status/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
} 

// eslint-disable-next-line import/no-anonymous-default-export
export default {getAllOrders, updateStatusOrder}