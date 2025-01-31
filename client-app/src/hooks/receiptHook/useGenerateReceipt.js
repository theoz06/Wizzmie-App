import { useState } from 'react';
import receiptService from '@/services/receiptService';

const useGenerateReceipt = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    const generateReceipt = async (orderId) => {
        setIsGenerating(true);
        setError(null);

        try {
            const response = await receiptService.generateReceipt(orderId);
            setIsGenerating(false);
            return response;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            setIsGenerating(false);
        }finally{
            setIsGenerating(false);
        }
    }

    return {
        isGenerating,
        error,
        generateReceipt
    }
}

export default useGenerateReceipt;