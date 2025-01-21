import AdminLayout from "@/components/layout/AdminLayout";
import React, { useRef, useState } from "react";
import Breadcrumb from "@/components/breadcrumb";
import { FaImage } from "react-icons/fa";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";


const GenerateQrCode = () => {
  const [number, setNumber] = useState("");
  const [generatedQrCode, setGeneratedQrCode] = useState(null);
  const qrCodeRef = useRef();

  const baseUrl = "http://localhost:3000/customer/customerForm?";

  const generatorQrCode = async (e) => {
    e.preventDefault();

    if(number <= 0 || !number){
      alert("Invalid Number");
      setGeneratedQrCode(null);
      setNumber("");
      return
    }

    const url = `${baseUrl}table=${number}`;
    setGeneratedQrCode(url)
  };

  const qRCodeDownloader = async (e) => {
    const canvas = qrCodeRef.current.querySelector("canvas");
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `table-${number}.png`;
    link.click();

    setGeneratedQrCode(null);
    setNumber("");

  }

  return (
    <AdminLayout>
      <div className="h-screen p-6">
        <div className="p-2 rounded-md bg-white">
          <Breadcrumb />
          <h1 className="text-2xl font-bold">Generate QR Code</h1>
        </div>
        <div className="container h-[450px] items-start bg-white mt-10 rounded-md shadow-md flex justify-center space-x-6 p-6">
          <div className="flex flex-col space-y-3">
              <input
                  value={number}
                  onChange= {(e) => setNumber(e.target.value)}
                  required
                  type="number"
                  className="block w-full  rounded-md bg-white px-3 h-10 text-base text-gray-900 outline outline-2 -outline-offset-2 outline-gray-300 placeholder:text-gray-400 focus:outline-3 focus:-outline-offset-3 focus:outline-indigo-600 sm:text-2xl"
                  placeholder="Enter number..."
                />
            <button
              type="submit"
              onClick={generatorQrCode}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded"
            >
              Generate
            </button>
          </div>
          <div className=" h-80 w-80 outline outline-0.5 -outline-offset-1 outline-gray-300 shadow-lg rounded-md">
          {generatedQrCode == null ? (
            <FaImage className="h-full w-full opacity-5"/>
          ): (
            <div ref={qrCodeRef}>
            <QRCodeCanvas value={generatedQrCode} size={320} level="H" bgColor="#ffffff" fgColor="#000000" imageSettings={{src:'/images/Logo-wizzmie.webp', x:undefined, y:undefined, height:100, width:100, opacity:1, excavate:true}}/>
            </div>
          )}

          <div className="mt-6">
            <button type="button" onClick={qRCodeDownloader} className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-11 px-4 rounded w-[320px]">Download QR Code</button>
          </div>
           
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default GenerateQrCode;
