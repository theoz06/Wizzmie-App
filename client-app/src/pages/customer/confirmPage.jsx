import CustomerLayout from "@/components/layout/CustomerLayout";
import React from "react";
import Image from "next/image";

const ConfirmPage = () => {
  return (
    <CustomerLayout>
      <header className="fixed left-0 top-0 w-full bg-[#EB65AE] shadow-md p-4 text-2xl text-white font-bold justify-center items-center flex">
        <h2>Konfirmasi</h2>
      </header>

      <section className="fixed top-[56px] left-0 bottom-[64px] w-full bg-transparent text-white p-4 overflow-y-auto">
        <div className="bg-[#EB65AE] p-4 rounded-md shadow-md font-bold">
          <h3 >Data Pembeli</h3>
          <div>
            <p>No. Meja: 21</p>
            <p>Nama: Reza Rahadian</p>
          </div>
        </div>

        <div className="bg-[#EB65AE] p-4 rounded-md shadow-md mt-4 space-y-3">
          <h3 className="font-bold">Pesanan</h3>
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
            <div className="text-white p-3">
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
            <div className="text-white p-3">
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
            <div className="text-white p-3">
              <p>x1</p>
            </div>
          </div>
        </div>

        <div className="bg-[#EB65AE] font-bold p-4 rounded-md shadow-md mt-4">
          <h3>Total Pembayaran</h3>
          <div>
            <div className="flex justify-between">
                <p>Total </p>
                <p>Rp. 30.000</p>
            </div>
            <div className="flex justify-between">
                <p>PPN 10%</p>
                <p>Rp. 3.000</p>
            </div>
            <hr className="text-white font-bold w-full text-2xl my-2"></hr>
            <div className="flex justify-between text-lg">
                <p>Total Pembayaran</p>
                <p>Rp. 33.000</p>
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
  );
};

export default ConfirmPage;
