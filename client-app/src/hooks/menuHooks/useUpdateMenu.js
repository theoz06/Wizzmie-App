import menuService from "@/services/menuService";
import { useState } from "react";


export const useUpdateMenu = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateMenu = async (id, data) => {
    setIsLoading(true);
    setError(null);
    console.log("data: " + data);

    try {
        await menuService.updateMenu(id, data);
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
    updateMenu,
    isLoading,
    error,
    setError,
  }
}

export default useUpdateMenu;

