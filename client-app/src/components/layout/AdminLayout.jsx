import React from "react";
import Navbar from "../navigator/navbar";
import Sidebar from "../navigator/sidebar";
import Head from "next/head";


export const metadata = {
  title: "Admin Dashboard",
  description: "Generated by create next app",
};

const AdminLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div>
        <Navbar />
        <div className="flex-1 flex flex-row ">
          <Sidebar />
          <main className="flex-1 p-6 bg-[#d9d9d9]">{children}</main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
