import React, { useState } from 'react';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { HiDocumentDownload } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import useGenerateReceipt from '@/hooks/receiptHook/useGenerateReceipt';

const PaymentSuccessWithReceipt = ({ orderId }) => {
  const [showError, setShowError] = useState(false);

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/receipt/${orderId}`;
      link.setAttribute('download', `struk-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading receipt:', err);
      setShowError(true);
    }
  };

  return (
    <div className="relative w-full">
      {/* Error Modal */}
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
                Terjadi kesalahan saat mengunduh struk. Silahkan coba lagi.
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
                  handleDownload();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message with Download Button */}
      <figure className="relative top-[100px] flex flex-col items-center justify-center bg-white m-4 h-[350px] p-3 space-y-6 shadow-md rounded-md">
        <p className="absolute top-[-35px] text-5xl text-green-500 bg-white rounded-full p-2 border-b-2 border-green-500">
          <BiCheckCircle />
        </p>
        <h2 className="font-bold text-2xl sm:text-lg md:text-xl text-gray-600 text-center">
          Pembayaran Berhasil
        </h2>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          <HiDocumentDownload className="w-5 h-5" />
          Download Struk
        </button>
      </figure>
    </div>
  );
};

export default PaymentSuccessWithReceipt;