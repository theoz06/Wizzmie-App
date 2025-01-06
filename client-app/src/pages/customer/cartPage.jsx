import CustomerLayout from '@/components/layout/CustomerLayout';
import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
import { FaMinus, FaPlus } from "react-icons/fa6";
import { FaChevronLeft, FaTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';

const CartPage = () => {
    const [qty, setQty] = useState(0);
    const router = useRouter();

    const addQty = (e) => {
        e.preventDefault();
        setQty(qty + 1);
    }
    
    const decQty = (e) => {
        e.preventDefault();
        if(qty > 0){
            setQty(qty - 1);
        }else{
            setQty(0);
        }
    }
  return (
    <CustomerLayout>
      <header className="fixed left-0 top-0 w-full bg-[#9c379a] shadow-md px-4 pt-4  text-2xl text-white font-bold justify-center items-center flex flex-col">
        <div className='relative flex items-center'>
            <p type="button" className='absolute left-[-110px]' onClick={() => router.back()}>
                <FaChevronLeft />
            </p>
            <h2>Keranjang</h2>
        </div>
        <div className='w-full flex justify-between text-sm mb-2 mt-3'>
            <p>Daftar Pesanan</p>
            <div className='flex space-x-1'>
                <p>Semua</p>
                <button className='text-red-900 text-lg'>
                    <FaTrashAlt />
                </button>
            </div>
        </div>
        
      </header>

      <section className="fixed top-[66px] left-0 bottom-[64px] w-full bg-transparent text-white p-4 overflow-y-auto">
        <div className="bg-[#EB65AE] p-4 rounded-md shadow-md mt-4 space-y-5">
          
          <div className="container  h-20 flex justify-between items-center space-x-2 py-3 overflow-hidden">
            <div className="flex items-center space-x-2">
              <Image
                width={100}
                height={100}
                alt="Logo"
                src="/images/Logo-wizzmie.webp"
                
              />
              <div className="space-y-1 m-0">
                <h3 className="font-bold text-lg text-white">
                  Mie Rica
                </h3>
                <p className="text-gray-100 font-bold text-xs">
                  Rp. 15.000
                </p>
              </div>
            </div>
            <div className="flex space-x-0 justify-center items-center text-gray-600">
              <button type='button' className='bg-[#9c379a] text-white p-1' onClick={decQty}>
                <FaMinus />
              </button>
              <input value={qty} className='w-8 text-center'></input>
              <button type='button' className='bg-[#9c379a] text-white p-1' onClick={addQty}>
                <FaPlus />
              </button>
            </div>
          </div>
        </div>

      </section>

      <footer className="fixed z-[1] bottom-0 left-0 max-h-20 w-full ">
        <button className="bg-[#9c379a] text-white text-2xl font-bold w-full p-4">
          Buat Pesanan
        </button>
      </footer>
    </CustomerLayout>
  )
}

export default CartPage;