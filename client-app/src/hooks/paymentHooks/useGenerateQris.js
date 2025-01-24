import paymentService from "@/services/paymentService";
import { useState } from "react";
import { useCallback } from "react";


const useGenerateQris = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateQRIS = useCallback(async (orderId) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await paymentService.generateQRIS(orderId);
            return res;
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err?.response?.message || "Failed to generate QRIS.";
            setError(errorMessage);
            setIsLoading(false)
        }finally{
            setIsLoading(false);
        }
    },[]);

    return {
        isLoading,
        error,
        generateQRIS
    }
}

export default useGenerateQris;