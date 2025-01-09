import CustomerLayout from "@/components/layout/CustomerLayout";
import Image from "next/image";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import useGetAllCategory from "@/hooks/categoryHooks/useGetAllCategory";
import { useState } from "react";
import useGetAllMenu from "@/hooks/menuHooks/useGetAllMenu";






const MainPage = () => {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table");
  const custName = searchParams.get("CustomerName");
  const url = process.env.NEXT_PUBLIC_API_BASE_URL
  const {categories} = useGetAllCategory();
  const {menus} = useGetAllMenu();


  const tabs = ["Rekomendasi", ...categories.map((category)=>{
    return category.description;
  })];
  console.log("tabs", tabs)
  const [activeTab, setActiveTab] = useState(tabs[0]);


  return (
    <CustomerLayout>
      <header className="fixed top-0 z-[2] left-0 bg-[#9c379a] p-4 flex justify-between items-center w-full border-2 border-[#9c379a]">
        <div className="space-y-6">
          <h1 className=" table-number font-bold text-6xl text-[#9c379a]">
            {tableNumber}
          </h1>
          <p className="text-white text-xl">
            <b>{custName}</b>
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
          {tabs.map((tab) => (
            <li
              key={tab}
              className={`p-1 ${
                activeTab === tab ? "bg-[#C3046C] rounded-md" : ""
              } `}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>

      <section className="fixed z-[1] space-y-6 top-[200px] bottom-0 left-0 w-full p-2 overflow-y-auto">
        {menus.map((menu, index) => (
          <div
            key={index}
            className="container pr-3  bg-[#EB65AE] rounded-l-full rounded-r-md h-20 flex justify-between items-center space-x-2 py-3 shadow-lg"
          >
            <div className="flex justify-between items-center space-x-2">
              <Image
                width={100}
                height={100}
                alt="Logo"
                src={`${url}/images/${menu.image}`}
                className="w-20 h-24 mb-1"
                style={{
                  objectFit: "contain",
                }}
              />
              <div className="space-y-1 m-2 p-2 flex-1 min-w-0">
                <h3 className="font-bold text-md text-white whitespace-normal break-words truncate">
                  {menu.name}{" "}
                  {menu.description === "" ? "" : "( Rp." + menu.price + ")"}
                </h3>
                <p className="text-gray-100 text-xs whitespace-normal break-words">
                  <i>
                    {menu.description === "" ? menu.price : menu.description}
                  </i>
                </p>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => console.log("Button Add clicked")}
                className="bg-[#C3046C] text-white p-2 rounded-full border-white border-2"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        ))}
      </section>
    </CustomerLayout>
  );
};

export default MainPage;
