import { useEffect, useState } from 'react';
import orderService from '@/services/orderService';
import { useCallback } from 'react';


const useGetAllReadyOrders = () => {
  const [readyOrders, setReadyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const transformeOrderData = (fetchedData) => {
    if (!Array.isArray(fetchedData)) {
      return [];
    }

    try {
      return fetchedData.map((order) => ({
        id: order.id,
        table: order.tableNumber,
        status: order?.orderStatus?.description,
        items: Array.isArray(order.orderItems) 
          ? order.orderItems.map((item) => ({
              qty: item.quantity,
              menu: item.menu?.name || 'Unknown Menu',
              catatan: item.description,
            }))
          : []
      }));
    } catch (err) {
      console.error('Error transforming order data:', err);
      return [];
    }
  };

  const getAllReadyOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await orderService.getAllActiveOrdersPelayan();
      const data = response?.data || response; 
      const transformed = transformeOrderData(data);
      setReadyOrders(transformed);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || "Something went wrong";
      setError(errorMessage);
      setReadyOrders([]); 
    } finally {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    getAllReadyOrders();
  }, []);

  return {
    readyOrders,
    setReadyOrders,
    loading,
    error,
    getAllReadyOrders
  };
};

export default useGetAllReadyOrders;