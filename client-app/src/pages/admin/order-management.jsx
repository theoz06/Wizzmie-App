import Breadcrumb from "@/components/breadcrumb";
import AdminLayout from "@/components/layout/AdminLayout";
import ModalDelete from "@/components/modal-delete";
import withAuth from "@/hoc/protectedRoute";
import useGetAllOrders from "@/hooks/orderHooks/useGetAllOrders";
import { useState } from "react";
import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import useUpdateOrderStatus from "@/hooks/orderHooks/useUpdateOrderStatus";
import useWebsocketOrders from "@/hooks/websocketHooks/useWebsocketOrders";

const ManageOrder = () => {
  const tabs = ["Prepared", "Ready To Serve", "Served"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

    const {newOrder} = useWebsocketOrders();

    //Get All Paid Orders
    const {
      transformeData: ordersData,
      isLoading: loadingGetOrders,
      error: errorGetOrders,
      getAllOrders,
    } = useGetAllOrders();

    const updatedOrdersData = [...ordersData, ...newOrder]

    const filteredByStatus = updatedOrdersData.filter(
      (order) => order.status === activeTab
    );

  //Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handlerSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }

  const paginatedData = filteredByStatus.filter((item)=>{
    return item.customer.toLowerCase().includes(searchQuery.toLowerCase());
  })

  const currentItems = paginatedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handlerNext = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlerPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  //Update Order Status
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [
    isModalUpdateOrderStatusConfirmOpen,
    setIsModalUpdateOrderStatusConfirmOpen,
  ] = useState(false);
  const {
    isLoading: loadingUpdateOrderStatus,
    error: errorUpdateOrderStatus,
    updateOrderStatus,
  } = useUpdateOrderStatus();
  const [message, setMessage] = useState("");

  const handlerOrderStatusChangeOpen = (order) => {
    setSelectedOrder(order);
    setIsModalUpdateOrderStatusConfirmOpen(true);
    const newMessage = `Are you sure want to update order status from  ${
      order.status
    }  to  ${order?.status === "Prepared" ? "Ready" : "Served"} ?`;
    setMessage(newMessage);
  };

  const handlerModalOrderStatusClose = () => {
    setSelectedOrder(null);
    setIsModalUpdateOrderStatusConfirmOpen(false);
  };

  const handlerOrderStatusChange = async (e) => {
    e.preventDefault();

    const orderId = selectedOrder?.id;

    const success = await updateOrderStatus(orderId);

    if (success) {
      handlerModalOrderStatusClose();
      await getAllOrders();
    }
  };

  const totalPage = Math.ceil(filteredByStatus.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="h-screen p-6">
        <div className="p-2 rounded-md bg-white">
          <Breadcrumb />
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>

        <div className="overflow-x-auto mt-6 h-[480px] bg-white">
          <div className="bg-[#754985] text-white shadow-lg rounded-md">
            <div className="flex justify-between items-center px-4 py-3">
              <div className="flex items-center space-x-2">
                <FaShoppingCart />
                <div>Order List</div>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handlerSearch}
                placeholder="Search by name..."
                className="px-4 py-2 border rounded-lg max-w-sm text-black"
              />
            </div>
            <div className="border-b border-[#e985bb]">
              <ul className="flex">
                {tabs.map((tab) => (
                  <li
                    key={tab}
                    className={`px-4 py-2 cursor-pointer ${
                      activeTab === tab
                        ? "border-b-2 border-[#e985bb] font-bold"
                        : "text-gray-300 hover:text-[#e985bb]"
                    }`}
                    onClick={() => {
                      setActiveTab(tab);
                      setCurrentPage(1);
                    }}
                  >
                    {tab}
                  </li>
                ))}
              </ul>
            </div>

            <table className="w-full table-auto bg-white text-gray-800 rounded-b-md">
              <thead className="bg-gray-200 text-gray-600">
                <tr>
                  <th className="py-3 px-4 text-left w-12">No</th>
                  <th className="py-3 px-4 text-left">Order ID</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-center w-24">Table</th>
                  <th className="py-3 px-4 text-center w-32">Amount</th>
                  <th className="py-3 px-4 text-center w-40">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  currentItems.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-4 text-left">{index + 1}</td>
                      <td className="py-3 px-4 text-left">{order.id}</td>
                      <td className="py-3 px-4 text-left">{order.customer}</td>
                      <td className="py-3 px-4 text-center">{order.table}</td>
                      <td className="py-3 px-4 text-center">
                        Rp {order.total.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {order.status != "Served" ? (
                          <button
                            onClick={() => handlerOrderStatusChangeOpen(order)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-6 px-4 rounded"
                          >
                            {order.status === "Prepared" ? "Ready" : "Served"}
                          </button>
                        ) : (
                          order.status
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-gray-600 italic"
                    >
                      {`No orders ${activeTab.toLowerCase()} yet.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {filteredByStatus.length > 0 ? (
          <div className="flex justify-between items-center py-4 px-4">
            <button
              onClick={handlerPrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#754985] text-white"
              }`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPage}
            </span>
            <button
              onClick={handlerNext}
              disabled={currentPage === totalPage}
              className={`px-4 py-2 rounded ${
                currentPage === totalPage
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#754985] text-white"
              }`}
            >
              Next
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <ModalDelete
        isOpen={isModalUpdateOrderStatusConfirmOpen}
        onClose={handlerModalOrderStatusClose}
        onSubmit={handlerOrderStatusChange}
        action= "Update"
      >
        {message}
      </ModalDelete>
    </AdminLayout>
  );
};

export default withAuth(ManageOrder);
