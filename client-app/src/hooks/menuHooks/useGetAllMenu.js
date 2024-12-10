import { useEffect, useState } from "react";
import menuService from "@/services/menuService";


const useGetAllMenu = () => {
    const [menus, setMenus] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAllMenu = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await menuService.getAllMenu();
            setMenus(response);
        } catch (err) {
            setError(err.message || "Something went wrong!");
            return false;    
        }finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getAllMenu();
    }, []);

    return {
        menus,
        error, 
        isLoading,
        getAllMenu
    }
};

export default useGetAllMenu;