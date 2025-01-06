import CustomerLayout from "@/components/layout/CustomerLayout";
import Image from "next/image";
import React from "react";
import { FaPlus } from "react-icons/fa";

const MainPage = () => {
  return (
    <CustomerLayout>
      <header className="fixed top-0 z-[2] left-0 bg-[#9c379a] p-4 flex justify-between items-center w-full border-2 border-[#9c379a]">
        <div className="space-y-6">
          <h1 className=" table-number font-bold text-6xl text-[#9c379a]">
            21
          </h1>
          <p className="text-white text-xl">
            <b>Reza Rahadian</b>
          </p>
        </div>
        <Image
          width={100}
          height={100}
          alt="Logo"
          src="/images/Logo-wizzmie.webp"
        />
      </header> 
      <nav className="fixed top-[147px] left-0 z-[2] bg-[rgb(245,208,254)] w-full p-1 border-solid border-4 rounded-b-sm border-[#C3046C]">
        <ul className="flex space-x-2 justify-between items-center bg-[#9c379a] text-white text-center font-sans font-bold rounded-md overflow-x-auto whitespace-nowrap touch-pan-x">
          <li className="bg-[#C3046C] p-1 rounded-md">Rekomendasi</li>
          <li className="p-1">Rice Bowl</li>
          <li className="p-1" >Mie</li>
          <li className="p-1">Sushi</li>
          <li className="p-1">Dimsum</li>
          <li className="p-1">Hot Drink</li>
          <li className="p-1">Cold Drink</li>
          <li className="p-1">Special Frape</li>
          <li className="p-1">Gelato</li>
        </ul>
      </nav>

      <section className="fixed z-[1] space-y-6 top-[200px] bottom-0 left-0 w-full p-2 overflow-y-auto">
        <div className="container pr-3  bg-[#EB65AE] rounded-l-full rounded-r-md h-20 flex justify-between items-center space-x-2 py-3 shadow-lg">
          <div className="flex items-center space-x-2">
          <Image width={100} height={100} alt="Logo" src="/images/Logo-wizzmie.webp" /> 
          <div className="space-y-1 m-0">
            <h3 className="font-bold text-md text-white">Mie Rica (Rp. 15.000)</h3>
            <p className="text-gray-100 text-xs">
              <i>lorem ipsum dolor sit amet lorem ipsum dolor sit amet</i>
            </p>
          </div>
          </div>
          <div>
            <button type="button" onClick={()=> console.log("Button Add clicked")} className="bg-[#C3046C] text-white p-2 rounded-full border-white border-2">
              <FaPlus />
            </button>
          </div>
        </div>

      </section>
    </CustomerLayout>
  );
};

export default MainPage;
