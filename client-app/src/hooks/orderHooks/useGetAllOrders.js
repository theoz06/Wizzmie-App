import orderService from "@/services/orderService";
import { useEffect, useState } from "react";


const useGetAllOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [transformeData, setTransformedData] = useState([]);

  const transformeOrderData = (fetchedData) => {
    return fetchedData.map((order)=> ({
        id: order.id,
        customer: order.customer.name,
        table: order.tableNumber,
        total: order.totalAmount,
        status: order.orderStatus.description
    }))
  }

  const getAllOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await orderService.getAllOrders();
        setOrders(response);

        const transformed = transformeOrderData(response);
        setTransformedData(transformed);
    } catch (err) {
        const errorMessage = err?.response?.data?.message || err.message || "An error occured during fetching orders."
        setError(errorMessage);
    }finally {
        setIsLoading(false);
    }
  }

  useEffect(()=>{
    getAllOrders();
  },[]);

  return {
    orders,
    transformeData,
    isLoading,
    error,
    getAllOrders
  }
}

export default useGetAllOrders;