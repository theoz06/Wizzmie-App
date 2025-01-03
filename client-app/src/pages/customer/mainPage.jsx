import CustomerLayout from "@/components/layout/CustomerLayout";
import Image from "next/image";
import React from "react";

const MainPage = () => {
  return (
    <CustomerLayout>
      <header className="absolute top-0 bg-[#9c379a] p-4 flex justify-between items-center w-full border-2 border-[#9c379a]">
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
      <nav className="fixed top-[147px] bg-[rgb(245,208,254)] w-full p-1 border-solid border-4 rounded-b-sm border-[#C3046C]">
        <ul className="flex p-1 space-x-2 justify-between bg-[#9c379a] text-white font-sans font-bold overflow-x-auto whitespace-nowrap touch-pan-x">
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </nav>

      <section className="absolute top-[200px] w-full ">
        <p>Ini adalah halaman utama</p>
      </section>
    </CustomerLayout>
  );
};

export default MainPage;
