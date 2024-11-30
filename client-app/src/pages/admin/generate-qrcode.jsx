import AdminLayout from "@/components/layout/AdminLayout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb";
import { FaImage } from "react-icons/fa";


const GenerateQrCode = () => {

    const generatedQrCode=[];
  const generatorQrCode = async (e) => {
    e.preventDefault();
    alert("QR Code Generated");
  };

  return (
    <AdminLayout>
      <div className="h-max-screen p-6">
        <div className="p-2 rounded-md bg-white">
          <Breadcrumb />
          <h1 className="text-2xl font-bold">Generate QR Code</h1>
        </div>
        <div className="h-screen bg-white mt-20 rounded-md shadow-md space-y-20 flex flex-col items-center p-6">
          <div className="h-10 flex space-x-2 items-center mt-6">
            <div className="mt-6">
              <label className="block text-2xl  font-bold text-gray-900">
                Number
              </label>
              <div className="mt-3">
                <input
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-2 -outline-offset-2 outline-gray-300 placeholder:text-gray-400 focus:outline-3 focus:-outline-offset-3 focus:outline-indigo-600 sm:text-2xl"
                  placeholder="Enter number..."
                />
              </div>
            </div>
            <button
              type="submit"
              onClick={generatorQrCode}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-11 px-4 mt-16 rounded"
            >
              Generate
            </button>
          </div>
          <div className=" h-80 w-80 outline outline-0.5 -outline-offset-1 outline-gray-300 shadow-lg rounded-md">
           <FaImage className="h-full w-full opacity-5"/>
          </div>
          <div className="mt-6">
            <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-11 px-4 rounded">Download QR Code</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GenerateQrCode;
