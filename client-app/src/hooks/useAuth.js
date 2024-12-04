import loginUser from '@/services/authService';
import { useState } from 'react';


const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const login = async (nik, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await loginUser(nik, password);
            sessionStorage.setItem("token", data.token);
            return true;
        } catch (error) {
            setError (error.message || "An error occurred during login.");
            return false;
        } finally {
            setIsLoading(false)
        }
    }
    return { login, isLoading, error };
}

export default useAuth