import AdminLayout from "@/components/layout/AdminLayout";
import useGetAllActiveOrdersKitchen from "@/hooks/orderHooks/useGetAllActiveOrdersKitchen";
import useUpdateOrderStatus from "@/hooks/orderHooks/useUpdateOrderStatus";
import useWebsocketOrders from "@/hooks/websocketHooks/useWebsocketOrders";
import React, { useEffect, useState, useRef, useMemo } from "react";

const KitchenPage = () => {
  const { getAllActiveOrdersKitchen, isLoading, error, activeOrders } =
    useGetAllActiveOrdersKitchen();

  const { updateOrderStatus } = useUpdateOrderStatus();
  const { newOrder, setNewOrder } = useWebsocketOrders();

  const updatedData = useMemo(() => [
    ...activeOrders.filter(
      (order) => !newOrder.some((newOrder) => newOrder.id === order.id)
    ),
    ...newOrder,
  ], [activeOrders, newOrder]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const itemsPerPage = 8;

  const firstIndexOfItem = (currentPage - 1) * itemsPerPage;
  const lastIndexOfItem = currentPage * itemsPerPage;
  const paginatedData = updatedData.slice(firstIndexOfItem, lastIndexOfItem);
  const totalPage = Math.ceil(updatedData.length / itemsPerPage);

  const containerRef = useRef(null);

  useEffect(() => {
    setSelectedOrderIndex(0);
  }, [currentPage]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  const handlerKeyDown = async (e) => {
    if (e.key === "ArrowRight") {
      if (selectedOrderIndex < paginatedData.length - 1) {
        setSelectedOrderIndex((prevOrder) => prevOrder + 1);
      } else if (totalPage > currentPage) {
        setCurrentPage(currentPage + 1);
      }
    } else if (e.key === "ArrowLeft") {
      if (selectedOrderIndex > 0) {
        setSelectedOrderIndex((prevIndex) => prevIndex - 1);
      } else if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        setSelectedOrderIndex(itemsPerPage - 1);
      }
    } else if (e.key === "Enter") {
      const orderData = paginatedData[selectedOrderIndex];
      const orderId = orderData.id;
      handleUpdateStatus(orderId);
    }
  };

  const handleUpdateStatus = async (orderId) => {
    const success = await updateOrderStatus(orderId);
    if (success) {
      setNewOrder([]);
      await getAllActiveOrdersKitchen();
    }
  };

  const showMoreOrders = updatedData.length > itemsPerPage;

  return (
    <AdminLayout>
      <div className="container max-h-full min-h-[667px] max-w-screen bg-[#000] mx-auto">
        <div
          tabIndex={0}
          ref={containerRef}
          onKeyDown={handlerKeyDown}
          className="container bg-[#000] h-max-[660px] flex flex-wrap items-start"
        >
          {paginatedData.map((order, index) => (
            <div
              key={index}
              onClick={() => setSelectedOrderIndex(index)}
              className={`
                container
                text-gray-900 
                m-3
                rounded-md 
                max-w-[300px] 
                min-w-[260px] 
                ${
                  selectedOrderIndex === index
                    ? "border-blue-400 border-4 p-1 flex-none"
                    : "hover:border-white-900"
                }
              `}
            >
              <div className="bg-gray-400 flex p-3 justify-between">
                <p>Table: {order.table}</p>
                <p>Order ID: {order.id}</p>
              </div>
              <div className="bg-gray-300 card-body text-wrap">
                <ul className="p-3 space-y-3">
                  {order.items.map((item, index) => (
                    <li className="space-x-3 flex" key={index}>
                      <span>{item.qty}</span>
                      <span>{item.menu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showMoreOrders && (
        <div className="absolute right-6 bottom-5 z-10 text-white">
          More orders...
        </div>
      )}
    </AdminLayout>
  );
};

export default KitchenPage;