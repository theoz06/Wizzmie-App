import AdminLayout from "@/components/layout/adminLayout";
import React, { useEffect } from "react";
import Breadcrumb from "@/components/breadcrumb";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import Modal from "@/components/modal-component";
import ModalDelete from "@/components/modal-delete";
import { BiCategory } from "react-icons/bi";
import useGetAllCategory from "@/hooks/categoryHooks/useGetAllCategory";
import withAuth from "@/hoc/protectedRoute";
import { FaEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import useCreateCategory from "@/hooks/categoryHooks/useCreateCategory";
import useUpdateCategory from "@/hooks/categoryHooks/useUpdateCategory";
import useDeleteCategory from "@/hooks/categoryHooks/useDeleteCategory";




const ManageCategory = () => {
  const {categories, loading, error: errorGetAllCategory, getAllCategory} = useGetAllCategory();
  const [categoryDescription, setCategoryDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  

  //Create Modal Handler
  const {createCategory, isLoading: loadingCreateCategory, error: errorCreateCategory, setError: setErrorCreateCategory} = useCreateCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setCategoryDescription("");
    setIsModalOpen(false);
    setErrorCreateCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryDetail = {
      description : categoryDescription
    };

    const success = await createCategory(categoryDetail);
    if (success) {
      setCategoryDescription("");
      handleModalClose();
      await getAllCategory();
    }

  };

  //Update Modal Handler
  const {isLoading: loadingUpdateCategory, error: errorUpdateCategory, setError: setErrorUpdateCategory, updateCategory} = useUpdateCategory();
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const handleModalUpdateOpen = (category) => {
    setSelectedCategory(category);
    setCategoryDescription(category.description);
    setIsModalUpdateOpen(true);
  }
  const handleModalUpdateClose = () =>{ 
    setSelectedCategory(null);
    setCategoryDescription("");
    setIsModalUpdateOpen(false);
    setErrorUpdateCategory(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const categoryId = selectedCategory?.id;
  

    if (!categoryId) {
      alert("No Category Selected")
      return
    }else{
      const updateData = {
        description : categoryDescription
      }

      const success = await updateCategory(categoryId, updateData);
      if(success){
        setCategoryDescription("");
        setSelectedCategory(null);
        handleModalUpdateClose();
        await getAllCategory();
      }
    }

  };

  //Delete Modal Handler
  const {DeleteCategory, isLoading: loadingDeleteCategory, error: errorDeleteCategory, setError: setErrorDeleteCategory} = useDeleteCategory();
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const handleModalDeleteOpen = (category) => {
    setSelectedCategory(category);
    setIsModalDeleteOpen(true)
  };
  const handleModalDeleteClose = () => {
    setErrorDeleteCategory(null);
    setIsModalDeleteOpen(false)};

  const handleDelete = async (e) => {
    e.preventDefault();

    const categoryId = selectedCategory?.id;
    if (!categoryId) {
      alert("No Category Selected")
      return
    }
    
    const success = await DeleteCategory(categoryId);
    if(success){
      setSelectedCategory(null);
      alert("Category Deleted");
      await getAllCategory();
      handleModalDeleteClose();
    }

  };


  //Search Handler
  const [searchQuery, setSearchQuery] = useState("");
  const handlerSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredItem = categories.filter((item) =>
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  //Table Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItem.slice(indexOfFirstItem, indexOfLastItem);
  console.log(currentItems);

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
      <div className="h-full min-h-screen p-6">
        <div className="p-2 rounded-md bg-white">
          <Breadcrumb />
          <h1 className="text-2xl font-bold">CATEGORY</h1>
        </div>
        <div className="my-4 flex justify-end space-x-2 pt-10">
          <button
            onClick={handleModalOpen}
            className="px-4 py-2 flex items-center space-x-2 rounded-lg bg-[#754985] text-white"
          >
            <IoMdAdd />
            Add Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full table-auto bg-[#754985] text-white border-collapse shadow-lg rounded-t-md px-4 h-20 py-3 flex justify-between items-center space-x-2">
            <div className="flex items-center space-x-2">
            <BiCategory />
            <p>Category List</p>
            </div>
            <input
            type="text"
            placeholder="Search by description..."
            value={searchQuery}
            onChange={handlerSearch}
            className="px-4 py-2 border rounded-lg w-full max-w-sm"
          />
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
          <div className=" h-96 overflow-y-scroll">
            <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-b-md">
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              </tbody>
            ): errorGetAllCategory ? (
              <tbody>
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Error : {errorGetAllCategory}
                  </td>
                </tr>
              </tbody>
            ): filteredItem.length > 0 ? (
              <tbody>
                  {currentItems.map((category, index) => (
                    <tr
                      key={category.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-6">{category.description}</td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={()=>handleModalUpdateOpen(category)}
                          className="text-blue-500 hover:text-blue-700 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={()=>handleModalDeleteOpen(category)}
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
        ) : (
          <div></div>
        )}

        {/* Modal Add Category */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title="Category Details"
          onSubmit={handleSubmit}
          type="submit"
          isLoading={loadingCreateCategory}
        >
          <form onSubmit={handleSubmit} className="space-y-6 p-8">
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
                    value = {categoryDescription}
                    onChange={(e)=> setCategoryDescription(e.target.value)}
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              {errorCreateCategory && <div style={{ color: "red" }}>{errorCreateCategory}</div>}
            </div>
          </form>
        </Modal>

        {/* Modal Update Category */}
        <Modal
          isOpen={isModalUpdateOpen}
          onClose={handleModalUpdateClose}
          title="Category Details"
          onSubmit={handleUpdateSubmit}
          type="submit"
          disabled={loadingUpdateCategory}
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
                    value={categoryDescription}
                    onChange={(e)=> setCategoryDescription(e.target.value)}
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              {errorUpdateCategory && <div style={{ color: "red" }}>{errorUpdateCategory}</div>}
            </div>
          </form>
        </Modal>

        {/* Modal Delete Confirmation */}
        <ModalDelete
          isOpen={isModalDeleteOpen}
          onClose={handleModalDeleteClose}
          onSubmit={handleDelete}
        >
          <p>Are you sure want to delete this category?</p>
        </ModalDelete>
      </div>
    </AdminLayout>
  );
};

export default withAuth(ManageCategory);
