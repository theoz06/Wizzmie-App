import Link from "next/link";
import React from "react";
import "./navigator.css"
import { useRouter } from "next/router";



const Sidebar = () => {
  const router = useRouter();
  const menuItems = [
    { name: "Dashboard", path: "/admin/AdminHome" },
    { name: "Manage Menu", path: "/admin/menu-management" },
    { name: "Manage Category", path: "/admin/category-management" },
    { name: "Manage User", path: "/admin/user-management" },
    { name: "Generate QR Code", path: "/admin/generate-qrcode" },
    { name: "Manage Order", path: "/admin/order-management" },
    { name: "Order History", path: "/admin/order-history" },
  ];

  return (
    <div className="bg-[#754985] text-white  sidebar w-64 flex flex-col ">
      <ul className="flex flex-col space-y-0">
      {menuItems.map((item, index) => (
          <li key={index}>
            <Link href={item.path} legacyBehavior>
              <a
                className={`block p-4 ${
                  router.pathname === item.path
                    ? "bg-[#9059a8]"
                    : "hover:bg-[#9059a8]"
                }`}
              >
                {item.name}
              </a>
            </Link>
            {index < menuItems.length - 1 && <hr className="border-gray-700" />}
          </li>
        ))}
      </ul>
    </div>
  );

};

export default Sidebar;

