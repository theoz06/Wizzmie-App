import orderService from '@/services/orderService';
import Cookies from 'js-cookie';
import React, { useState } from 'react'

const useUpdateOrderStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateOrderStatus = async (orderId) => {
    setIsLoading(true);
    setError(null);

    try {
        const user = JSON.parse(Cookies.get("user"))
        console.log("User Id: " + JSON.stringify(user));

        const changedBy = user.id;
        console.log("Changed By: " + changedBy);

        await orderService.updateStatusOrder(orderId, changedBy);
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