import Breadcrumb from "@/components/breadcrumb";
import AdminLayout from "@/components/layout/AdminLayout";
import Modal from "@/components/modal-component";
import ModalDelete from "@/components/modal-delete";
import withAuth from "@/hoc/protectedRoute";
import React from "react";
import { useState } from "react";
import { FaEdit, FaRegUser } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import useGetAllUsers from "@/hooks/userHooks/useGetAllUser";
import useCreateUser from "@/hooks/userHooks/useCreateUser";
import { FaChevronDown } from "react-icons/fa";
import useGetRoles from "@/hooks/userHooks/useGetRoles";
import useUpdateUser from "@/hooks/userHooks/useUpdateUser";
import useDeleteUser from "@/hooks/userHooks/useDeleteUser";




const UserManagement = () => {
  // Get All Users Data
  const { users, isLoading, error, getAllUsers } = useGetAllUsers();
  const {roles, error: errorGetRoles} = useGetRoles();

  console.log(roles);

  //Search Handler
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const itemsPerPage = 13;
  const filteredItem = users.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  console.log(filteredItem);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItem.slice(indexOfFirstItem, indexOfLastItem);
  const totalPage = Math.ceil(filteredItem.length / itemsPerPage);

  const searchHandler = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
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

  //Handler Modal Create User
  const [errorEmptyField, setErrorEmptyField] = useState(null);
  const {
    createUser,
    isLoading: loadingCreateUsers,
    error: errorCreateUsers,
    setError: setErrorCreateUsers,
  } = useCreateUser();
  const [userDetails, setUserDetails] = useState({
    name: "",
    role: "",
    password: "",
  });

  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const handlerModalCreateOpen = () => setIsModalCreateOpen(true);
  const handleModalCreateClose = () => {
    setUserDetails({
      name: "",
      role: "",
      password: "",
    });
    setIsModalCreateOpen(false);
    setErrorEmptyField(null);
  };

  const handlerInput = (e) => {
    const { name, value } = e.target;

    setUserDetails((prevData)=>({
      ...prevData,
      [name]: value
    }))
  };

  const handleSubmitNewUser = async (e) => {
    e.preventDefault();

    const { name, role, password } = setUserDetails;

    console.log(name, role, password);


    if (!name || !role || !password) {
      setErrorEmptyField("Äll fields are required, please fullfill!");
    }

    const success = await createUser(userDetails);

    if (success) {
      handleModalCreateClose();
      await getAllUsers();
    }
  };


  //Handler Modal Update
  const {updateUser, isLoading: loadingUpdateUsers, error: errorUpdateUsers, setError: setErrorUpdateUsers} =  useUpdateUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  const handleModalUpdateOpen = (User) => {
    setSelectedUser(User);
    setIsModalUpdateOpen(true);
    console.log(User.role);
    setUserDetails ({
      name: User.name,
      role: User.role,
      
      password: User.password
    })
  };

  const handleModalUpdateClose = () => {
    setSelectedUser(null);
    setIsModalUpdateOpen(false);
    setUserDetails({
      name: "",
      role: "",
      password: "",
    })
  };


  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const userId = selectedUser?.id;

    if(!userId){
      alert("No User Selected")
      return
    }

    const success = await updateUser(userId, userDetails);
    if(success){
      handleModalUpdateClose();
      await getAllUsers();
    };
  };


  //Handler Delete User
  const {deleteUser, isLoading: loadingDeleteUsers, error: errorDeleteUsers} = useDeleteUser();
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const handleModalDeleteOpen = (user) => {
    setSelectedUser(user);
    setIsModalDeleteOpen(true);
  };

  const handleModalDeleteClose = () => {
    setSelectedUser(null);
    setIsModalDeleteOpen(false);
  };

  const handlerDelete = async (e) => {
    e.preventDefault();

    const userId = selectedUser?.id;
    if(!userId){
      alert("No User Selected");
      return
    }

    const success = await deleteUser(userId);
    if(success){
      handleModalDeleteClose();
      await getAllUsers();
    }

    alert("Data Deleted");
    handleModalDeleteClose();
  };

  return (
    <AdminLayout>
      <div className="h-screen p-6">
        <div className="breadcrumb p-2 rounded-md bg-white">
          <Breadcrumb />
          <h1 className="text-2xl font-bold">USER</h1>
        </div>

        <div className="my-4 flex justify-end pt-10 items-center">
          <button
            onClick={handlerModalCreateOpen}
            className="px-4 py-2 flex items-center space-x-2 rounded-lg bg-[#754985] text-white"
          >
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full table-auto bg-[#754985] text-white border-collapse shadow-lg rounded-t-md px-4 h-20 py-3 flex justify-between items-center space-x-2">
            <div className="flex items-center space-x-2">
              <FaRegUser />
              <p>Users List</p>
            </div>
            <input
              type="text"
              onChange={searchHandler}
              value={searchQuery}
              placeholder="Search by name..."
              className="px-4 py-2 text-gray-900 border rounded-lg w-full max-w-sm"
            />
          </div>
          <hr></hr>
          <table className="min-w-full table-auto  border-collapse bg-[#754985] text-white shadow-lg">
            <thead className="sticky">
              <tr>
                <th className="py-3 pl-4 text-left">No</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">NIK</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td
                    colSpan="5"
                    className="text-center bg-white text-gray-900 py-4"
                  >
                    Loading...
                  </td>
                </tr>
              </tbody>
            ) : error ? (
              <tbody>
                <tr>
                  <td
                    colSpan="5"
                    className="text-center bg-white text-red-500 py-4"
                  >
                    {error}
                  </td>
                </tr>
              </tbody>
            ) : filteredItem.length > 0 ? (
              <tbody className="text-gray-900">
                {currentItems.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="py-3 pl-4">{index + 1}</td>
                    <td className="py-3 px-6">{user.name}</td>
                    <td className="py-3 px-6">{user.nik}</td>
                    <td className="py-3 px-6">{user.role}</td>
                    <td className="py-3 px-6 text-center">
                      <button type="button" onClick={()=>handleModalUpdateOpen(user)} className="text-blue-500 hover:text-blue-700 mr-3">
                        <FaEdit />
                      </button>
                      <button type="button" onClick={()=>handleModalDeleteOpen(user)} className="text-red-500 hover:text-red-700">
                        <FaRegTrashCan />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td
                    colSpan="5"
                    className="text-center bg-white text-gray-900 py-4"
                  >
                    No users created yet.
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>

        {/*Modal Add User*/}
        <Modal
          isOpen={isModalCreateOpen}
          onClose={handleModalCreateClose}
          title="New User Details"
          onSubmit={handleSubmitNewUser}
        >
          <form
            onSubmit={handleSubmitNewUser}
            method="POST"
            className="space-y-6 p-8"
          >
            <div>
            {errorEmptyField && <div style={{ color: "red" }}>{errorEmptyField}</div>}
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
                    value={userDetails.name}
                    onChange={handlerInput}
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="role"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Role
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="role"
                    name="role"
                    value={userDetails.role}
                    onChange={handlerInput}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option value="" disabled>Select Role</option>
                    {roles.map((role, index) => {
                      return (
                        <option key={index} value={role}>
                          {role}
                        </option>
                      );
                    })}
                  </select>
                  <FaChevronDown
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500 sm:size-4"
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
                    type="password"
                    name="password"
                    value={userDetails.password}
                    onChange={handlerInput}
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
          title="User Details Update"
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
                    value={userDetails.name}
                    onChange={handlerInput}
                    placeholder="Enter employee name..."
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400  focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="role"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Role
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="role"
                    name="role"
                    value={userDetails.role}
                    onChange={handlerInput}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                  {[userDetails.role, ...roles.filter((role)=> role.toLowerCase() !== userDetails.role.toLowerCase()),].map((role,index) => (
                    <option key={index} value={role}>
                      {role.toLowerCase()}
                    </option>
                  ))}
    
                  </select>
                  <FaChevronDown
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500 sm:size-4"
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
                    type="password"
                    name="password"
                    value={userDetails.password}
                    onChange={handlerInput}
                    placeholder="Enter password..."
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 "
                  />
                </div>
              </div>
            </div>
          </form>
        </Modal>

        {/*Modal Delete Confirmation*/}
        <ModalDelete
          isOpen={isModalDeleteOpen}
          onClose={handleModalDeleteClose}
          onSubmit={handlerDelete}
        >
          <p>Are you sure want to delete this user?</p>
        </ModalDelete>
      </div>
    </AdminLayout>
  );
};

export default withAuth(UserManagement);
