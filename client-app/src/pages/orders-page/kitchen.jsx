import AdminLayout from "@/components/layout/AdminLayout";
import useGetAllActiveOrdersKitchen from "@/hooks/orderHooks/useGetAllActiveOrdersKitchen";
import useUpdateOrderStatus from "@/hooks/orderHooks/useUpdateOrderStatus";
import useWebsocketOrders from "@/hooks/websocketHooks/useWebsocketOrders";

import React, { useEffect, useState } from "react";

const KitchenPage = () => {
  const { getAllActiveOrdersKitchen, isLoading, error, activeOrders } =
    useGetAllActiveOrdersKitchen();

  const {updateOrderStatus} = useUpdateOrderStatus();
  const {newOrder, setNewOrder} = useWebsocketOrders();

  const updatedData = [...activeOrders.filter(order => !newOrder.some(newOrder => newOrder.orderId === order.orderId)), ...newOrder];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const itemsPerPage = 8;

  const firstIndexOfItem = (currentPage - 1) * itemsPerPage;
  const lastIndexOfItem = currentPage * itemsPerPage;
  const paginatedData = updatedData.slice(firstIndexOfItem, lastIndexOfItem);
  const totalPage = Math.ceil(activeOrders.length / itemsPerPage);

  useEffect(()=>{
    setSelectedOrderIndex(0);
    updatedData;
  },[currentPage]);

  const handlerKeyDown = async (e) => {
    if (e.key === "ArrowRight") {
      if(selectedOrderIndex < paginatedData.length - 1){
        setSelectedOrderIndex(prevOrder => prevOrder + 1);
      }else if (totalPage > currentPage){
        setCurrentPage(currentPage + 1);
      }
    } else if (e.key === "ArrowLeft") {
      if(selectedOrderIndex > 0 ){
        setSelectedOrderIndex(prevOrder => prevOrder - 1);
      }else if (currentPage > 1){
        setCurrentPage(currentPage - 1);
      }
    } else if (e.key === "Enter") {
      const orderData = paginatedData[selectedOrderIndex];
      const prevIndex = selectedOrderIndex;
      const orderId = orderData.orderId;

      handleUpdateStatus(orderId);
      setSelectedOrderIndex(prevIndex);

    }
  };

  const handleUpdateStatus = async (orderId) => {
    const success = await updateOrderStatus(orderId);

    if (success) {
      setNewOrder([]);
      await getAllActiveOrdersKitchen();
    }
  }

  return (
    <AdminLayout>
      <div className="container h-[667px] max-w-screen bg-[#000] mx-auto">
        <div className="container h-max-[660px] flex flex-wrap truncate overflow-hidden ">
        {paginatedData.map((order, index) => (
          <div
            key={order.orderId}
            tabIndex={0}
            onKeyDown={handlerKeyDown}
            onClick={()=> setSelectedOrderIndex(index)}
            className={`
                min-h-[60px] 
                text-gray-900 
                m-3 
                rounded-md 
                shadow-lg 
                mb-3 
                max-w-[300px] 
                min-w-[260px] 
                ${selectedOrderIndex === index ? 'border-blue-400 border-4' : 'hover:border-white-900 hover:border-2'}
              `}
          >
            <div className=" bg-gray-400 flex p-3 justify-between">
              <p>Table: {order.table}</p>
              <p>Order ID: {order.orderId}</p>
            </div>
            <div className=" bg-gray-300 card-body text-wrap ">
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
      {totalPage > currentPage ? (
          <div className=" absolute right-6 bottom-5 z-10 text-white">More orders... </div>
        ) : (
          <div></div>
        )}
    
    </AdminLayout>
  );
};

export default KitchenPage;
