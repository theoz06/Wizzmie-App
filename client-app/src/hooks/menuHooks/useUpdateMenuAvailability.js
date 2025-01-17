import menuService from "@/services/menuService";
import { useState } from "react";



export const useUpdateMenuAvailability = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateAvailability = async (id, data) => {
    setIsLoading(true);
    setError(null);

    try {
        await menuService.updateMenuAvailability(id, data);
        return true;
    } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An error occurred during menu updating.";
        console.log("Error Message:", errorMessage); // Log the error message
        setError(errorMessage);
        return false;
    } finally {
      setIsLoading(false);
    }
  }

  return{
    updateAvailability,
    isLoading,
    error,
  }
}

export default useUpdateMenuAvailability;

