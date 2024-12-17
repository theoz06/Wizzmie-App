import AdminLayout from "@/components/layout/AdminLayout";
import React from "react";

const kitchenPage = () => {
  return (
    <AdminLayout>
      <div className="container max-h-[666px] bg-white mx-auto">
        <div className="card-container text-gray-900 bg-gray-300 border border-gray-200 m-3 rounded-md shadow-lg mb-3 max-w-[18rem]">
          <div className=" bg-gray-400 p-3 border-b border-gray-200">Header</div>
          <div className="card-body  min-h-[100px]">
            <ul className="p-3">
                <li className="space-x-3 flex">
                    <span>1</span>
                    <span>Menu</span>
                </li>
                <li className="space-x-3 flex">
                    <span>1</span>
                    <span>Menu</span>
                </li>
                <li className="space-x-3 flex">
                    <span>1</span>
                    <span>Menu</span>
                </li>
                <li className="space-x-3 flex">
                    <span>1</span>
                    <span>Menu</span>
                </li>
                <li className="space-x-3 flex">
                    <span>1</span>
                    <span>Menu</span>
                </li>
            </ul>
          </div>
          <div>
            <button type="button" onClick={()=> console.log("clicked")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full">
                Ready
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default kitchenPage;
