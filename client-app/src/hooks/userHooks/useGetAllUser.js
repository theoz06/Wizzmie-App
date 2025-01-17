import userService from "@/services/userService";
import { useEffect, useState } from "react";


const useGetAllUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);


  const getAllUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await userService.getAllUser();
        setUsers(response);
    } catch (err) {
        const errorMessage = err?.response?.data?.message || err.message || "An error occurred during menu creation.";
        setError(errorMessage);
        return false;
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  return {
    isLoading,
    error,
    users,
    getAllUsers
  }

}

export default useGetAllUser;