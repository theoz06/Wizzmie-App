import orderService from "@/services/orderService";
import { useState } from "react";

const useCreateOrder = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, seterror] = useState(null);

    const createOrder = async (tableNUmber, customerId) => {
        setIsLoading(true);
        seterror(null);

        try {
            return await orderService.createOrder(tableNUmber,customerId);
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || "Create order Failed."
            seterror(errorMessage);
            setIsLoading(false)
        }finally{
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        error,
        createOrder
    }

}

export default useCreateOrder;