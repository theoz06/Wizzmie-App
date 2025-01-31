import React, { useState } from 'react';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { HiDocumentDownload } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import useGenerateReceipt from '@/hooks/receiptHook/useGenerateReceipt';

const PaymentSuccessWithReceipt = ({ orderId }) => {
  const { isGenerating, error, generateReceipt } = useGenerateReceipt();
  const [showError, setShowError] = useState(true);

  const handleDownload = async () => {
    try {
      const response = await generateReceipt(orderId);
      if (response) {
        const blob = new Blob([response], { 
          type: 'application/pdf'
        });
        const blobUrl = URL.createObjectURL(blob);
        
        window.open(blobUrl, '_self');
        
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 1000);
      }
    } catch (err) {
      console.error('Error generating receipt:', err);
      setShowError(true);
    }
  };

  return (
    <div className="relative w-full">
      {/* Error Modal */}
      {error && showError && (
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
                Terjadi kesalahan saat membuat struk. Silahkan coba lagi.
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
                onClick={handleDownload}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <AiOutlineLoading3Quarters className="w-12 h-12 text-green-500 animate-spin" />
            <p className="text-white">Membuat Struk...</p>
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
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
        >
          <HiDocumentDownload className="w-5 h-5" />
          {isGenerating ? 'Membuat Struk...' : 'Download Struk'}
        </button>
      </figure>
    </div>
  );
};

export default PaymentSuccessWithReceipt;