import AdminLayout from '@/components/layout/AdminLayout';
import React from 'react'

const pelayan = () => {
  return (
    <AdminLayout>

        <div className=' m-3 p-3'>
          <div className='h-[65px] m-3 overflow-visible bg-gray-400 flex justify-between items-center text-center text-gray-900 rounded-md'>
            <div className='h-[80px] w-[80px] ml-[-15px] bg-gray-500 text-white rounded-full flex text-center justify-center items-center'>
              <span className=' font-bold text-4xl'>10</span>
            </div>
            <button type='button' onClick={()=> alert("Clicked")} className='mr-[10px] bg-indigo-600 text-white rounded-md hover:bg-indigo-700 p-3'>Check</button>
          </div>
        </div> 
        
    </AdminLayout>
  )
}

export default pelayan;