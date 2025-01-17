import cartService from "@/services/cartService";
import { useState } from "react";



const useUpdateCart = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateCart = async (tableNumber, customerId, menuId, params) => {
        setIsLoading(true);
        setError(null);
        
        try {
            await cartService.updateCart(tableNumber, customerId, menuId, params);
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
        updateCart,
        isLoading,
        error,
    }
}

export default useUpdateCart;
