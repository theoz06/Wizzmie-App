import AdminLayout from "@/components/layout/AdminLayout";
import Breadcrumb from "@/components/breadcrumb";
import React from "react";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaChevronDown, FaEdit } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";
import Modal from "@/components/modal-component";
import ModalDelete from "@/components/modal-delete";
import { MdMenuBook } from "react-icons/md";
import withAuth from "@/hoc/protectedRoute";
import useGetAllMenu from "@/hooks/menuHooks/useGetAllMenu";
import useCreateMenu from "@/hooks/menuHooks/useCreateMenu";
import useGetAllCategory from "@/hooks/categoryHooks/useGetAllCategory";
import useUpdateMenuAvailability from "@/hooks/menuHooks/useUpdateMenuAvailability";
import useUpdateMenu from "@/hooks/menuHooks/useUpdateMenu";
import useDeleteMenu from "@/hooks/menuHooks/useDeleteMenu";







const MenuManagement = () => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [menuData, setMenuData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: null,
    isAvailable: "true",
  })


  //Get All Menu Data
  const { menus,isLoading: loadingGetAllMenu, error: errorGetAllMenu, getAllMenu} = useGetAllMenu();
  
  const {categories} = useGetAllCategory();


  // Handler Create Menu
  const {createMenu, isLoading: loadingCreateMenu, error: errorCreateMenu, setError: setErrorCreateMenu} = useCreateMenu();
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false); 
  const handleModalOpen = () => setIsModalCreateOpen(true);
  const handleModalClose = () => {
    setIsModalCreateOpen(false);
    setMenuData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      image: null,
      isAvailable: true,
    });
    setErrorCreateMenu(null);
  };

  const handlerInput = (e) => {
    const { name, value , type, files} = e.target;
    
    setMenuData((prevData) =>({
      ...prevData,
      [name]: type === "file" ? e.target.files[0] : value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const menuDetails = new FormData();
    menuDetails.append("name", menuData.name);
    menuDetails.append("description", menuData.description);
    menuDetails.append("price", menuData.price);
    menuDetails.append("category_id", menuData.categoryId);
    menuDetails.append("isAvailable", menuData.isAvailable);
    
    if(menuData.image instanceof File){
      menuDetails.append("image", menuData.image);
    }

    const success = await createMenu(menuDetails);
    if (success) {
      handleModalClose();
      await getAllMenu();
    }
  };
  
  // Handler Update Availablelity Menu
  const {updateAvailability, isLoading: loadingUpdateAvailability, error: errorUpdateAvailability} = useUpdateMenuAvailability();

  const handlerUpdateAvailability = async (id, isAvailable) => {

    const newAvailability = {isAvailable}

    const success = await updateAvailability(id, newAvailability);
    if(success){
      await getAllMenu();
    }
  }

  const handlerAvailabilityChange = (e, menuId) => {
    const isAvailable = e.target.value === "true";
    handlerUpdateAvailability(menuId, isAvailable)
  }



  // Handler Modal Update
  const {updateMenu, isLoading: loadingUpdateMenu, error: errorUpdateMenu, setError: setErrorUpdateMenu} = useUpdateMenu();
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const handleModalUpdateClose = () => {
    setSelectedMenu(null);
    setMenuData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      image: null,
      isAvailable: "true",
    })
    setIsModalUpdateOpen(false); 
  };

  const handleModalUpdateOpen = (menu) => {
    console.log("menu: " + menu);
    setSelectedMenu(menu);
    setMenuData({
      name: menu.name,
      description: menu.description,
      price: menu.price,
      categoryId: menu.category?.id,
      image: menu.image,
      isAvailable: menu.isAvailable ? "true" : "false",
    });
    setIsModalUpdateOpen(true);
  }; 

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    const menuId = selectedMenu?.id;

    if(!menuId){
      alert("No Menu Selected")
      return
    }else{
      const newMenuDetails = new FormData();
      newMenuDetails.append("name", menuData.name);
      newMenuDetails.append("description", menuData.description);
      newMenuDetails.append("price", menuData.price);
      newMenuDetails.append("category_id", menuData.categoryId);
      newMenuDetails.append("isAvailable", menuData.isAvailable);
      

      if(menuData.image instanceof File){
        newMenuDetails.append("image", menuData.image);
      }

      const success = await updateMenu(menuId, newMenuDetails);
      if(success){
        handleModalUpdateClose();
        await getAllMenu();
      }
    }
    
  };


  // Handler Delete Menu
  const {deleteMenu, isLoading: loadingDeleteMenu, error: errorDeleteMenu, setError: setErrorDeleteMenu} = useDeleteMenu();
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const handleModalDeleteOpen = (menu) => {
    setSelectedMenu(menu);
    setIsModalDeleteOpen(true);
  }; 

  const handleModalDeleteClose = () => {
    setSelectedMenu(null);
    setIsModalDeleteOpen(false);
  }; 

  const handlerDelete = async (e) => {
    e.preventDefault();

    const menuId = selectedMenu?.id;
    console.log("Menu Id:" + menuId);

    if(!menuId){
      alert("No Menu Selected.");
      return;
    }else{
      const success = await deleteMenu(menuId);
      if(success){
        handleModalDeleteClose();
        await getAllMenu();
      }
    }
  };


  //Pagination 
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const filteredItem = menus.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItem.slice(indexOfFirstItem, indexOfLastItem);

  const handlerSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const totalPage = Math.ceil(filteredItem.length / itemsPerPage);

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



  return (
    <AdminLayout>
      <div className="h-full min-h-screen p-6">
        <div className="breadcrumb p-2 rounded-md bg-white">
          <Breadcrumb />
          <h1 className="text-2xl font-bold">MENU</h1>
        </div>
        <div className="my-4 flex pt-10  justify-end space-x-2">
          <button
            onClick={handleModalOpen}
            className="px-4 py-2 flex items-center space-x-2 rounded-lg bg-[#754985] text-white"
          >
            <IoMdAdd />
            Add Menu
          </button>
        </div>
        <div className="overflow-x-auto h-max-[420px] ">
          <div className="min-w-full table-auto bg-[#754985] text-white border-collapse shadow-lg rounded-t-md px-4 h-20 py-3 flex items-center space-x-2 justify-between">
            <div className="flex items-center space-x-2">
            <MdMenuBook />
            <p>Menus List</p>
            </div>
            <input
            type="text"
            placeholder="Search by Name..."
            value={searchQuery}
            onChange={handlerSearch}
            className="px-4 py-2 text-gray-900 border rounded-lg w-full max-w-sm"
          />
          </div>
          <hr></hr>
          <table className="min-w-full table-auto bg-[#754985] text-white border-collapse shadow-lg">
            <thead className="sticky">
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
            {loadingGetAllMenu ? (
                <tbody>
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                </tbody>
              ) : errorGetAllMenu ? (
                <tbody>
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      Error : {errorGetAllMenu}
                    </td>
                  </tr>
                </tbody>
              ) : filteredItem.length > 0 ? (
                <tbody className="text-gray-900">
                  {currentItems.map((menu, index) => (
                    <tr
                      key={menu.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className="py-3 pl-4 text-center">{index + 1}</td>
                      <td className="py-3 px-6">{menu.name}</td>
                      <td className="py-3 px-6">{menu.description}</td>
                      <td className="py-3 px-6">{menu.category.description}</td>
                      <td className="py-3 px-6">{menu.price}</td>
                      <td className="py-3 px-6">
                        <div className="mt-2 grid grid-cols-1">
                          <select
                            id="availability"
                            name="isAvailable"
                            value={menu.isAvailable ? "true" : "false"}
                            onChange={(e) => handlerAvailabilityChange(e, menu.id)}
                            className={`col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pl-3 pr-8 text-base   sm:text-sm/6 ${menu.isAvailable ? "bg-green-500 text-white focus:outline-green-100 "  : "bg-red-500 text-white focus:outline-red-100"} `}
                          >
                            <option value="true" >Available</option>
                            <option value="false">Unavailable</option>
                          </select>
                          <FaChevronDown
                            aria-hidden="true"
                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500 sm:size-4"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={()=>handleModalUpdateOpen(menu)}
                          className="text-blue-500 hover:text-blue-700 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={()=>handleModalDeleteOpen(menu)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaRegTrashCan />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="7" className="text-center py-4 bg-white text-gray-900">
                      No menus available.
                    </td>
                  </tr>
                </tbody>
              )}
          </table>
        </div>
        {filteredItem.length > 0 ? (
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
        ):(
          <div></div>
        )}


        {/* Modal Create */}
        <Modal
          isOpen={isModalCreateOpen}
          onClose={handleModalClose}
          title="Menu Details"
          onSubmit={handleSubmit}
        >
          <form onSubmit={handleSubmit} method="POST" className="space-y-6 p-8" encType="multipart/form-data">
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
                    id="name"
                    name="name"
                    value={menuData.name}
                    type="text"
                    onChange={handlerInput}
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
                  id="categoryId"
                  name="categoryId"
                  value={menuData.categoryId}
                  onChange={handlerInput}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option value= "">Select Category</option>
                  {categories.map((category) => {
                    return (
                      <option key={category.id} value={category.id}>
                        {category.description}
                      </option>
                    )
                  })}
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
                    value={menuData.description}
                    onChange={handlerInput}
                    rows={3}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                    value={menuData.price}
                    onChange={handlerInput}
                    type="number"
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="image"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Image
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <input name="image" onChange={handlerInput} type="file" accept="image/*" />
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
                    name="isAvailable"
                    value="true"
                    checked={menuData.isAvailable === "true"}
                    onChange={handlerInput}
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
                    name="isAvailable"
                    value="false"
                    checked={menuData.isAvailable === "false"}
                    onChange={handlerInput}
                    type="radio"
                    className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                  />
                  <label
                    htmlFor="Available"
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
          title="Update Menu Details"
          onSubmit={handleUpdateSubmit}
        >
          <form
            onSubmit={handleUpdateSubmit}
            method="PUT"
            className="space-y-6 p-8"
            encType="multipart/form-data"
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
                    name="name"
                    value={menuData.name}
                    onChange={handlerInput}
                    type="text"
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="category"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Category
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="category"
                  name="categoryId"
                  value={menuData.categoryId}
                  onChange={handlerInput}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option value= "" selected disabled>
                    {menuData.categoryId ? categories.find((category)=> category.id === menuData.categoryId)?.description : "Select Category"}
                  </option>
                  {categories.map((category)=>(
                    <option value={category.id} key={category.id} >{category.description}</option>
                  ))}
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
                    value={menuData.description}
                    onChange={handlerInput}
                    rows={3}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                    type="number"
                    value={menuData.price}
                    onChange={handlerInput}
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="image"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Image
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <input type="file" name="image" onChange={handlerInput} accept="image/*"/>
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
                    id="availaible"
                    name="isAvailable"
                    value="true"
                    checked={menuData.isAvailable === "true"}
                    onChange={handlerInput}
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
                    name="isAvailable"
                    type="radio"
                    value="false"
                    checked={menuData.isAvailable === "false"}
                    onChange={handlerInput}
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
        <ModalDelete
          isOpen={isModalDeleteOpen}
          onClose={handleModalDeleteClose}
          onSubmit={handlerDelete}
          action="Delete"
        >
          <p>Are you sure wants to delete this menu?</p>
        </ModalDelete>
      </div>
    </AdminLayout>
  );
};

export default withAuth(MenuManagement);
