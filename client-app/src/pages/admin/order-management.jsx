import Breadcrumb from "@/components/breadcrumb";
import AdminLayout from "@/components/layout/AdminLayout";
import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";

const ManageOrder = () => {
  const tabs = ["Prepared", "Ready", "Served"];
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

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

  const [ordersData, setOrdersData] = React.useState ([
    { id: 1, customer: "John Doe", table: 5, total: 50000, status: "Prepared" },
    { id: 2, customer: "Jane Smith", table: 3, total: 30000, status: "Ready" },
    {
      id: 3,
      customer: "Sam Wilson",
      table: 1,
      total: 400000,
      status: "Served",
    },
  ]);

  const filteredByStatus = ordersData.filter(
    (order) => order.status === activeTab
  );

  const handleStatusChange = (orderId, newStatus) => {
    setOrdersData((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      console.log(ordersData);
  };

 

  const totalPage = Math.ceil(filteredByStatus.length / itemsPerPage);

  const paginatedData = filteredByStatus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <div className="h-screen p-6">
        <div className="p-2 rounded-md bg-white">
          <Breadcrumb />
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>

        <div className="overflow-x-auto mt-6">
          <div className="bg-[#754985] text-white shadow-lg rounded-md">
            <div className="flex justify-between items-center px-4 py-3">
              <div className="flex items-center space-x-2">
                <FaShoppingCart />
                <div>Order List</div>
              </div>
              <input
                type="text"
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
                  paginatedData.map((order, index) => (
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
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)}
                          className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-2 rounded"
                        >
                          <option value="Prepared">Prepared</option>
                          <option value="Ready">Ready</option>
                          <option value="Served">Served</option>
                        </select>
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
      </div>
    </AdminLayout>
  );
};

export default ManageOrder;
