import categoryService from "@/services/categoryService";
import { useState } from "react";

export const useUpdateCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCategory = async (id, data) => {
    setIsLoading(true);
    setError(null);

    try {
      await categoryService.updateCategory(id, data);
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during category updating.";
      console.log("Error Message:", errorMessage); // Log the error message
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateCategory,
    isLoading,
    error,
    setError,
  };
};

export default useUpdateCategory;
