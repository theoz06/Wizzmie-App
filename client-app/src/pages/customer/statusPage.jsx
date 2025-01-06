import CustomerLayout from '@/components/layout/CustomerLayout';
import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
import { LuClipboardList } from "react-icons/lu";
import { AiOutlineSmallDash } from "react-icons/ai";
import { GiCook } from "react-icons/gi";
import { FaConciergeBell } from "react-icons/fa";


const StatusPage = () => {
    const status = 'prepared';

  return (
    <CustomerLayout>
      <header className="fixed left-0 top-0 w-full bg-[#9c379a] shadow-md p-4 text-2xl text-white font-bold justify-center items-center flex">
        <h2>Status Pesanan</h2>
      </header>

      <section className="fixed top-[66px] left-0 bottom-0 w-full bg-transparent text-4xl p-4 overflow-y-auto">
        <figure className="justify-center bg-[#EB65AE] p-4 rounded-md shadow-md font-bold text-gray-300">
            <div className='flex justify-center items-center space-x-3'>
            <div className={`flex space-x-3 ${status === "prepared" ? "text-white" : "text-gray-300"}`}>
                <LuClipboardList className='' />
                <AiOutlineSmallDash className='text-5xl'/>
            </div>

            <div className={`flex space-x-3 ${status === "prepared" ? "text-white" : "text-gray-300"}`}>
                <GiCook />
                <AiOutlineSmallDash className='text-5xl'/>
            </div>

            <div className=''>
                <FaConciergeBell />
            </div>
            </div>
            <hr className='text-white font-bold w-full text-2xl my-1'></hr>
            <p className='text-xs text-white'>{status === "prepared" ? "Pesanan kamu sudah masuk, pesanan kamu segera kami siapkan." : "Pesanan kamu sudah siap disajikan, mohon tunggu ya pesanan kamu segera diantar ke meja mu."}</p>

        </figure>

        <div className="bg-[#EB65AE] p-4 rounded-md shadow-md mt-4 space-y-3">
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
            <div className="text-white p-3 text-lg">
              <p>x1</p>
            </div>
          </div>

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
            <div className="text-white p-3 text-lg">
              <p>x1</p>
            </div>
          </div>

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
            <div className="text-white p-3 text-lg">
              <p>x1</p>
            </div>
          </div>

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
            <div className="text-white p-3 text-lg">
              <p>x1</p>
            </div>
          </div>

        </div>

        <div className="bg-[#EB65AE] font-bold p-4 rounded-md shadow-md mt-4 ">
          <div className='text-gray-300 text-sm space-y-1'>
            <div className="flex justify-between">
                <p>Order ID </p>
                <p>12345678</p>
            </div>
            <div className="flex justify-between">
                <p>Order Time</p>
                <p>08/11/2024 12:00:15</p>
            </div>
            <div className="flex justify-between">
                <p>Order Channel</p>
                <p>QR CODE</p>
            </div>
            <div className="flex justify-between">
                <p>Order Time</p>
                <p>08/11/2024 12:00:15</p>
            </div>
            <div className="flex justify-between">
                <p>Payment Method</p>
                <p>QRIS</p>
            </div>
            </div>
        </div>
      </section>
    </CustomerLayout>

  )
}

export default StatusPage;