import CustomerLayout from "@/components/layout/CustomerLayout";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

import useCustomerFormHook from "@/hooks/customerHooks/useCustomerFormHook";
import Cookies from "js-cookie";
import useGetAllCategory from "@/hooks/categoryHooks/useGetAllCategory";

const CustomerForm = () => {
  const router = useRouter();
  const searchParameter = useSearchParams();
  const tableNumber = searchParameter.get("table");

  const {
    categories,
    loading,
    error: errorGetAllCategory,
  } = useGetAllCategory();

  const { getOrCreate, isLoading, error } = useCustomerFormHook();
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    menuRef: "",
  });

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerDetails = new FormData();

    customerDetails.append("name", customerData.name);
    customerDetails.append("phone", customerData.phone);
    customerDetails.append("categoryId", customerData.menuRef);

    console.log("Details Cust", customerDetails);

    const success = await getOrCreate(customerDetails);

    if (success) {
      const cust = Cookies.get("customer")
        ? JSON.parse(Cookies.get("customer"))
        : null;
      router.push(`/customer/mainPage?table=${tableNumber}&CustomerId=${cust.id}&CustomerName=${cust.name}&CustomerPhone=${cust.phone}`);
    }
  };
  return (
    <CustomerLayout>
      <section className="space-y-6 m-10 sm:m-8 md:m-14">
        <figure className="flex flex-col items-center">
          <Image
            src="/images/Logo-wizzmie.webp"
            alt="Wizzmie Logo"
            width={100}
            height={100}
            className="border-2 border-white rounded-full h-[150px] w-[150px] sm:w-24 md:w-[150px]"
          />
          <h1 className="outline-text font-bold text-2xl sm:text-lg md:text-xl text-[#754985]">
            <b>Selamat Datang</b>
          </h1>
        </figure>

        <form className="relative bg-white p-4 sm:p-5 md:p-6 border-solid border-2 rounded-md border-white shadow-lg shadow-gray-300 max-w-md mx-auto w-full">
          <h2 className="label-text absolute top-[-12px] left-[10px] text-gray-500 px-2 rounded-md shadow-md text-sm sm:text-base">
            Data Pembeli
          </h2>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama
            </label>
            <input
              required
              onChange={inputHandler}
              value={customerData.name}
              type="text"
              name="name"
              id="name"
              autoComplete="off"
              className="mt-1 p-2 text-gray-500 border border-gray-300 block w-full rounded-md outline-none focus:outline-[rgb(245,208,254)] focus:border-white"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Nomor Telepon
            </label>
            <input
              onChange={inputHandler}
              value={customerData.phone}
              required
              type="text"
              name="phone"
              id="phone"
              autoComplete="off"
              className="mt-1 p-2 text-gray-500 border border-gray-300 block w-full rounded-md outline-none focus:outline-[rgb(245,208,254)] focus:border-white"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              <i>
                Catatan: Pastikan Nomor yang dimasukkan terdaftar di Whatsapp.
                Sistem akan mengirimkan struk pembelian melalui Whatsapp.
              </i>
            </p>
          </div>

          <div className="option-container mb-4">
            <div className="option-group">
              <label className="text-gray-700 font-medium text-sm">
                Referensi
              </label>
              <div
                className="options text-gray-500 text-sm space-x-1 space-y-1 w-full flex flex-wrap items-baseline"
                data-group="referensi"
              >
                {loading && <p>Loading categories...</p>}
                {errorGetAllCategory && <p>Error fetching categories.</p>}
                {categories &&
                  categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setCustomerData(prev => ({
                        ...prev,
                        menuRef: category.id
                      }))}
                      className={`p-1 rounded-md border-2 ${
                        customerData.menuRef === category.id
                          ? "bg-[#754985] text-white border-[#754985]"
                          : "bg-white text-gray-500 border-gray-300"
                      }`}
                    >
                      {category.description}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="relative mb-1 text-center">
            <button
              disabled= {isLoading}
              type="button"
              onClick={handleSubmit}
              className="bg-[#754985] hover:bg-[#a448c6] text-white p-2 rounded-md font-semibold w-full sm:w-auto sm:px-6"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8z"
                  ></path>
                </svg>
              ) : (
                "Lanjut Memesan"
              )}
            </button>
          </div>
        </form>
      </section>
    </CustomerLayout>
  );
};

export default CustomerForm;
