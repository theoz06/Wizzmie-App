import userService from "@/services/userService";


const useUpdateUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateUser = async (id, data) => {
        setIsLoading(true);
        setError(null);

        try {
            await userService.updateUser(id, data);
            return true;
        } catch (error) {
            const errorMessage = err?.response?.data?.message || err.message || "An error occured during updating user."
            setError(errorMessage);
            return false;
        }finally {
            setIsLoading(false);
        }
    }

    return {
        updateUser,
        isLoading,
        error,
        setError
    }
}

export default useUpdateUser;