import React, { Children } from 'react'

const ModalDelete = ({isOpen, Children , onClose , onSubmit}) => {
    if (!isOpen) return null;
  return (
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div>
                    <h2
                      className="text-xl font-semibold text-gray-900"
                      id="modal-title"
                    >
                    Confirmation
                    </h2>
                    <hr></hr>
                    <div class="mt-3 text-center sm:ml-0 sm:mt-0 sm:text-left">
                      <div class="mt-2">
                        {Children}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-x-3">
                  <button
                    onClick={onClose}
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-500  sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onSubmit}
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-100 sm:ml-3 sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
  )
}

export default ModalDelete;