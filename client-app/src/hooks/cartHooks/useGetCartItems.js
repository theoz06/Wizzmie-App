import { useEffect, useState } from "react";
import cartService from "@/services/cartService";



const useGetCartItems = () => {
    const [cartData, setCartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCartItems = async (tableNumber, customerId) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await cartService.getCart(tableNumber, customerId);
            setCartData(res);
            return res;
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || "An error occurred during getting cart items.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getCartItems();
    }, []);


    return {
        isLoading,
        error,
        getCartItems,
        cartData
    }
}

export default useGetCartItems;

