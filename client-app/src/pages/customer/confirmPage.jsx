import CustomerLayout from "@/components/layout/CustomerLayout";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useGetCartItems from "@/hooks/cartHooks/useGetCartItems";
import { FaChevronLeft } from "react-icons/fa";
import useCreateOrder from "@/hooks/orderHooks/useCreateOrder";

const ConfirmPage = () => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table");
  const custName = searchParams.get("CustomerName");
  const custId = searchParams.get("CustomerId");
  const custPhone = searchParams.get("CustomerPhone");

  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const ppn = 0.1;
  const [ppnAmount, setPpnAmount] = useState(0);

  const { getCartItems } = useGetCartItems();
  const { isLoading, error, createOrder } = useCreateOrder();

  useEffect(() => {
    const initializeData = async () => {
      if (tableNumber && custId) {
        const data = await getCartItems(tableNumber, custId);
        if (data?.cartItems) {
          setCartData(data);
        }
      }
    };

    initializeData();
  }, [tableNumber, custId, getCartItems]);

  useEffect(() => {
    if (cartData?.cartItems) {
      const subTotal = cartData.cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);
      setTotalPrice(subTotal);

      const ppnAmnt = subTotal * ppn;
      setPpnAmount(ppnAmnt);

      const total = subTotal + ppnAmnt;
      setTotalPayment(total);
    } else {
      setTotalPrice(0);
      setPpnAmount(0);
      setTotalPayment(0);
    }
  }, [cartData, ppn]);

  const backHandler = () => {
    router.back();
  };
  
  const confirmHandler = async () => {
    try {
      const res = await createOrder(tableNumber, custId);
      if (res?.orders?.id) {
        router.push(
          `/customer/paymentPage?table=${res?.orders?.tableNumber}&CustomerId=${res?.orders?.customer?.id}&&orderId=${res?.orders?.id}&Tpay=${res?.orders?.totalAmount}`
        );
      }
    } catch (error) {
      console.log("err: " + error);
    }
  };

  return (
    <CustomerLayout>
      <header className="fixed left-0 top-0 w-full bg-[#9c379a] shadow-md p-4 text-2xl text-white font-bold justify-center items-center flex">
        <p type="button" className="fixed left-3" onClick={backHandler}>
          <FaChevronLeft />
        </p>
        <h2>Konfirmasi</h2>
      </header>

      <section className="fixed top-[75px] left-0 bottom-[64px] w-full bg-transparent text-white p-4 overflow-y-auto">
        <div className="bg-[#EB65AE] p-4 rounded-md shadow-md font-bold">
          <h3 className="absolute top-[-10px] left-7 p-[3px] bg-[#EB65AE] border-4 border-[#D53A8E] rounded-lg font-bold">
            Data Pembeli
          </h3>
          <div>
            <p>No. Meja: {tableNumber}</p>
            <p>Nama: {custName}</p>
          </div>
        </div>

        <div className="relative bg-[#EB65AE] p-2 rounded-md shadow-md mt-4 space-y-1">
          <h3 className="absolute top-[-12px] left-3 p-[2px] bg-[#EB65AE] border-4 border-[#D53A8E] rounded-lg font-bold">
            Pesanan
          </h3>
          {cartData?.cartItems?.map((item, index) => (
            <div
              key={index}
              className="container "
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Image
                    width={100}
                    height={100}
                    alt="Logo"
                    src={`${url}/images/${item.imageUrl}`}
                    className="w-20 h-24 mb-1"
                    style={{
                      objectFit: "contain",
                    }}
                  />
                  <div className="space-y-1 m-0">
                    <h3 className="font-bold text-lg text-white">
                      {item.menuName}
                    </h3>
                    <p className="text-gray-100 font-bold text-xs">
                      Rp. {Number(item.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="text-white p-3">
                  <p>x{item.quantity}</p>
                </div>
              </div>
              <p className="text-gray-100 text-sm italic">Catatan: {item.description}</p>
            </div>
          ))}
        </div>

        <div className="relative bg-[#EB65AE] font-bold p-4 rounded-md shadow-md mt-4">
          <h3 className="absolute top-[-12px] left-3 p-[2px] bg-[#EB65AE] border-4 border-[#D53A8E] rounded-lg">
            Total Pembayaran
          </h3>
          <div className="mt-3">
            <div className="flex justify-between">
              <p>Total Harga</p>
              <p>Rp. {Number(totalPrice).toLocaleString("id-ID")}</p>
            </div>
            <div className="flex justify-between">
              <p>PPN 10%</p>
              <p>Rp. {Number(ppnAmount).toLocaleString("id-ID")}</p>
            </div>
            <hr className="text-white font-bold w-full text-2xl my-2"></hr>
            <div className="flex justify-between text-lg">
              <p>Total Pembayaran</p>
              <p>Rp. {Number(totalPayment).toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="fixed z-[1] bottom-0 left-0 max-h-20 w-full ">
        <button
          type="button"
          className="bg-[#9c379a] text-white text-2xl font-bold w-full p-4"
          onClick={confirmHandler}
        >
          Buat Pesanan
        </button>
      </footer>
    </CustomerLayout>
  );
};

export default ConfirmPage;
