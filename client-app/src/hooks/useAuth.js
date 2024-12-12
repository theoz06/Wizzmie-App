import loginUser from '@/services/authService';
import Cookies from 'js-cookie';
import { useState } from 'react';


const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const login = async (nik, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await loginUser(nik, password);
            Cookies.set("token", data.token ,{expires: 1});
            Cookies.set("user", JSON.stringify(data.user), {expires:1})
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
    return { login, isLoading, error, setError};
}

export default useAuth;