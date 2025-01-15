import Link from "next/link";
import React from "react";
import "./navigator.css";
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
    <aside className="w-64 h-full bg-[#754985] text-white overflow-hidden">
      <div className="h-full overflow-y-auto">
        <nav>
          <ul className="flex flex-col">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className={`block px-4 py-3 transition-colors ${
                    router.pathname === item.path
                      ? "bg-[#9059a8]"
                      : "hover:bg-[#9059a8]"
                  }`}
                >
                  {item.name}
                </Link>
                {index < menuItems.length - 1 && (
                  <div className="h-px bg-[#8a6a99]" />
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;