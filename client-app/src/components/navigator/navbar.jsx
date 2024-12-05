import React from "react";
import "./navigator.css"
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = () => {

  const router = useRouter();

  const LogOutHandler = () => {
    sessionStorage.removeItem("token");
    console.log(sessionStorage.getItem("token"))
    router.push("/login");
  }


  return (
      <div className="bg-[#754985] text-white flex justify-between w-svw  items-center px-6 py-3">
        <Link className="flex items-center " href="/admin/AdminHome">
            <img src="/images/logo-wizzmie.webp" alt="logo" className="h-10 w-10"/>
            <div className="ml-4 text-lg font-bold">Admin Dashboard</div>
        </Link>
        
        <div className="flex items-center space-x-4">
        <div>Admin</div>
          <button onClick={LogOutHandler} className="bg-[#fff] px-4 py-2 rounded hover:bg-red-600 text-black">
            Logout
          </button>
        </div>
      </div>
  );
};

export default Navbar;
