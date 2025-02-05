import categoryService from "@/services/categoryService";
import { useState } from "react";



const useCreateCategory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createCategory = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            await categoryService.createCategory(data);
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An error occurred during category creation.";
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    return { createCategory, isLoading, error , setError};
}

export default useCreateCategory;