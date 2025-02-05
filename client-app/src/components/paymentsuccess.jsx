import React, { useState, useEffect } from "react";
import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiDocumentDownload } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import useGenerateReceipt from "@/hooks/receiptHook/useGenerateReceipt";
import Image from "next/image";

const PaymentSuccessWithReceipt = ({ orderId }) => {
  const [showError, setShowError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReceiptImage = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/receipt/${orderId}`
        );
        if (!response.ok) throw new Error("Failed to load receipt");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (err) {
        console.error("Error loading receipt:", err);
        setShowError(true);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    loadReceiptImage();
  }, [orderId]);

  const handleDownload = () => {
    console.log("Download struk");
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `struk-${orderId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="relative w-full">
      {showError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <BiErrorCircle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Error</h3>
              </div>
              <button
                onClick={() => setShowError(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <IoMdClose className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-500">
                Terjadi kesalahan saat memuat struk. Silahkan coba lagi.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowError(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setShowError(false);
                  loadReceiptImage();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      )}
      <figure
        className="relative 
          lg:h-[700px] md:h-[400px] h-[500px] bottom-0 top-[60px] flex flex-col items-center justify-center bg-white m-4 p-3 space-y-6 shadow-md rounded-md"
      >
        <p className="absolute top-[-35px] text-5xl text-green-500 bg-white rounded-full p-2 border-b-2 border-green-500">
          <BiCheckCircle />
        </p>
        <h2 className="font-bold text-2xl sm:text-lg md:text-xl text-gray-600 text-center">
          Pembayaran Berhasil
        </h2>
        <div className="flex-grow scrollbar-none overflow-y-auto my-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent" />
            </div>
          ) : (
            imageUrl && (
              <div className="w-full max-w-md mx-auto">
                <Image
                  width={100}
                  height={100}
                  src={imageUrl}
                  alt="Receipt"
                  className="w-full h-auto"
                />
              </div>
            )
          )}
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors animate-pulse"
        >
          <HiDocumentDownload className="w-5 h-5" />
          Download Struk
        </button>
      </figure>
    </div>
  );
};

export default PaymentSuccessWithReceipt;
