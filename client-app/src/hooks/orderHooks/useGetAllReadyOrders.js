import { useEffect, useState } from 'react';
import orderService from '@/services/orderService';
import { useCallback } from 'react';


const useGetAllReadyOrders = () => {
  const [readyOrders, setReadyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const transformeOrderData = (fetchedData) => {
    if (!Array.isArray(fetchedData)) {
      console.warn('Received non-array data:', fetchedData);
      return [];
    }

    try {
      return fetchedData.map((order) => ({
        id: order.id,
        table: order.tableNumber,
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
      const data = response?.data || response; // Handle if response is wrapped
      const transformed = transformeOrderData(data);
      console.log("Ready Order Data API: ", transformed);
      setReadyOrders(transformed);
    } catch (err) {
      console.error('Original error:', err);
      const errorMessage = err?.response?.data?.message || err.message || "Something went wrong";
      setError(errorMessage);
      setReadyOrders([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    getAllReadyOrders();
  }, []);

  return {
    readyOrders,
    loading,
    error,
    getAllReadyOrders
  };
};

export default useGetAllReadyOrders;