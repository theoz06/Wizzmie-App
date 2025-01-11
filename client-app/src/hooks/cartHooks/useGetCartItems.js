import { useCallback, useEffect, useState } from "react";
import cartService from "@/services/cartService";



const useGetCartItems = () => {
    const [cartData, setCartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalItem, setTotalItem] = useState(0);

    const getCartItems = useCallback(async (tableNumber, customerId) => {
        setIsLoading(true);
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
    }, []) 



    return {
        isLoading,
        error,
        getCartItems,
        cartData
    }
}

export default useGetCartItems;

