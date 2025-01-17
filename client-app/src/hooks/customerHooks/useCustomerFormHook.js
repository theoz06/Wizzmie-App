import customerService from "@/services/customerService";
import Cookies from "js-cookie";
import { useState } from "react";


const useCustomerFormHook = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getOrCreate = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await customerService.getOrCreateCustomer(data);
            console.log(res);
            Cookies.set("customer", JSON.stringify(res), {expires:1})
            return true;
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err?.response?.data?.error|| err.message || "An error occurred during login.";
            console.log("error : " + errorMessage);
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        error,
        getOrCreate
    }
}

export default useCustomerFormHook;