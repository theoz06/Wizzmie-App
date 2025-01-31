import {WebSocketService} from '@/services/webSocketService';
import { useEffect, useRef, useState } from 'react'

const useWebsocketOrders = (type) => {
    const [newOrder, setNewOrder] = useState([]);
    const wsServiceRef = useRef(null);// Create instance per hook usage
    
  const transformeOrderData = (order) => ({
    id: order.id,
    customer: order.customer.name,
    table: order.tableNumber,
    total: order.totalAmount,
    status: order.orderStatus.description,
    items: order.orderItems.map((item) => ({
      qty: item.quantity,
      menu: item.menu.name,
      catatan: item.description,
    })),
  });

    useEffect(()=>{

        if(!wsServiceRef.current){
          wsServiceRef.current = new WebSocketService();
        }

        const handleNewOrder = (order) => {

            const transformedOrder = transformeOrderData(order);

            setNewOrder((prevOrders) => {
                const existingOrderIndex = prevOrders.findIndex(
                  (exisOrder) => exisOrder.id === transformedOrder.id
                );
        
                if (existingOrderIndex !== -1) {
                  const updatedOrders = [...prevOrders];
                  updatedOrders[existingOrderIndex] = transformedOrder;
                  return updatedOrders;
                } else {
                  
                  return [...prevOrders, transformedOrder];
                }
              });
        }

        wsServiceRef.current.connect(type,handleNewOrder, (error)=> {
            console.log("Websocket connection Error: " + error);
        });

        return () => {
          if (wsServiceRef.current) {
            wsServiceRef.current.disconnect();
        }
        }
    },[type]);

    return {
        newOrder, setNewOrder
    }
}

export default useWebsocketOrders;