import React, { useEffect } from 'react'
import orderHistoryService from '@/services/orderHistoryService';
import { useState } from 'react';


const useGetOrderHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderHistories, setOrderHistories] = useState([]);
  const [transformeData, setTransformedData] = useState([]);

  const transformeOrderData = (fetchedData) => {
    return fetchedData.map((order)=> ({
        id: order.id,
        customer: order.customer.name,
        table: order.tableNumber,
        total: order.totalAmount,
        status: order.orderStatus.description
    }))
  }

  const getOrderHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await orderHistoryService.getOrderHistory();
        console.log("Response from API:", response);
        setOrderHistories(response);

        const transforme = transformeOrderData(response);

        console.log("Transformed Data:", transforme);
        setTransformedData(transforme);
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