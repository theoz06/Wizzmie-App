import userService from "@/services/userService";
import { useState } from "react";




const useCreateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
        await userService.createUser(data);
        return true
    } catch (err) {
        const errorMessage = err?.response?.data?.message || err.message || "An error occured during creating user."
        setError(errorMessage);
        return false;
    }finally {
        setIsLoading(false);
    }
  }

  return {
    createUser,
    isLoading,
    error,
    setError
  }

}

export default useCreateUser;