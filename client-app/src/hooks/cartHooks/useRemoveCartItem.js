import { useState } from "react";
import cartService from "@/services/cartService";




const useRemoveCartItem = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const removeCartItem = async (tableNumber, customerId, menuId) => {
        setIsLoading(true);
        setError(null);

        try {
            await cartService.removeItem(tableNumber, customerId, menuId);
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An error occurred during removing cart item.";
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        removeCartItem,
        isLoading,
        error,
    }
}

export default useRemoveCartItem;
