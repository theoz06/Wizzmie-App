import Breadcrumb from "@/components/breadcrumb";
import AdminLayout from "@/components/layout/AdminLayout";
import Modal from "@/components/modal-component";
import ModalDelete from "@/components/modal-delete";
import withAuth from "@/hoc/protectedRoute";
import React from "react";
import { useState } from "react";
import { FaEdit, FaRegUser } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";


const UserManagement = () => {
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const handlerModalCreateOpen = () => setIsModalCreateOpen(true);
  const handleModalCreateClose = () => setIsModalCreateOpen(false);
  const handleSubmitNewUser = async (e) => {
    e.preventDefault();
    alert("Data Submit");
    handleModalCreateClose();
  };

  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const handleModalUpdateOpen = () => setIsModalUpdateOpen(true);
  const handleModalUpdateClose = () => setIsModalUpdateOpen(false);
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    alert("Data Updated Submit");
    handleModalUpdateClose();
  };

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const handleModalDeleteOpen = () => setIsModalDeleteOpen(true);
  const handleModalDeleteClose = () => setIsModalDeleteOpen(false);
  const handleDelete = async (e) => {
    e.preventDefault();
    alert("Data Deleted");
    handleModalDeleteClose();
  };

  const userData = [];
  return (
    <AdminLayout>
      <div className="h-screen p-6">
      <div className="breadcrumb p-2 rounded-md bg-white">
        <Breadcrumb />
        <h1 className="text-2xl font-bold">USER</h1>
      </div>

      <div className="my-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 border rounded-lg w-full max-w-sm"
        />
        <button
          onClick={handlerModalCreateOpen}
          className="px-4 py-2 flex items-center space-x-2 rounded-lg bg-[#754985] text-white"
        >
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full table-auto bg-[#754985] text-white border-collapse shadow-lg rounded-t-md px-4 h-20 py-3 flex items-center space-x-2">
          <FaRegUser/>
          <p>Users List</p>
        </div>
        <hr></hr>
        <table className="min-w-full table-auto  border-collapse bg-[#754985] text-white shadow-lg">
          <thead>
            <tr>
              <th className="py-3 pl-4 text-left">No</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">NIK</th>
              <th className="py-3 px-6 text-center">Password</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
        </table>
        <div className="max-h-96 overflow-y-scroll">
          <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-b-md">
            {userData.length > 0 ? (
              <tbody>
                <tr
                  key={user.id}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                >
                  <td className="py-3 pl-4 text-center">{index + 1}</td>
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6">{user.nik}</td>
                  <td className="py-3 px-6">{user.password}</td>
                  <td className="py-3 px-6 text-center">
                    <button className="text-blue-500 hover:text-blue-700 mr-3">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaRegTrashCan />
                    </button>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No users created yet.
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/*Modal Add User*/}
      <Modal
        isOpen={isModalCreateOpen}
        onClose={handleModalCreateClose}
        title="User Details"
        onSubmit={handleSubmitNewUser}
      >
        <form
          onSubmit={handleSubmitNewUser}
          method="POST"
          className="space-y-6 p-8"
        >
          <div>
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  type="text"
                  name="password"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>
      {/*Modal Update User*/}

      <Modal
        isOpen={isModalUpdateOpen}
        onClose={handleModalUpdateClose}
        title="User Update"
        onSubmit={handleUpdateSubmit}
      >
        <form
          onSubmit={handleUpdateSubmit}
          method="POST"
          className="space-y-6 p-8 "
        >
          <div>
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter employee name..."
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400  focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  type="text"
                  name="password"
                  placeholder="Enter password..."
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 "
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/*Modal Delete Confirmation*/}
      <ModalDelete isOpen={isModalDeleteOpen} onClose={handleModalDeleteClose} onSubmit={handleDelete}>
        <p>Are you sure want to delete this user?</p>
      </ModalDelete>
      </div>

    </AdminLayout>
  );
};

export default withAuth(UserManagement);
