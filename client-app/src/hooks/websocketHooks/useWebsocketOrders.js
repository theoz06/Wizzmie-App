import WebsocketService from '@/services/webSocketService';
import React, { useEffect, useState } from 'react'

const useWebsocketOrders = () => {
    const [newOrder, setNewOrder] = useState([]);

    useEffect(()=>{
        const handleNewOrder = (order) => {
            setNewOrder((prevOrders)=> [order, ...prevOrders])
        }

        WebsocketService.connect(handleNewOrder);

        return () => {
            WebsocketService.disconnect();
        }
    },[]);

    return {
        newOrder
    }
}

export default useWebsocketOrders;