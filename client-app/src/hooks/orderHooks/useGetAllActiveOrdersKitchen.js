import orderService from '@/services/orderService';
import { useEffect, useState } from 'react';

const useGetAllActiveOrdersKitchen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);

  const transformeOrderData = (fetchedData) => {
    if (!Array.isArray(fetchedData)) {
      console.warn('Received non-array data:', fetchedData);
      return [];
    }

    return fetchedData.map((order)=>({
        id: order.id,
        table: order.tableNumber,
        status: order?.orderStatus?.description,
        items:order.orderItems.map((item)=>({
            qty: item.quantity,
            menu: item.menu.name,
            catatan: item.description,
        }))
    }))
  }

  const getAllActiveOrdersKitchen = async () =>{
    setIsLoading(true);
    setError(null);

    try {
        const response = await orderService.getAllActiveOrdersKitchen();
        const transformed = transformeOrderData(response);
        setActiveOrders(transformed);
    } catch (err) {
        const errorMessage = err?.response?.data?.message || err.message || "Something went wrong";
        setError(errorMessage);
    }finally{
        setIsLoading(false);
    }
  }

  useEffect(()=>{
    getAllActiveOrdersKitchen();
  },[])

  return {
    activeOrders,
    isLoading,
    error,
    getAllActiveOrdersKitchen
  }
  
}

export default useGetAllActiveOrdersKitchen;