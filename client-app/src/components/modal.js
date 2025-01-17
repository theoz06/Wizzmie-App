import React, { Children } from "react";

const Modal = ({ isOpen, children, onClose, onSubmit, action, titleModal }) => {
  if (!isOpen) return null;
  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gray-500/75 transition-opacity" />
      </div>

      {/* Modal Container */}
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Modal Content */}
          <div className="relative w-full max-w-lg transform rounded-lg bg-white shadow-xl transition-all">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900" id="modal-title">
                {titleModal}
              </h2>
            </div>

            {/* Body */}
            <div className="px-6 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={onClose}
                  type="button"
                  className="inline-flex w-full sm:w-auto justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mt-0"
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmit}
                  type="submit"
                  className="inline-flex w-full sm:w-auto justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {action}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
