import { useEffect, useState } from 'react'
import orderService from '@/services/orderService'


const useGetAllReadyOrders = () => {
  const [readyOrders, setReadyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const transformeOrderData = (fetchedData) => {
    return fetchedData.map((order)=>({
        id: order.id,
        table: order.tableNumber,
        items:order.orderItems.map((item)=>({
            qty: item.quantity,
            menu: item.menu.name
        }))
    }))
  }

  const getAllReadyOrders = async () => {
    setLoading(true);
    setError(null);

    try {
        const response = await orderService.getAllActiveOrdersPelayan();
        const transformed = transformeOrderData(response);
        console.log("Ready Order Data API: ", transformed);
        setReadyOrders(transformed);
    } catch (err) {
        const errorMessage = err?.response?.data?.message || err.message || "Something went wrong";
        setError(errorMessage);
    }finally{
        setLoading(false);
    }
  }

  useEffect(()=>{
    getAllReadyOrders();
  },[]);

  return {
    readyOrders,
    loading,
    error,
    getAllReadyOrders
  }

}

export default useGetAllReadyOrders;