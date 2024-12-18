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
      <div className={` sticky top-0 flex justify-between w-svw  items-center px-6 py-3 ${ user?.role.toLowerCase() === "admin" ? `bg-[#754985] text-white` : `bg-gray-600 text-white`}` } >
        <Link className="flex items-center " href="#">
            <img src="/images/logo-wizzmie.webp" alt="logo" className="h-10 w-10"/>
            <div className="ml-4 text-lg font-bold">{user?.role + " " + "DASHBOARD"|| "Admin Dashboard"}</div>
        </Link>
        
        <div className="flex items-center space-x-4">
        <div>{user?.name || "Admin"}</div>
          <button onClick={LogOutHandler} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-black">
            Logout
          </button>
        </div>
      </div>
  );
};

export default Navbar;
