import React, { useEffect, useState, useRef } from "react";
import "./navigator.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineClose } from "react-icons/md";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // Untuk referensi menu

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
    console.log(isOpen);
  };

  // Tutup menu ketika klik di luar area menu
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
    <div
      className={`navbar sticky top-0 flex justify-between w-svw items-center px-6 py-3 ${
        user?.role.toLowerCase() === "admin"
          ? `bg-[#754985] text-white`
          : `bg-gray-900 text-white`
      }`}
    >
      <Link className="flex items-center" href="#">
        <img src="/images/logo-wizzmie.webp" alt="logo" className="h-10 w-10" />
        <div
          className={`ml-4 text-lg font-bold ${
            user?.role.toLowerCase() === "pelayan" ? "text-[14px]" : "text-lg"
          }`}
        >
          {user?.role + " " + "DASHBOARD" || "Admin Dashboard"}
        </div>
      </Link>

      {user?.role.toLowerCase() === "pelayan" ? (
        <div className=" block md:hidden" ref={menuRef}>
          <button type="button" onClick={toggleMenu} className="text-white">
            {isOpen ? (
              <MdOutlineClose className="bg-gray-800" />
            ) : (
              <GiHamburgerMenu />
            )}
          </button>
          <div
            className={`menu right-5 mt-6 bg-gray-900 rounded-md border-2 max-w-36 min-w-28 text-right p-3 space-y-2 text-white ${
              isOpen ? "block" : "hidden"
            }`}
          >
            <div className="menu-item">{user?.name || "Admin"}</div>
            <hr />
            <button onClick={LogOutHandler} className="text-red-500 menu-item">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <div>{user?.name || "Admin"}</div>
          <button
            onClick={LogOutHandler}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-black"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
