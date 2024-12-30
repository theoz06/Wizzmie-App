import AdminLayout from '@/components/layout/AdminLayout';
import React, { useState } from 'react';
import useGetAllReadyOrders from '@/hooks/orderHooks/useGetAllReadyOrders';
import useUpdateOrderStatus from '@/hooks/orderHooks/useUpdateOrderStatus';
import Modal from '@/components/modal';

const PelayanPage = () => {
  const {readyOrders, loading, error, getAllReadyOrders} = useGetAllReadyOrders();
  const [selectedOrder,setSelectedOrder] = useState(null);
  const {updateOrderStatus} = useUpdateOrderStatus();

  const [isOpen, setIsOpen] = useState(false);
  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedOrder(null);
  }

  const handleViewItems = (order) => {
    setIsOpen(true);
    setSelectedOrder(order);
  }

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    const orderId = selectedOrder?.id;

    console.log("Order Id: " + orderId);
    
    const success = await updateOrderStatus(orderId);
    if(success){
      handleCloseModal();
      setSelectedOrder(null);
      await getAllReadyOrders();
    }
  }
  
  return (
    <AdminLayout>

        <div className=' m-3 p-3 space-y-6'>
        {loading ? (
          <div className='text-center'>Loading...</div>
        ) : error ? (
          <div className='text-center text-red-500'>{error}</div>
        ) : (
          readyOrders.map((data, index)=>(
            <div key={index} className='h-[65px] m-3 overflow-visible bg-gray-400 flex justify-between items-center text-center text-gray-900 rounded-md space-y-3'>
              <div className='h-[80px] w-[80px] ml-[-15px] bg-gray-500 text-white rounded-full flex text-center justify-center items-center'>
                <span className=' font-bold text-4xl'>{data.table}</span>
              </div>
              <button type='button' onClick={()=> handleViewItems(data)} className='mr-[10px] bg-indigo-600 text-white rounded-md hover:bg-indigo-700 p-3 text-center'>View Items</button>
            </div>
          ))
        )}
      </div>
        
      <Modal isOpen={isOpen} onSubmit={handleUpdateStatus} onClose={handleCloseModal} action='Serve' titleModal='Order Items'>

          <div className='mt-3'>
            {selectedOrder?.items.map((item, index)=>(
              <div key={index} className='flex justify-between items-center text-gray-900'>
              <span>{item.qty}</span>
                <span>{item.menu}</span>
              </div>
            ))}
          </div>
        
      </Modal>

    </AdminLayout>
  )
}

export default PelayanPage;