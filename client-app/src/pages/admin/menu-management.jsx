import AdminLayout from "@/components/layout/adminLayout";
import Breadcrumb from "@/components/breadcrumb";
import React from "react";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Link from "next/link";
import { FaChevronDown, FaEdit } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";
import Modal from "@/components/modal-component";
import ModalDelete from "@/components/modal-delete";
import { MdMenuBook } from "react-icons/md";
import withAuth from "@/hoc/protectedRoute";



const MenuManagement = () => {
  const menuData = [
    { id: 1, name: "Nasi Goreng", price: 20000, category: "Main Course" },
    { id: 2, name: "Ayam Bakar", price: 25000, category: "Main Course" },
    { id: 3, name: "Es Teh", price: 5000, category: "Beverage" },
    { id: 4, name: "Mie Goreng", price: 18000, category: "Main Course" },
    { id: 5, name: "Es Jeruk", price: 7000, category: "Beverage" },
    { id: 6, name: "Ayam Goreng", price: 22000, category: "Main Course" },
    { id: 7, name: "Soto Ayam", price: 15000, category: "Soup" },
    { id: 8, name: "Bakso", price: 25000, category: "Soup" },
    { id: 9, name: "Teh Manis", price: 4000, category: "Beverage" },
    { id: 10, name: "Nasi Uduk", price: 12000, category: "Main Course" },
    { id: 11, name: "Pizza", price: 50000, category: "Main Course" },
    { id: 12, name: "Burger", price: 30000, category: "Main Course" },
    { id: 13, name: "Salad", price: 15000, category: "Appetizer" },
    { id: 14, name: "Pasta", price: 40000, category: "Main Course" },
    { id: 15, name: "Sushi", price: 50000, category: "Main Course" },
    { id: 16, name: "Dumplings", price: 25000, category: "Appetizer" },
    { id: 17, name: "Taco", price: 15000, category: "Main Course" },
    { id: 18, name: "Ice Cream", price: 10000, category: "Dessert" },
    { id: 19, name: "Pancakes", price: 15000, category: "Dessert" },
    { id: 20, name: "Fried Rice", price: 20000, category: "Main Course" },
  ];

  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const handleModalUpdateOpen = () => setIsModalUpdateOpen(true); // Membuka modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk moda
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredItem = menuData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItem.slice(indexOfFirstItem, indexOfLastItem);

  const handlerSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const totalPage = Math.ceil(filteredItem.length / itemsPerPage);

  const handleModalOpen = () => setIsModalOpen(true); // Membuka modal
  const handleModalClose = () => {
    setIsModalOpen(false); // Menutup modal
    // setNewMenu({ name: "", price: "", category: "" }); // Reset form
  };

  const handleModalUpdateClose = () => {
    setIsModalUpdateOpen(false); // Menutup modal
    // setNewMenu({ name: "", price: "", category: "" }); // Reset form
  };

  const handleModalDeleteOpen = () => setIsModalDeleteOpen(true); // Membuka modal
  const handleModalDeleteClose = () => setIsModalDeleteOpen(false); // Menutup modal

  const handleAddMenu = (e) => {
    e.preventDefault();
    console.log("New Menu:", newMenu); // Replace with API call to save new menu
    handleModalClose();
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Data Submit");
    handleModalClose();
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    alert("Data Updated Submit");
    handleModalUpdateClose();
  };

  const handlerDelete = async (e) => {
    e.preventDefault();
    alert("Data Deleted");
    handleModalDeleteClose;
  };

  return (
    <AdminLayout>
    <div className="h-max-screen p-6">
    <div className="breadcrumb p-2 rounded-md bg-white">
        <Breadcrumb />
        <h1 className="text-2xl font-bold">MENU</h1>
      </div>
      <div className="my-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by Name..."
          value={searchQuery}
          onChange={handlerSearch}
          className="px-4 py-2 border rounded-lg w-full max-w-sm"
        />
        <button
          onClick={handleModalOpen}
          className="px-4 py-2 flex items-center space-x-2 rounded-lg bg-[#754985] text-white"
        >
          <IoMdAdd />
          Add Menu
        </button>
      </div>
      <div className="overflow-x-auto">
      <div className="min-w-full table-auto bg-[#754985] text-white border-collapse shadow-lg rounded-t-md px-4 h-20 py-3 flex items-center space-x-2">
          <MdMenuBook/>
          <p>Menus List</p>
        </div>
        <hr></hr>
        <table className="min-w-full table-auto bg-[#754985] text-white border-collapse shadow-lg">
          <thead className="">
            <tr>
              <th className="py-3 pl-4 text-left">NO</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-center">Available</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
        </table>
        <div className="max-h-96 overflow-y-scroll">
          <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-b-md">
            <tbody>
              {currentItems.map((menu, index) => (
                <tr
                  key={menu.id}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                >
                  <td className="py-3 pl-4 text-center">{index + 1}</td>
                  <td className="py-3 px-6">{menu.name}</td>
                  <td className="py-3 px-6">Examplesiiuiuiuuhuhuhuu</td>
                  <td className="py-3 px-6">{menu.category}</td>
                  <td className="py-3 px-6">{menu.price}</td>
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
          </table>
        </div>
      </div>
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

      {/* Modal Create */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Menu Details"
        onSubmit={handleSubmit}
      >
        <form onSubmit={handleSubmit} method="POST" className="space-y-6 p-8">
          <div>
            <div className="sm:col-span-3">
              <label
                htmlFor="menu-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="menu-name"
                  name="menu-name"
                  type="text"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="country"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Category
            </label>
            <div className="mt-2 grid grid-cols-1">
              <select
                id="category"
                name="category"
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option>Sushi</option>
                <option>Rice</option>
                <option>Mie</option>
                <option>Coffee</option>
                <option>Frape</option>
                <option>Non Coffee</option>
                <option>Gelato</option>
              </select>
              <FaChevronDown
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500 sm:size-4"
              />
            </div>
          </div>

          <div>
            <div className="sm:col-span-3">
              <label
                htmlFor="description"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  defaultValue={""}
                />
              </div>
              <p className="mt-3 text-sm/6 text-gray-600">
                Write a few sentences about the menu.
              </p>
            </div>
          </div>
          <div>
            <div className="sm:col-span-3">
              <label
                htmlFor="price"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Price
              </label>
              <div className="mt-2">
                <input
                  id="price"
                  name="price"
                  type="text"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
          <div className="col-span-full">
            <label
              htmlFor="photo"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Image
            </label>
            <div className="mt-2 flex items-center gap-x-3">
              <input type="file" />
              <IoFastFoodOutline
                aria-hidden="true"
                className="size-12 text-gray-300"
              />
            </div>
          </div>

          <fieldset>
            <legend className="text-sm/6 font-semibold text-gray-900">
              Avalaibility
            </legend>
            <div className="mt-1 space-y-1 flex justify-between items-center  ">
              <div className="flex items-center gap-x-3">
                <input
                  defaultChecked
                  id="availaible"
                  name="availaible"
                  type="radio"
                  className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                />
                <label
                  htmlFor="availaible"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Available
                </label>
              </div>
              <div className="flex items-center gap-x-3">
                <input
                  id="not-available"
                  name="not-available"
                  type="radio"
                  className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                />
                <label
                  htmlFor="not-available"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Not Available
                </label>
              </div>
            </div>
          </fieldset>
        </form>
      </Modal>

      {/* Modal Update */}
      <Modal
        isOpen={isModalUpdateOpen}
        onClose={handleModalUpdateClose}
        title="Menu Details"
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
                htmlFor="menu-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="menu-name"
                  name="menu-name"
                  type="text"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="country"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Category
            </label>
            <div className="mt-2 grid grid-cols-1">
              <select
                id="category"
                name="category"
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option>Sushi</option>
                <option>Rice</option>
                <option>Mie</option>
                <option>Coffee</option>
                <option>Frape</option>
                <option>Non Coffee</option>
                <option>Gelato</option>
              </select>
              <FaChevronDown
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500 sm:size-4"
              />
            </div>
          </div>

          <div>
            <div className="sm:col-span-3">
              <label
                htmlFor="description"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  defaultValue={""}
                />
              </div>
              <p className="mt-3 text-sm/6 text-gray-600">
                Write a few sentences about the menu.
              </p>
            </div>
          </div>
          <div>
            <div className="sm:col-span-3">
              <label
                htmlFor="price"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Price
              </label>
              <div className="mt-2">
                <input
                  id="price"
                  name="price"
                  type="text"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
          <div className="col-span-full">
            <label
              htmlFor="photo"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Image
            </label>
            <div className="mt-2 flex items-center gap-x-3">
              <input type="file" />
              <IoFastFoodOutline
                aria-hidden="true"
                className="size-12 text-gray-300"
              />
            </div>
          </div>

          <fieldset>
            <legend className="text-sm/6 font-semibold text-gray-900">
              Avalaibility
            </legend>
            <div className="mt-1 space-y-1 flex justify-between items-center  ">
              <div className="flex items-center gap-x-3">
                <input
                  defaultChecked
                  id="availaible"
                  name="availaible"
                  type="radio"
                  className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                />
                <label
                  htmlFor="availaible"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Available
                </label>
              </div>
              <div className="flex items-center gap-x-3">
                <input
                  id="not-available"
                  name="not-available"
                  type="radio"
                  className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                />
                <label
                  htmlFor="not-available"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Not Available
                </label>
              </div>
            </div>
          </fieldset>
        </form>
      </Modal>

      {/* Modal Delete */}
      <ModalDelete isOpen={isModalDeleteOpen} onClose={handleModalDeleteClose} onSubmit={handlerDelete}>
          <p>Are you sure wants to delete this menu?</p>
      </ModalDelete>
    </div>

    </AdminLayout>
  );
};

export default withAuth(MenuManagement);
