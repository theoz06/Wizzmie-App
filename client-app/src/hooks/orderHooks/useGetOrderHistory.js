import React, { useEffect } from 'react'
import orderHistoryService from '@/services/orderHistoryService';
import { useState } from 'react';


const useGetOrderHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderHistories, setOrderHistories] = useState([]);
  const [transformeData, setTransformeData] = useState([]);

  const transformeOrderData = (fetchedData) => {
    return fetchedData.map((orderHistory)=> ({
        id: orderHistory.order_id,
        customer: orderHistory.customer,
        table: orderHistory.tableNumber,
        total: orderHistory.totalAmount,
        updatedBy: orderHistory.updatedBy.name,
    }))
  }

  const getOrderHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await orderHistoryService.getOrderHistory();

        const transforme = transformeOrderData(response);
        setOrderHistories(transforme);

        setTransformeData(transforme);
    } catch (err) {
        const errorMessage = err?.response?.data?.message || err.message || "Something went wrong";
        setError(errorMessage);
    }finally{
        setIsLoading(false);
    }
  }

  useEffect(()=>{
    getOrderHistory();
  },[]);

  return {
    transformeData,
    isLoading,
    error
  }

}

export default useGetOrderHistory;