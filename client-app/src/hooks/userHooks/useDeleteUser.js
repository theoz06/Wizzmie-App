import userService from '@/services/userService';
import { useState } from 'react';



const useDeleteUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
        await userService.deleteUser(id);
        return true;
    } catch (err) {
        const errorMessage = err?.response?.data?.message || err.message || "An error occured during deleting user."
        setError(errorMessage);
        return false;
    }finally {
        setIsLoading(false);
    }
  }

  return{
    deleteUser,
    isLoading,
    error,
  }
}

export default useDeleteUser