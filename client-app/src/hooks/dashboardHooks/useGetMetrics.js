import { useCallback, useEffect, useState } from "react";
import dashboardService from "@/services/dashboardService";


const useGetMetrics = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [metrics, setMetrics] = useState([]);

    const getMetrics = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await dashboardService.getDashboardMetrics();
            setMetrics(response);
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || "An error occurred during fetching metrics.";
            setError(errorMessage);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(()=>{
        getMetrics();
    },[])

    return {
        getMetrics,
        metrics,
        isLoading,
        error
    }
}

export default useGetMetrics;