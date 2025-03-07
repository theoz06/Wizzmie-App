import CustomerLayout from "@/components/layout/CustomerLayout";
import useGenerateQris from "@/hooks/paymentHooks/useGenerateQris";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { FaRegCheckCircle, FaTimesCircle } from "react-icons/fa";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import useCheckStatusPaid from "@/hooks/paymentHooks/useCheckStatusPaid";
import { AlertCircle } from "lucide-react";
import PaymentSuccessWithReceipt from "@/components/paymentsuccess";
import Cookies from "js-cookie";

const PaymentPage = () => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table");
  const custId = searchParams.get("CustomerId");
  const totalAmount = searchParams.get("Tpay");
  const orderId = searchParams.get("orderId");

  const hasGenerated = useRef(false);
  const [qrisUrl, setQrisUrl] = useState("");
  const qrCodeRef = useRef(null);

  const { isLoading, error, generateQRIS } = useGenerateQris();
  const { checkStatusPaid } = useCheckStatusPaid();
  const [paid, setPaid] = useState("");

  useEffect(() => {
    let isMounted = true;
    let isGenerating = false;

    const generateQrisCode = async () => {
      if (!orderId || qrisUrl || isGenerating) return;

      const existQrisUrl = Cookies.get(`qrisUrl_${orderId}`);
      if (existQrisUrl) {
        if(isMounted){
          console.log("Exist QRIS URL:", existQrisUrl);
          setQrisUrl(existQrisUrl);
          hasGenerated.current = true;
        }
        return;
      }

      try {
        isGenerating = true;
        const data = await generateQRIS(orderId);
        if (isMounted && data) {
          console.log("Generated QRIS URL:", data);
          Cookies.set(`qrisUrl_${orderId}`, data, {
            expires: new Date(Date.now() + 15 * 60 * 1000),
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            path: "/customer/paymentPage"
          })
          setQrisUrl(data);
        }
      } catch (error) {
        isGenerating = false;
        console.error("Error Generate QRIS:", error);
      }finally{
        isGenerating = false;
      }
    };

    generateQrisCode();

    return () => {
      isMounted = false;
    };
  }, [orderId, generateQRIS, qrisUrl]);

  useEffect(() => {
    if (paid === "settlement" || paid === "failure") {
      Cookies.remove(`qris_${orderId}`, 
        {path: "/customer/paymentPage"});
    }
  }, [paid, orderId]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    let intervalId;
    let isSubscribed = true;

    const checkStatus = async () => {
      if (!qrisUrl || !orderId) return;

      try {
        const res = await checkStatusPaid(orderId);
        if (!isSubscribed) return;
        if (res) {
          if (
            res?.transaction_status === "settlement" &&
            res?.status_code === 200
          ) {
            setPaid(res?.transaction_status);
            clearInterval(intervalId);
          } else if (
            res?.transaction_status === "pending" &&
            res?.status_code === 200
          ) {
            setPaid(res?.transaction_status);
          } else {
            setPaid(res?.transaction_status);
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.log("error :" + error);
        if (!isSubscribed) return;
        clearInterval(intervalId);
      }
    };

    if (qrisUrl) {
      intervalId = setInterval(checkStatus, 1000);
    }

    return () => {
      isSubscribed = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [qrisUrl, orderId, checkStatusPaid]);

  const qRCodeDownloader = (e) => {
    try {
      const canvas = qrCodeRef.current;
      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }
  
      const image = canvas.querySelector("canvas")?.toDataURL("image/png");
      if (!image) {
        console.error("Failed to generate image");
        return;
      }
  
      const link = document.createElement("a");
      link.href = image;
      link.download = `QRIS-table-${tableNumber || "unknown"}.png`;
      link.click();
      console.log("QR code download triggered.");
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  const checkStatusOrder = () => {
    if (!orderId) return;
    router.push(
      `/customer/statusPage?table=${tableNumber}&CustomerId=${custId}&orderId=${orderId}`
    );
  };

  const backToFormPage = () => {
    router.push(`/customer/customerForm?table=${tableNumber}`);
  };

  return (
    <CustomerLayout>
      <div className="min-h-screen">
      {paid === "settlement" ? (
        <PaymentSuccessWithReceipt 
          orderId={orderId} 
        />
      ) : paid === "pending" || paid === "" ? (
        <>
          <article className="space-y-4 m-5 sm:m-8 md:m-14 text-white text-sm text-center">
            <p>
              Silahkan lakukan pembayaran dan selesaikan proses pembayaran dalam
              waktu 15 menit.
            </p>
          </article>
          <figure className="flex flex-col items-center bg-white m-4 h-[350px] p-3 space-y-6 shadow-md rounded-md">
            <h2 className=" font-bold text-3xl sm:text-lg md:text-xl text-gray-900">
              Rp. {Number(totalAmount).toLocaleString("id-ID")}
            </h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-[250px] w-[250px]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#9c379a]"></div>
              </div>
            ) : qrisUrl ? (
              <div ref={qrCodeRef}>
                <QRCodeCanvas
                   
                  value={qrisUrl}
                  size={250}
                  level="H"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 text-center p-4">
                <AlertCircle className="h-16 w-16 text-red-500" />
                <div className="space-y-2">
                  <p className="font-medium text-red-500">
                    Gagal memuat QR Code
                  </p>
                  <p className="text-sm text-gray-500">
                    {error || "Terjadi kesalahan. Silakan coba lagi."}
                  </p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            )}
          </figure>
          <article className=" m-5 sm:m-8 md:m-14 text-white">
            <h2 className="text-lg md:text-xl font-bold">Langkah Pembayaran</h2>
            <ol className="list-decimal list-inside text-xs">
              <li>Buka mobile banking atau layanan pembayaran</li>
              <li>Scan QR Code diatas untuk melakukan pembayaran</li>
              <li>
                Anda juga dapat mendownload QR Code diatas untuk melakukan
                pembayaran dengan metode upload gambar di mobile banking.
              </li>
            </ol>
          </article>
        </>
      ) : (
        <figure className="relative top-[100px] flex flex-col items-center justify-center bg-white m-4 h-[350px] p-3 space-y-6 shadow-md rounded-md">
          <p className="absolute top-[-35px] text-5xl text-red-500 bg-white rounded-full p-2 border-b-2 border-red-500">
            <FaTimesCircle />
          </p>
          <h2 className=" font-bold text-2xl sm:text-lg md:text-xl text-gray-600 text-center">
            Pembayaran Gagal
          </h2>
        </figure>
      )}
      </div>
      <footer className={`fixed z-[1] bottom-0 left-0  w-full   ${paid === "settlement" && "bottom-0 justify-center items-center flex"}`}>
        <button
          type="button"
          className={`bg-[#9c379a]  text-white text-2xl font-bold p-4 ${paid === "settlement" ? "animate-bounce rounded-lg" : "w-full"}`}
          onClick={
            paid === "settlement"
              ? checkStatusOrder
              : paid === "pending"
              ? qRCodeDownloader
              : backToFormPage
          }
          disabled={isLoading }
        >
          {paid === "settlement"
            ? "Cek Status Pesanan"
            : paid === "pending"
            ? "Download QRIS"
            : "Pesan Kembali"}
        </button>
      </footer>
    </CustomerLayout>
  );
};

export default PaymentPage;
