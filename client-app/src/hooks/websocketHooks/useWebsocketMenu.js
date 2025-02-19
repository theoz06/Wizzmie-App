import { useState, useRef } from "react";
import { useEffect } from "react";
import { WebSocketService } from "@/services/webSocketService";


const useWebsocketMenu = ()=> {
    const [updatedMenu, setUpdatedMenu] = useState(null);
    const wsServiceRef = useRef(null);
    
    useEffect(() => {
        if (!wsServiceRef.current) {
            wsServiceRef.current = new WebSocketService();
        }

        const handleMenuUpdate = (menu) => {
            setUpdatedMenu(menu);
        };

        wsServiceRef.current.connect('menu', handleMenuUpdate, (error) => {
            console.error("WebSocket Menu Update Error:", error);
        });

        return () => {
            if (wsServiceRef.current) {
                wsServiceRef.current.disconnect();
            }
        };
    }, []);

    return {
        updatedMenu
    };
}

export default useWebsocketMenu;