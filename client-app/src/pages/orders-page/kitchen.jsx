import AdminLayout from "@/components/layout/AdminLayout";
import NotificationSound from "@/components/notificationSound";
import useGetAllActiveOrdersKitchen from "@/hooks/orderHooks/useGetAllActiveOrdersKitchen";
import useUpdateOrderStatus from "@/hooks/orderHooks/useUpdateOrderStatus";
import useWebsocketOrders from "@/hooks/websocketHooks/useWebsocketOrders";
import React, { useEffect, useState, useRef, useMemo } from "react";

const KitchenPage = () => {
  const { getAllActiveOrdersKitchen, isLoading, error, activeOrders } =
    useGetAllActiveOrdersKitchen();

  const { updateOrderStatus } = useUpdateOrderStatus();
  const { newOrder, setNewOrder } = useWebsocketOrders("kitchen");

  const mergedOrders = useMemo(
    () => [
      ...activeOrders.filter(
        (order) => !newOrder.some((newOrder) => newOrder.id === order.id)
      ),
      ...newOrder,
    ],
    [activeOrders, newOrder]
  );

  const updatedData = useMemo(()=> {
    return mergedOrders.filter((order) => order.status.toLowerCase() === "prepared")
  }, [mergedOrders])

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const itemsPerPage = 8;

  const firstIndexOfItem = (currentPage - 1) * itemsPerPage;
  const lastIndexOfItem = currentPage * itemsPerPage;
  const paginatedData = updatedData.slice(firstIndexOfItem, lastIndexOfItem);
  const totalPage = Math.ceil(updatedData.length / itemsPerPage);

  const containerRef = useRef(null);

  useEffect(() => {
    const focusContainer = () => {
      if (containerRef.current) {
        containerRef.current.focus();
      }
    };

    // Focus on mount
    focusContainer();

    // Set up interval to check and restore focus
    const focusInterval = setInterval(focusContainer, 1000);

    return () => clearInterval(focusInterval);
  }, []);

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
      setNewOrder((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    }
  };

  const showMoreOrders = updatedData.length > itemsPerPage;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-full flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="h-full flex items-center justify-center bg-gray-900">
          <div className="text-red-500">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <NotificationSound soundUrl="/sounds/office-2-453.mp3" newOrder={newOrder} />
      <div className="h-full flex flex-col bg-gray-900">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-indigo-600"></div>
            <p className="text-gray-600 font-medium">Loading orders...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-96 space-y-4 bg-red-50 rounded-lg">
            <div className="text-red-500 text-5xl">⚠️</div>
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={getAllActiveOrdersKitchen}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading &&
          !error &&
          Array.isArray(paginatedData) &&
          paginatedData.length === 0 && (
            <div className="text-center text-gray-600 p-4">
              <p>No orders ready at the moment</p>
            </div>
          )}

        <div className="flex-1 overflow-auto p-4">
          <div
            tabIndex={0}
            ref={containerRef}
            onKeyDown={handlerKeyDown}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-auto outline-none"
          >
            {paginatedData.map((order, index) => (
              <div
                key={order.id || index}
                onClick={() => setSelectedOrderIndex(index)}
                className={`
                  h-fit
                  bg-gray-800
                  rounded-lg
                  overflow-hidden
                  shadow-lg
                  transition-all
                  duration-200
                  cursor-pointer
                  hover:transform
                  hover:scale-[1.02]
                  ${
                    selectedOrderIndex === index
                      ? "ring-2 ring-blue-500 shadow-blue-500/50"
                      : "hover:shadow-xl"
                  }
                `}
              >
                {/* Order Header */}
                <div className="bg-gray-700 px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        #{order.table}
                      </span>
                    </div>
                    <span className="text-gray-200 font-medium">
                      Table {order.table}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">#{order.id}</span>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <ul className="space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="space-x-3 text-gray-300 py-2 px-3 rounded-md bg-gray-700/50"
                      >
                        <div className="flex items-center space-x-3 text-gray-300">
                          <span className="flex items-center justify-center bg-blue-500/20 text-blue-400 h-6 w-6 rounded-full text-sm font-medium">
                            {item.qty}
                          </span>
                          <span className="flex-1 font-medium">
                            {item.menu}
                          </span>
                        </div>
                        {item.catatan && (
                          <span className="relative left-7 text-gray-400 text-xs font-sm">
                            {item.catatan}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Order Footer */}
                <div className="bg-gray-700/50 px-4 py-3 mt-2">
                  <div className="text-sm text-gray-400">
                    {order.items.length} items
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* More Orders Indicator */}
        {showMoreOrders && (
          <div className="absolute right-6 bottom-6 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg animate-bounce">
            More orders available
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default KitchenPage;
