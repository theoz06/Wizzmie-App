import AdminLayout from "@/components/layout/adminLayout";
import Breadcrumb from "@/components/breadcrumb";
import React, { useEffect, useState } from "react";
import { GrMoney } from "react-icons/gr";
import { MdPeopleAlt } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";

const AdminHome = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCustomer: 0,
    totalOrder: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/stats`);
        const data = await response.json();
        setStats({
          totalSales: data.totalSales,
          totalCustomer: data.totalCustomer,
          totalOrder: data.totalSold,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data: ", error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
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
      <div className="h-screen p-6">
      <div className="p-2 rounded-md bg-white">
        <Breadcrumb />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <div className="flex justify-center items-center mt-32">
        <ul className="flex space-x-20">
          <li>
            <div className="flex flex-col justify-center items-center space-y-3">
              <div className="bg-[#fff] rounded-lg size-32 w-60 flex items-center shadow-md">
                <span className="text-4xl ml-0 mr-2 bg-[#e985bb] h-full w-20 items-center flex justify-center rounded-l-lg">
                  <GrMoney />
                </span>
                <span className="text-2xl items-center flex justify-center">
                  IDR {stats.totalSales}
                </span>
              </div>
              <span className="text-2xl">Total Sales</span>
            </div>
          </li>
          <li>
            <div className="flex flex-col justify-center items-center space-y-3">
              <div className="bg-[#fff] rounded-lg size-32 w-60 flex items-center shadow-md">
                <span className="text-4xl ml-0 mr-2 bg-[#e985bb] h-full w-20 items-center flex justify-center rounded-l-lg ">
                  <MdPeopleAlt />
                </span>
                <span className="text-2xl ml-10 items-center flex justify-center">
                  {stats.totalCustomer}
                </span>
              </div>
              <span className="text-2xl">Visit Customer</span>
            </div>
          </li>
          <li>
            <div className="flex flex-col justify-center items-center space-y-3">
              <div className="bg-[#fff] rounded-lg size-32 w-60 flex items-center shadow-md">
                <span className="text-4xl ml-0 mr-2 bg-[#e985bb] h-full w-20 items-center flex justify-center rounded-l-lg">
                  <IoFastFoodOutline />
                </span>
                <span className="text-2xl ml-10">{stats.totalOrder}</span>
              </div>
              <span className="text-2xl">Total Sold</span>
            </div>
          </li>
        </ul>
      </div>
      </div>

    </AdminLayout>
  );
};

export default AdminHome;
