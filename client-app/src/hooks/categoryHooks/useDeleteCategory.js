const { default: categoryService } = require("@/services/categoryService");
const { useState } = require("react")

const useDeleteCategory = () => {
    const [isLoading, setIsLoading ] = useState(false);
    const [error, setError] = useState(null);

    const DeleteCategory = async (id) => {
        setIsLoading(true);
        setError(null);

        try {
            await categoryService.deleteCategory(id);
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An error occured during deleting Category."
            setError(errorMessage);
            return false;    
        }finally {
            setIsLoading(false);
        }
    }

    return{
        DeleteCategory,
        isLoading,
        error,
        setError,
    }
}

export default useDeleteCategory;