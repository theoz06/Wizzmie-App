import { useEffect, useRef, useState } from "react";

const NotificationSound = ({ newOrder, soundUrl }) => {
  const [audio, setAudio] = useState(null);
  const prevOrdersRef = useRef([]); // Menyimpan order sebelumnya

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAudio(new Audio(soundUrl)); // Inisialisasi audio hanya di client-side
    }
  }, [soundUrl]);

  useEffect(() => {
    if (!audio) return; // Pastikan audio sudah siap

    // Ambil data order sebelumnya
    const prevOrders = prevOrdersRef.current;

    // Cari order baru yang tidak ada di data sebelumnya
    const newOrders = newOrder.filter(
      (order) => !prevOrders.some((prevOrder) => prevOrder.id === order.id)
    );

    if (newOrders.length > 0) {
      audio.play().catch((error) => console.log("Audio gagal diputar:", error));
    }

    // Update ref dengan order terbaru
    prevOrdersRef.current = newOrder;
  }, [newOrder, audio]);

  return null;
};

export default NotificationSound;