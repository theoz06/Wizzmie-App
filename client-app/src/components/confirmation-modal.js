import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-black/50 absolute inset-0" onClick={onClose} />
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md z-50 m-auto">
        <div className="text-center space-y-4">
          <FaExclamationCircle className="text-red-600 text-4xl mx-auto"/>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-gray-600">{message}</p>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;