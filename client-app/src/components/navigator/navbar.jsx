import React, { useEffect, useState } from "react";
import "./navigator.css"
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const Navbar = () => {

  const router = useRouter();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie){
      const parsedUser = JSON.parse(userCookie);
      setUser(parsedUser);
    }
  },[]);

  const LogOutHandler = () => {
    confirm("Are you sure want to logout?");
    if(confirm = true){
    Cookies.remove("token");
    Cookies.remove("user");
    alert("Logout Success");
    router.replace("/");
    history.replaceState(null, "", "/");
    }
  }


  return (
      <div className="bg-[#754985] text-white flex justify-between w-svw  items-center px-6 py-3">
        <Link className="flex items-center " href="/admin/AdminHome">
            <img src="/images/logo-wizzmie.webp" alt="logo" className="h-10 w-10"/>
            <div className="ml-4 text-lg font-bold">Admin Dashboard</div>
        </Link>
        
        <div className="flex items-center space-x-4">
        <div>{user?.name || "Admin"}</div>
          <button onClick={LogOutHandler} className="bg-[#fff] px-4 py-2 rounded hover:bg-red-600 text-black">
            Logout
          </button>
        </div>
      </div>
  );
};

export default Navbar;
