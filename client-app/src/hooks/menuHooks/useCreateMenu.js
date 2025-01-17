import menuService from "@/services/menuService";
import { useState } from "react";


const useCreateMenu = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const createMenu = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            await menuService.createMenu(data);
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An error occurred during menu creation.";
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        createMenu,
        isLoading,
        error,
        setError
    }
}

export default useCreateMenu;