import AdminLayout from "@/components/layout/AdminLayout";
import React, { useState } from "react";
import useGetAllReadyOrders from "@/hooks/orderHooks/useGetAllReadyOrders";
import useUpdateOrderStatus from "@/hooks/orderHooks/useUpdateOrderStatus";
import Modal from "@/components/modal";
import { FaRegClock } from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import useWebsocketOrders from "@/hooks/websocketHooks/useWebsocketOrders";
import { useEffect, useMemo } from "react";



const PelayanPage = () => {
  const {
    readyOrders = [],
    loading,
    error,
    getAllReadyOrders,
  } = useGetAllReadyOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { updateOrderStatus } = useUpdateOrderStatus();
  const { newOrder, setNewOrder } = useWebsocketOrders("pelayan");

  const updatedData = useMemo(
    () => [
      ...readyOrders.filter(
        (order) => !newOrder.some((newOrder) => newOrder.id === order.id)
      ),
      ...newOrder,
    ],
    [readyOrders, newOrder]
  );

  const [isOpen, setIsOpen] = useState(false);
  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedOrder(null);
  };

  const handleViewItems = (order) => {
    setIsOpen(true);
    setSelectedOrder(order);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    const orderId = selectedOrder?.id;

    console.log("Order Id: " + orderId);

    const success = await updateOrderStatus(orderId);
    if (success) {
      handleCloseModal();
      setSelectedOrder(null);
      setNewOrder([]);
      await getAllReadyOrders();
    }
  };

  return (
    <AdminLayout>
      <div className="m-3 p-3 space-y-6">
        {loading && (
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
              onClick={getAllReadyOrders}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && !Array.isArray(updatedData) && (
          <div className="text-center text-gray-600 p-4">
            <p>No orders ready at the moment</p>
          </div>
        )}

        {!loading &&
          !error &&
          Array.isArray(updatedData) &&
          updatedData.length === 0 && (
            <div className="text-center text-gray-600 p-4">
              <p>No orders ready at the moment</p>
            </div>
          )}

        {!loading &&
          !error &&
          Array.isArray(updatedData) &&
          updatedData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {updatedData.map((data, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center p-4 border-b border-gray-100">
              <div className="h-16 w-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-4">
                <span className="font-bold text-2xl">#{data.table}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Table {data.table}</h3>
                <p className="text-sm text-gray-500">{data.items.length} items</p>
              </div>
            </div>
            <div className="p-4">
              <button
                type="button"
                onClick={() => handleViewItems(data)}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MdOutlineRestaurantMenu className="text-xl" />
                <span>View Order Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
          )}
      </div>

      <Modal
        isOpen={isOpen}
        onSubmit={handleUpdateStatus}
        onClose={handleCloseModal}
        action="Serve"
        titleModal="Order Items"
      >
 <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <FaRegClock className="text-lg" />
                  <span className="font-medium">Order Items</span>
                </div>
                {selectedOrder?.items.map((item, index) => (
                  <div
                    key={index}
                    className=" py-2 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="h-6 w-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm">
                        {item.qty}
                      </span>
                      <span className="font-medium text-gray-900">{item.menu}</span>
                    </div>
                    <div>
                      <span className="relative left-9 text-gray-500 text-sm">{item.catatan}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
      </Modal>
    </AdminLayout>
  );
};

export default PelayanPage;
