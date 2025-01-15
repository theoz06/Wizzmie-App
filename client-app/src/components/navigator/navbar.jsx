import React, { useEffect, useState, useRef } from "react";
import "./navigator.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineClose } from "react-icons/md";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      setUser(parsedUser);
    }
  }, []);

  const LogOutHandler = () => {
    if (confirm("Are you sure want to logout?")) {
      Cookies.remove("token");
      Cookies.remove("user");
      alert("Logout Success");
      router.replace("/");
      history.replaceState(null, "", "/");
    }
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`flex h-16 items-center justify-between px-6 ${
      user?.role.toLowerCase() === "admin"
        ? `bg-[#754985] text-white`
        : `bg-gray-900 text-white`
    }`}>
      <Link className="flex items-center" href="#">
        <Image 
          width="40" 
          height="40" 
          src="/images/logo-wizzmie.webp" 
          alt="logo"
          className="w-10 h-10" // Tetapkan ukuran yang fixed
        />
        <div className={`ml-4 font-bold ${
          user?.role.toLowerCase() === "pelayan" ? "text-sm" : "text-lg"
        }`}>
          {user?.role.toLowerCase() !== "pelayan" 
            ? `${user?.role || 'Admin'} DASHBOARD` 
            : "READY ORDERS"}
        </div>
      </Link>

      {user?.role.toLowerCase() === "pelayan" ? (
        <div className="relative block md:hidden" ref={menuRef}>
          <button 
            type="button" 
            onClick={toggleMenu}
            className="p-2 hover:bg-gray-800 rounded-md"
          >
            {isOpen ? <MdOutlineClose size={24} /> : <GiHamburgerMenu size={24} />}
          </button>
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1">
              <div className="px-4 py-2 text-sm border-b border-gray-700">
                {user?.name || "Admin"}
              </div>
              <button 
                onClick={LogOutHandler}
                className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-gray-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <span className="font-medium">{user?.name || "Admin"}</span>
          <button
            onClick={LogOutHandler}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;