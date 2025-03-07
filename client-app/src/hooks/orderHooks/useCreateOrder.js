import orderService from "@/services/orderService";
import { useState } from "react";

const useCreateOrder = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createOrder = async (tableNUmber, customerId) => {
        setIsLoading(true);
        setError(null);

        try {
            return await orderService.createOrder(tableNUmber,customerId);
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || "Create order Failed."
            setError(errorMessage);
            setIsLoading(false)
        }finally{
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        error,
        setError,
        createOrder
    }

}

export default useCreateOrder;