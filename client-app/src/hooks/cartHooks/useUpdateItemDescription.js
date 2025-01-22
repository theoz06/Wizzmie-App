import cartService from "@/services/cartService";
import { useState } from "react";



const useUpdateItemDescription = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateItemDescription = async (tableNumber, customerId, menuId, params) => {
        setIsLoading(true);
        setError(null);
        
        try {
            console.log(tableNumber, customerId, menuId, params)
            await cartService.updateItemDescription(tableNumber, customerId, menuId, params);
            return true;
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || "An error occurred during updating cart.";
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        updateItemDescription,
        isLoading,
        error,
    }
}

export default useUpdateItemDescription;