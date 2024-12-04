import AdminLayout from "@/components/layout/adminLayout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import Modal from "@/components/modal-component";
import ModalDelete from "@/components/modal-delete";
import { BiCategory } from "react-icons/bi";
import useGetAllCategory from "@/hooks/categoryHooks/useGetAllCategory";

const ManageCategory = () => {
  const {categories, loading, error, getAllCategory} = useGetAllCategory();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Category Submit");
    handleModalClose();
  };

  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const handleModalUpdateOpen = () => setIsModalUpdateOpen(true);
  const handleModalUpdateClose = () => setIsModalUpdateOpen(false);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    alert("Category Updated Submit");
    handleModalUpdateClose();
  };

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const handleModalDeleteOpen = () => setIsModalDeleteOpen(true);
  const handleModalDeleteClose = () => setIsModalDeleteOpen(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    alert("Category Deleted");
    handleModalDeleteClose();
  };

  const [searchQuery, setSearchQuery] = useState("");
  const handlerSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItem = categories.filter((item) =>
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
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

  const totalPage = Math.ceil(filteredItem.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="h-screen p-6">
        <div className="p-2 rounded-md bg-white">
          <Breadcrumb />
          <h1 className="text-2xl font-bold">CATEGORY</h1>
        </div>
        <div className="my-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by description..."
            value={searchQuery}
            onChange={handlerSearch}
            className="px-4 py-2 border rounded-lg w-full max-w-sm"
          />
          <button
            onClick={handleModalOpen}
            className="px-4 py-2 flex items-center space-x-2 rounded-lg bg-[#754985] text-white"
          >
            <IoMdAdd />
            Add Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full table-auto bg-[#754985] text-white border-collapse shadow-lg rounded-t-md px-4 h-20 py-3 flex items-center space-x-2">
            <BiCategory />
            <p>Category List</p>
          </div>
          <hr></hr>
          <table className="min-w-full table-auto border-collapse bg-[#754985] text-white shadow-lg">
            <thead >
              <tr>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
          </table>
          <div className="max-h-96 overflow-y-scroll">
            <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-b-md">
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              </tbody>
            ): error ? (
              <tbody>
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Error : {error}
                  </td>
                </tr>
              </tbody>
            ): categories.length > 0 ? (
              <tbody>
                  {categories.map((category, index) => (
                    <tr
                      key={category.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-6">{category.description}</td>
                      <td className="py-3 px-6">
                        <div className="mt-2 grid grid-cols-1">
                          <select
                            id="category"
                            name="category"
                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          >
                            <option>Available</option>
                            <option>Unavailable</option>
                          </select>
                          <FaChevronDown
                            aria-hidden="true"
                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500 sm:size-4"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={handleModalUpdateOpen}
                          className="text-blue-500 hover:text-blue-700 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={handleModalDeleteOpen}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaRegTrashCan />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            ):(
              <tbody>
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No categories available.
                    </td>
                  </tr>
                </tbody>
            )}
          </table>
          </div>
        </div>
        {categories.length > 0 ? (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlerPrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
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
              className={`px-4 py-2 rounded-lg ${
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

        {/* Modal Add Category */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title="Category Details"
          onSubmit={handleSubmit}
        >
          <form onSubmit={handleSubmit} method="POST" className="space-y-6 p-8">
            <div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="description"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <input
                    id="description"
                    name="description"
                    type="text"
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            </div>
          </form>
        </Modal>

        {/* Modal Update Category */}
        <Modal
          isOpen={isModalUpdateOpen}
          onClose={handleModalUpdateClose}
          title="Category Details"
          onSubmit={handleUpdateSubmit}
        >
          <form
            onSubmit={handleUpdateSubmit}
            method="POST"
            className="space-y-6 p-8"
          >
            <div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="description"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <input
                    id="description"
                    name="description"
                    type="text"
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            </div>
          </form>
        </Modal>

        {/* Modal Delete Confirmation */}
        <ModalDelete
          isOpen={isModalDeleteOpen}
          onClose={handleModalDeleteClose}
          onSubmit={handleDelete}
        >
          <p>Are you sure want to delete this category?"</p>
        </ModalDelete>
      </div>
    </AdminLayout>
  );
};

export default ManageCategory;
