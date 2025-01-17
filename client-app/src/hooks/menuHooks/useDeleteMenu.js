import menuService from '@/services/menuService';
import React, { useState } from 'react'

const useDeleteMenu = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteMenu = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
        await menuService.deleteMenu(id);
        return true;
    } catch (err) {
        const errorMessage = err?.response?.data?.message || err.message || "An error occured during deleting menu.";
        setError(errorMessage);
        return false;
    }finally{
        setIsLoading(false);
    }
  }

  return{
    deleteMenu,
    isLoading,
    error,
  }

}

export default useDeleteMenu;