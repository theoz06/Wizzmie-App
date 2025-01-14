import paymentService from "@/services/paymentService";
import { useState } from "react"

const useCheckStatusPaid = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkStatusPaid = async (orderId) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await paymentService.checkStatuspaid(orderId);
            return response;
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err?.response?.message || "Failed to get status paid."
            setError(errorMessage);
            setIsLoading(false);
        }finally{
            setIsLoading(false);
        }
    } 

    return {
        isLoading, error, checkStatusPaid
    }
}

export default useCheckStatusPaid; 