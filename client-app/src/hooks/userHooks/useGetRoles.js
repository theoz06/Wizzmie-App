import { useEffect, useState } from "react";
import roleService from "@/services/roleService";




const useGetRoles = () => {
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);

  const getRoles = async () => {
    setError(null);

    try {
        const response = await roleService.getRoles();
        console.log("roles :" + response)
        setRoles(response);
    } catch (err) {
        const errorMessage = err?.response?.data?.message || err.message || "An error occurred during menu creation.";
        setError(errorMessage);
    }
  }

  useEffect(()=>{
    getRoles();
  }, []);

  return {
    roles,
    error,
  }
}

export default useGetRoles;