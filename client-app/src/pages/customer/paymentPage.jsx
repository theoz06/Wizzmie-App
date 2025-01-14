import CustomerLayout from "@/components/layout/CustomerLayout";
import useGenerateQris from "@/hooks/paymentHooks/useGenerateQris";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
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
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const generate = async () => {
      if (orderId && !hasGenerated.current) {
        try {
          const data = await generateQRIS(orderId);
          setQrisUrl(data);
          hasGenerated.current = true;
        } catch (error) {
          console.log("Error Generate QRIS: " + error);
        }
      }
    };
    generate();
  }, [orderId, generateQRIS]);

  useEffect(()=> {
    let intervalId;

    const checkStatus = async () => {
      if (orderId) {
        try {
          const res = await checkStatusPaid(orderId);
          console.log("res : "  + JSON.stringify(res, null,2))
          if(res){
            if (res?.transaction_status === "settlement" && res?.status_code === 200){
              setPaid(true);
              clearInterval(intervalId);
            }else if(res?.transaction_status === "pending" && res?.status_code === 200){
              setPaid(false);
            }else{
              setPaid(false);
              clearInterval(intervalId);
            }
          }
        } catch (error) {
          console.log ("error :" + error);
        }
      }
    }

    intervalId = setInterval(checkStatus, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [orderId,setPaid, checkStatusPaid]);

  const qRCodeDownloader = (e) => {

    const canvas = qrCodeRef.current.querySelector("canvas");
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `QRIS-table-${tableNumber}.png`;
    link.click();

  }

  const checkStatusOrder = () =>{

    router.push(`/customer/statusPage?table=${tableNumber}&CustomerId=${custId}&orderId=${orderId}`)
  }

  return (
    <CustomerLayout>
      {paid ? (
        <figure className="relative top-[100px] flex flex-col items-center justify-center bg-white m-4 h-[350px] p-3 space-y-6 shadow-md rounded-md">
          <p className="absolute top-[-35px] text-5xl text-green-500 bg-white rounded-full p-2 border-b-2 border-green-500">
            <FaRegCheckCircle />
          </p>
          <h2 className=" font-bold text-2xl sm:text-lg md:text-xl text-gray-600 text-center">
            Pembayaran Berhasil
          </h2>
        </figure>
      ) : (
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
              <Image
                width={100}
                height={100}
                alt="QRIS"
                src="/Images/qrcode.png"
                className="h-[250px] w-[250px]"
              />
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
      )}
      <footer className="fixed z-[1] bottom-0 left-0 max-h-20 w-full ">
        <button
          type="button"
          className="bg-[#9c379a] text-white text-2xl font-bold w-full p-4 rounded-md"
          onClick={paid ? checkStatusOrder : qRCodeDownloader}
        >
          {paid ? "Cek Status Pesanan" : "Download QRIS"}
        </button>
      </footer>
    </CustomerLayout>
  );
};

export default PaymentPage;
