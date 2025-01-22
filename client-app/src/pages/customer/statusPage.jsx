import CustomerLayout from "@/components/layout/CustomerLayout";
import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import { LuClipboardList, LuPartyPopper } from "react-icons/lu";
import { AiOutlineSmallDash } from "react-icons/ai";
import { GiCook } from "react-icons/gi";
import { FaConciergeBell, FaUtensils } from "react-icons/fa";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import useGetOrderStatus from "@/hooks/orderHooks/useGetOrderStatus";
import { useRef } from "react";

const StatusPage = () => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table");
  const custId = searchParams.get("CustomerId");
  const totalAmount = searchParams.get("Tpay");
  const orderId = searchParams.get("orderId");

  const { getOrderStatus, isLoading, error } = useGetOrderStatus();
  const [order, setOrder] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const getOrderData = async () => {
      if (orderId) {
        const res = await getOrderStatus(orderId, tableNumber, custId);
        if (res?.Order) {
          setOrder(res?.Order);
          setStatus(res?.Order?.orderStatus?.description.toLowerCase());
        }
      }
    };

    getOrderData();
  }, [orderId, getOrderStatus, tableNumber, custId]);

  useEffect(() => {
    let intervalId;
    let isSubscribed = true;

    const checkStatusOrder = async () => {
      if (orderId) {
        try {
          const res = await getOrderStatus(orderId, tableNumber, custId);
          if (!isSubscribed) return;

          console.log("res : " + JSON.stringify(res, null, 2));
          if (res) {
            if (
              res?.Order?.orderStatus?.description.toLowerCase() === "served"
            ) {
              setStatus(res?.Order?.orderStatus?.description.toLowerCase());
              clearInterval(intervalId);
              router.push(`/customer/customerForm?table=${tableNumber}`);
            } else if (
              res?.Order?.orderStatus?.description.toLowerCase() ===
              "ready to serve"
            ) {
              setStatus(res?.Order?.orderStatus?.description.toLowerCase());
            } else {
              setStatus(res?.Order?.orderStatus?.description.toLowerCase());
            }
          }
        } catch (error) {
          console.log("error :" + error);
          if (!isSubscribed) return;
          clearInterval(intervalId);
        }
      }
    };

    checkStatusOrder();

    intervalId = setInterval(checkStatusOrder, 1000);

    return () => {
      isSubscribed = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [orderId, tableNumber, custId, getOrderStatus]);

  return (
    <CustomerLayout>
      {status === "served" ? (
        <div className="min-h-screen bg-gradient-to-b from-[#9c379a] to-[#EB65AE] p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
            <div className="mb-6 flex justify-center space-x-4">
              <LuPartyPopper
                size={40}
                className="text-[#9c379a] animate-bounce"
              />
              <FaUtensils size={40} className="text-[#9c379a]" />
              <LuPartyPopper
                size={40}
                className="text-[#9c379a] animate-bounce"
              />
            </div>

            <h1 className="text-2xl font-bold text-[#9c379a] mb-4">
              Selamat Menikmati
            </h1>

            <p className="text-gray-600 text-lg mb-6">
              Terima kasih telah menjadi sahabat Wizzmie!
            </p>

            <div className="text-sm text-gray-500 italic">
              Semoga makanannya enak dan memuaskan 😊
            </div>
          </div>
        </div>
      ) : (
        <div>
          <header className="fixed left-0 top-0 w-full bg-[#9c379a] shadow-md p-4 text-2xl text-white font-bold justify-center items-center flex">
            <h2>Status Pesanan</h2>
          </header>

          <section className="fixed top-[66px] left-0 bottom-0 w-full bg-transparent text-4xl p-4 overflow-y-auto">
            <figure className="justify-center bg-[#EB65AE] p-4 rounded-md shadow-md font-bold text-white">
              <div className="flex justify-center items-center space-x-3">
                <div className={`flex space-x-3 text-[#9c379a]`}>
                  <LuClipboardList
                    className={`text-5xl ${
                      status === "pending"
                        ? "animate-pulse text-[#9c379a]"
                        : "text-[#9c379a]"
                    }`}
                  />
                  <AiOutlineSmallDash
                    className={`text-5xl ${
                      status === "pending" && "text-white"
                    } ${status === "prepared" && "text-[#9c379a]"}`}
                  />
                </div>

                <div
                  className={`flex space-x-3 ${
                    status === "prepared" ? "text-[#9c379a]" : "text-white"
                  }`}
                >
                  <GiCook
                    className={`text-5xl ${
                      status === "prepared" && "animate-pulse text-[#9c379a]"
                    } ${status === "ready to serve" && "text-[#9c379a]"} ${
                      status === "served" && "text-[#9c379a]"
                    }`}
                  />
                  <AiOutlineSmallDash
                    className={`text-5xl ${
                      status === "pending" && "text-white"
                    } ${status === "ready to serve" && "text-[#9c379a]"} ${
                      status === "served" && "text-[#9c379a]"
                    } ${status === "prepared" && "text-white"}`}
                  />
                </div>

                <div
                  className={`${
                    status === "ready to serve"
                      ? "animate-pulse text-[#9c379a]"
                      : "text-white"
                  }`}
                >
                  <FaConciergeBell
                    className={`text-5xl ${
                      status === "served" && "text-[#9c379a]"
                    }`}
                  />
                </div>
              </div>
              <hr className="text-white font-bold w-full text-2xl my-1"></hr>
              <p className="text-xs text-white">
                {status === "prepared" &&
                  "Pesanan kamu sudah masuk, pesanan kamu sedang diproses oleh staff kami."}
                {status === "ready to serve" &&
                  "Pesanan kamu sudah selesai disiapkan dan siap disajikan. Mohon menunggu pesanan kamu akan segera di antarkan."}
                {status === "served" &&
                  "Pesanan kamu sudah di sajikan. Selamat menikmati..."}
              </p>
            </figure>

            <div className="bg-[#EB65AE] p-4 rounded-md shadow-md mt-4 space-y-3">
              {order?.orderItems?.map((item, index) => (
                <div key={index} className="container ">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Image
                        width={100}
                        height={100}
                        alt="Logo"
                        src={`${url}/images/${item?.menu?.image}`}
                        className="w-20 h-24 mb-1"
                        style={{
                          objectFit: "contain",
                        }}
                      />
                      <div className="space-y-1 m-0">
                        <h3 className="font-bold text-lg text-white">
                          {item?.menu?.name}
                        </h3>
                        <p className="text-gray-100 font-bold text-xs">
                          Rp.{" "}
                          {Number(item?.menu?.price).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div className="text-white p-3 text-lg">
                      <p>x {item?.quantity}</p>
                    </div>
                  </div>
                  <p className="text-gray-100 text-sm italic">
                    Catatan: {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#EB65AE] font-bold p-4 rounded-md shadow-md mt-4 ">
              <div className="text-gray-300 text-sm space-y-1">
                <div className="flex justify-between">
                  <p>Order ID </p>
                  <p>{order?.id}</p>
                </div>
                <div className="flex justify-between">
                  <p>Order Time</p>
                  <p>{order?.orderDate}</p>
                </div>
                <div className="flex justify-between">
                  <p>Order Channel</p>
                  <p>QR CODE</p>
                </div>
                <div className="flex justify-between">
                  <p>Total Amount</p>
                  <p>
                    Rp. {Number(order?.totalAmount).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Payment Method</p>
                  <p>QRIS</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </CustomerLayout>
  );
};

export default StatusPage;
