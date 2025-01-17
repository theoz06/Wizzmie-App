import menuService from "@/services/menuService";
import { useState } from "react";
import { useCallback } from "react";



const useGetRecommendationMenu = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recommendation, setRecommendation] = useState([]);

    const getRecommendationMenu = useCallback(async (customerId) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await menuService.getRecommendationMenu(customerId);
            return response;
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err?.response?.message || "Something went wrong when trying to get recommendation Menu.";
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        getRecommendationMenu,
        isLoading,
        error,
        recommendation, 
        setRecommendation
    }
}

export default useGetRecommendationMenu;


