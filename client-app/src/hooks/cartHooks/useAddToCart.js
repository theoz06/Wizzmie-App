import cartService from "@/services/cartService";
import { useState } from "react";


const useAddToCart = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const addToCart = async (tableNumber, customerId, data) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await cartService.addToCart(tableNumber, customerId, data);
            if (response === 200){
                return true;
            }else{
                return false;
            }
            
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || "An error occurred during adding to cart.";
            setError(errorMessage);
            setIsLoading(false);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        addToCart,
        isLoading,
        error,
        setError
    }
}

export default useAddToCart;

