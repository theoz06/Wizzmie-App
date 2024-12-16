import Breadcrumb from '@/components/breadcrumb';
import AdminLayout from '@/components/layout/AdminLayout';
import { TfiViewListAlt } from "react-icons/tfi";
import React from 'react'
import { useState } from 'react';
import withAuth from '@/hoc/protectedRoute';
import useGetOrderHistory from '@/hooks/orderHooks/useGetOrderHistory';





const OrderHistory = () => {
    const {transformeData, isLoading, error} = useGetOrderHistory();

    console.log("Data", JSON.stringify(transformeData));


    const handlerSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [searchQuery, setSearchQuery] = useState("");

    const filteredItem = transformeData.filter((item) =>
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

    const paginatedData = filteredItem.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );




  return (
    <AdminLayout>
        <div className='h-screen p-6'>
            <div className='p-2 rounded-md bg-white'>
                <Breadcrumb />
                <h2 className='text-2xl font-bold'>ORDER HISTORY</h2>
            </div>

            <div className='overflow-x-auto mt-6'>
                <div className='bg-[#754985] text-white shadow-lg rounded-md'>
                    <div className='flex justify-between items-center px-4 py-3'>
                        <div className='flex items-center space-x-2'>
                            <TfiViewListAlt />
                            <div>Order List</div>
                        </div>
                        <input type='text' placeholder='Search by name...' className='px-4 py-2 border rounded-lg max-w-sm text-black'/>
                    </div>

                    <table className='w-full table-auto bg-white text-gray-800 rounded-b-md'>
                        <thead className='bg-gray-200 text-gray-600'>
                            <tr>
                                <th className='py-3 px-4 text-left w-12'>No</th>
                                <th className='py-3 px-4 text-left'>Order ID</th>
                                <th className='py-3 px-4 text-left'>Customer</th>
                                <th className='py-3 px-4 text-center w-24'>Table</th>
                                <th className='py-3 px-4 text-center w-32'>Amount</th>
                                <th className='py-3 px-4 text-center w-40'>Updated By</th>
                            </tr>
                        </thead>
                        <tbody>
                        {transformeData.length > 0 ? (
                            paginatedData.map((order,index) => (
                                <tr key= {order.id} className= {`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                                    <td className='py-3 px-4 text-left'>{index + 1}</td>
                                    <td className='py-3 px-4 text-left'>{order.id}</td>
                                    <td className='py-3 px-4 text-left'>{order.customer}</td>
                                    <td className='py-3 px-4 text-center'>{order.table}</td>
                                    <td className='py-3 px-4 text-center'>Rp {order.total.toLocaleString('id-ID')}</td>
                                    <td className='py-3 px-4 text-center'>{order.pelayan}</td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan={6} className='py-6 text-center text-gray-600 italic'>No orders yet.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                {paginatedData.length > 0 ? (
                    <div className='flex justify-between items-center py-4 px-4'>
                    <button 
                        onClick={handlerPrev}
                        disabled = {currentPage === 1}
                    className={`'px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#754985] text-white'}`}>Previous</button>
                    <span>{currentPage} of {totalPage}</span>
                    <button className={`px-4 py-2 rounded ${currentPage === totalPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#754985] text-white'}`}>Next</button>
                </div>
                ):(
                    <div></div>
                )}
                
            </div>
        </div>
    </AdminLayout>
  )
}

export default withAuth(OrderHistory);