import AdminLayout from "@/components/layout/AdminLayout";
import Breadcrumb from "@/components/breadcrumb";
import React, { useEffect, useState } from "react";
import { GrMoney } from "react-icons/gr";
import { MdPeopleAlt } from "react-icons/md";
import withAuth from "@/hoc/protectedRoute";
import useGetMetrics from "@/hooks/dashboardHooks/useGetMetrics";


const AdminHome = () => {
  
  const {isLoading, error, metrics} = useGetMetrics();
  console.log(metrics);


  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <span className="text-xl">Loading...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
<AdminLayout>
  <div className="h-full p-4 md:p-6">
    <div className="p-4 rounded-lg bg-white shadow-sm">
      <Breadcrumb />
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
    </div>
    
    <div className="mt-8 md:mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        {/* Total Sales Card */}
        <div className="flex flex-col items-center">
          <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center p-4">
              <div className="bg-[#e985bb] p-4 rounded-lg">
                <GrMoney className="text-3xl text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">Total Sales Bulanan</p>
                <p className="text-xl font-bold text-gray-800">Rp. {Number(metrics?.totalSalesMonthly).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Customer Card */}
        <div className="flex flex-col items-center">
          <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center p-4">
              <div className="bg-[#e985bb] p-4 rounded-lg">
                <MdPeopleAlt className="text-3xl text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">Visit Customer Bulanan</p>
                <p className="text-xl font-bold text-gray-800">{Number(metrics?.totalCustomersMonthly).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Sales Card */}
        <div className="flex flex-col items-center">
          <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center p-4">
              <div className="bg-[#e985bb] p-4 rounded-lg">
                <GrMoney className="text-3xl text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">Sales Tahunan</p>
                <p className="text-xl font-bold text-gray-800">Rp. {Number(metrics?.totalSalesYearly).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</AdminLayout>
  );
};

export default withAuth(AdminHome);
