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
  const {checkStatusPaid} = useCheckStatusPaid();
  const [paid, setPaid] = useState("");

  useEffect(() => {
    let isMounted = true;

    const generateQrisCode = async () => {
      if (!orderId || qrisUrl) return; 

      try {
        const data = await generateQRIS(orderId);
        if (isMounted && data) {
          console.log("Generated QRIS URL:", data);
          setQrisUrl(data);
        }
      } catch (error) {
        console.error("Error Generate QRIS:", error);
      }
    };

    generateQrisCode();

    return () => {
      isMounted = false;
    };
  }, [orderId, generateQRIS, qrisUrl]);

    useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(()=> {
    let intervalId;
    let isSubscribed = true;

    const checkStatus = async () => {
      if (!qrisUrl || !orderId) return;

      
        try {
          const res = await checkStatusPaid(orderId);
          if (!isSubscribed) return;
          console.log("res : "  + JSON.stringify(res, null,2))
          if(res){
            if (res?.transaction_status === "settlement" && res?.status_code === 200){
              setPaid(res?.transaction_status);
              clearInterval(intervalId);
            }else if(res?.transaction_status === "pending" && res?.status_code === 200){
              setPaid(res?.transaction_status);
            }else{
              setPaid(res?.transaction_status);
              clearInterval(intervalId);

            }
          }
        } catch (error) {
          console.log ("error :" + error);
          if (!isSubscribed) return;
          clearInterval(intervalId);
          
        }
      }

      if(qrisUrl) {
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
      const canvas = qrCodeRef.current?.querySelector("canvas");
      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `QRIS-table-${tableNumber || 'unknown'}.png`;
      link.click();
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  const checkStatusOrder = () =>{
    if (!orderId) return;
    router.push(`/customer/statusPage?table=${tableNumber}&CustomerId=${custId}&orderId=${orderId}`)
  }

  const backToFormPage = () => {
    router.push(`/customer/customerForm?table=${tableNumber}`);
  }

  return (
    <CustomerLayout>
      {paid === "settlement" ? (
        <figure className="relative top-[100px] flex flex-col items-center justify-center bg-white m-4 h-[350px] p-3 space-y-6 shadow-md rounded-md">
          <p className="absolute top-[-35px] text-5xl text-green-500 bg-white rounded-full p-2 border-b-2 border-green-500">
            <FaRegCheckCircle />
          </p>
          <h2 className=" font-bold text-2xl sm:text-lg md:text-xl text-gray-600 text-center">
            Pembayaran Berhasil
          </h2>
        </figure>
      ) : paid === "pending" || paid === "" ? (
        <>
          <article className="space-y-4 m-5 sm:m-8 md:m-14 text-white text-sm text-center">
            <p>Silahkan lakukan pembayaran dan selesaikan proses pembayaran dalam waktu 15 menit.</p>
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
              error
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
      ): (
        <figure className="relative top-[100px] flex flex-col items-center justify-center bg-white m-4 h-[350px] p-3 space-y-6 shadow-md rounded-md">
          <p className="absolute top-[-35px] text-5xl text-red-500 bg-white rounded-full p-2 border-b-2 border-red-500">
          <FaTimesCircle />
          </p>
          <h2 className=" font-bold text-2xl sm:text-lg md:text-xl text-gray-600 text-center">
            Pembayaran Gagal
          </h2>
        </figure>
      )}
      <footer className="fixed z-[1] bottom-0 left-0 max-h-20 w-full ">
        <button
          type="button"
          className="bg-[#9c379a] text-white text-2xl font-bold w-full p-4 rounded-md"
          onClick={paid ==="settlement" ? checkStatusOrder : paid === "pending" ? qRCodeDownloader : backToFormPage }
          disabled={isLoading || (!paid && !qrisUrl)}
        >
          {paid === "settlement" ? "Cek Status Pesanan" : paid === "pending" ? "Download QRIS" : "Pesan Kembali"}
        </button>
      </footer>
    </CustomerLayout>
  );
};

export default PaymentPage;
