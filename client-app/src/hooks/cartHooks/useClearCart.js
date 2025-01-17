import cartService from "@/services/cartService";
import { useState } from "react";

const useClearCart = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const clearCart = async (tableNumber, customerId) => {
        setIsLoading(true);
        setError(null);

        try {
            await cartService.clearCart(tableNumber, customerId);
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An error occurred during clearing cart.";
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        clearCart,
        isLoading,
        error,
    }
}

export default useClearCart;
