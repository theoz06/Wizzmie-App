import React from "react";
import "./navigator.css"
import Link from "next/link";

const Navbar = () => {
  return (
    <div>
      <div className="bg-[#754985] w-full text-white flex justify-between  items-center px-6 py-3">
        <Link className="flex items-center " href="/admin/AdminHome">
            <img src="/images/logo-wizzmie.webp" alt="logo" className="h-10 w-10"/>
            <div className="ml-4 text-lg font-bold">Admin Dashboard</div>
        </Link>
        
        <div className="flex items-center space-x-4">
        <div>Admin</div>
          <button className="bg-[#fff] px-4 py-2 rounded hover:bg-red-600 text-black">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
