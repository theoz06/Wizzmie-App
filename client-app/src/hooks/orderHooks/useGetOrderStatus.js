import React, { useState } from 'react'
import orderService from '@/services/orderService';
import { useCallback } from 'react';



const useGetOrderStatus = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getOrderStatus = useCallback(async (orderId, tableNumber, customerId) => {
        setIsLoading(true);
        setError(null);

        try {
            const response =  await orderService.getOrderStatus(orderId, tableNumber, customerId);
            return response;
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || "Something went wrong";
            setError(errorMessage);
            setIsLoading(false);
        }finally{
            setIsLoading(false);
        }
    },[])

    return {
        isLoading,
        error,
        getOrderStatus 
    }
}

export default useGetOrderStatus;