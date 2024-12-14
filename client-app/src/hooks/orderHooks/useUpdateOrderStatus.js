import orderService from '@/services/orderService';
import React, { useState } from 'react'

const useUpdateOrderStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateOrderStatus = async (orderId) => {
    setIsLoading(true);
    setError(null);

    try {
        await orderService.updateStatusOrder(orderId);
        return true;
    } catch (err) {
        const errorMessage = err?.response?.data?.message || err.message || "Something went wrong";
        setError(errorMessage);
        return false;
    }finally{
        setIsLoading(false);
    }
  }

  return {updateOrderStatus, isLoading, error}

}

export default useUpdateOrderStatus;