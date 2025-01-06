import CustomerLayout from "@/components/layout/CustomerLayout";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";

const PaymentPage = () => {
  const [paid, setPaid] = useState(true);

  return (
    <CustomerLayout>
      {paid ? (
        <figure className="relative top-[100px] flex flex-col items-center justify-center bg-white m-4 h-[350px] p-3 space-y-6 shadow-md rounded-md">
          <p className="absolute top-[-35px] text-5xl text-green-500 bg-white rounded-full p-2 border-b-2 border-green-500">
            <FaRegCheckCircle />
          </p>
          <h2 className=" font-bold text-2xl sm:text-lg md:text-xl text-gray-600 text-center">
            Pembayaran Berhasil
          </h2>
        </figure>
      ) : (
        <>
          <article className="space-y-4 m-5 sm:m-8 md:m-14 text-white text-sm text-center">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </article>
          <figure className="flex flex-col items-center bg-white m-4 h-[350px] p-3 space-y-6 shadow-md rounded-md">
            <h2 className=" font-bold text-3xl sm:text-lg md:text-xl text-gray-900">
              Rp. 150.000
            </h2>
            <Image
              width={100}
              height={100}
              alt="QRIS"
              src="/Images/qrcode.png"
              className="h-[250px] w-[250px]"
            />
          </figure>
          <article className=" m-5 sm:m-8 md:m-14 text-white">
            <h2 className="text-lg md:text-xl font-bold">Langkah Pembayaran</h2>
            <ol className="list-decimal list-inside text-xs">
              <li>Buka mobile banking atau layanan pembayaran</li>
              <li>Scan QR Code diatas untuk melakukan pembayaran</li>
              <li>
                Anda juga dapat mendownload QR Code diatas untuk melakukan
                pembayaran dengan metode upload gambar di mobile banking.
              </li>
            </ol>
          </article>
        </>
      )}
      <footer className="fixed z-[1] bottom-0 left-0 max-h-20 w-full ">
        <button
          type="button"
          className="bg-[#9c379a] text-white text-2xl font-bold w-full p-4 rounded-md"
          onClick={() => console.log("Button Add clicked")}
        >
          {paid ? "Cek Status Pesanan" : "Download QRIS" }
        </button>
      </footer>
    </CustomerLayout>
  );
};

export default PaymentPage;
