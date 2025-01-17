import React, { useEffect, useState } from "react";
import Navbar from "../navigator/navbar";
import Sidebar from "../navigator/sidebar";
import Head from "next/head";
import Cookies from "js-cookie";

const AdminLayout = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      setUser(parsedUser);
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Head>
        <title>{user?.role || 'Dashboard'}</title>
        <meta name="description" content="Restaurant Management System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Navbar */}
      <div className="flex-none">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {user?.role?.toLowerCase() === "admin" && (
          <aside className="flex-none">
            <Sidebar />
          </aside>
        )}
        
        <main className={`flex-1 overflow-hidden ${
          user?.role?.toLowerCase() === "admin"
            ? "bg-[#d9d9d9]"
            : user?.role?.toLowerCase() === "kitchen"
            ? "bg-[#000]"
            : "bg-[#000] text-white"
        }`}>
          <div className="h-full overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;