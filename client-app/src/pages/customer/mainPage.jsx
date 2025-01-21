import CustomerLayout from "@/components/layout/CustomerLayout";
import Image from "next/image";
import React, { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { useSearchParams } from "next/navigation";
import useGetAllCategory from "@/hooks/categoryHooks/useGetAllCategory";
import { useState } from "react";
import useGetAllMenu from "@/hooks/menuHooks/useGetAllMenu";
import useGetCartItems from "@/hooks/cartHooks/useGetCartItems";
import useAddToCart from "@/hooks/cartHooks/useAddToCart";
import useGetRecommendationMenu from "@/hooks/menuHooks/useGetRecommendationMenu";
import { useRef } from "react";



const MainPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table");
  const custName = searchParams.get("CustomerName");
  const custId = searchParams.get("CustomerId");
  const custPhone = searchParams.get("CustomerPhone");
  const scrollRef = useRef(null);

  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [cartData, setCartData] = useState([]);
  const { getCartItems } = useGetCartItems();
  const [totalItemAdded, setTotalItemAdded] = useState(0);

  const { categories } = useGetAllCategory();
  const { menus } = useGetAllMenu();

  const tabs = [
    "Rekomendasi",
    ...categories.map((category) => {
      return category.description;
    }),
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const menusFilteredByCategory = menus.filter(
    (menu) => menu.category.description === activeTab
  );

  const {
    getRecommendationMenu,
    recommendation,
    setRecommendation,
    isLoading,
    error,
  } = useGetRecommendationMenu();

  useEffect(() => {
    const initializeData = async () => {
      if (custId) {
        const data = await getRecommendationMenu(custId);
        if (data) {
          const transformedData = data.map((item) => ({
            id: item.menu.id,
            name: item.menu.name,
            description: item.menu.description,
            price: item.menu.price,
            image: item.menu.image,
            isAvailable: item.menu.isAvailable,
            category: item.menu.category,
          }));
          setRecommendation(transformedData);
        }
      }
    };

    initializeData();
  },[]);

  useEffect(() => {
    const initializeCart = async () => {
      if (tableNumber && custId) {
        const data = await getCartItems(tableNumber, custId);
        if (data?.cartItems) {
          const total = data.cartItems.reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
          );
          setTotalItemAdded(total);
        }
      }
    };

    initializeCart();
  }, [tableNumber, custId, getCartItems]);

  const { addToCart } = useAddToCart();
  const addToCartHandler = async (menu) => {
    const custId = searchParams.get("CustomerId");

    const items = {
      menuId: menu.id,
      menuName: menu.name,
      price: menu.price,
      imageUrl: menu.image,
      description: "",
      quantity: 1,
    };

    const success = await addToCart(tableNumber, custId, items);

    if (success) {
      const resp = await getCartItems(tableNumber, custId);
      setCartData(resp);
    }
  };

  useEffect(() => {
    if (cartData.cartItems) {
      const total = cartData.cartItems.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      setTotalItemAdded(total);
    }
  }, [cartData]);

  const handleCartClick = () => {
    router.push(
      `/customer/cartPage?table=${tableNumber}&CustomerId=${custId}&CustomerName=${custName}&CustomerPhone=${custPhone}`
    );
  };

  const handleTouchStart = (e) => {
    const slider = scrollRef.current;
    const startPos = {
      left: slider.scrollLeft,
      x: e.touches[0].pageX,
    };

    const handleTouchMove = (e) => {
      const x = e.touches[0].pageX;
      const walk = x - startPos.x;
      slider.scrollLeft = startPos.left - walk;
    };

    slider.addEventListener("touchmove", handleTouchMove);
    slider.addEventListener(
      "touchend",
      () => {
        slider.removeEventListener("touchmove", handleTouchMove);
      },
      { once: true }
    );
  };


  return (
    <CustomerLayout>
      <header className="fixed top-0 z-[2] left-0 bg-[#9c379a] p-4 flex justify-between items-center w-full border-2 border-[#9c379a]">
        <div className="space-y-6">
          <h1 className=" table-number font-bold text-6xl text-[#9c379a]">
            {tableNumber}
          </h1>
          <p className="text-white text-xl">
            <b>{custName}</b>
          </p>
        </div>
        <Image
          width={100}
          height={100}
          alt="Logo"
          src="/images/Logo-wizzmie.webp"
        />
      </header>
      <nav className="fixed top-[147px] left-0 z-10 bg-purple-100 w-full p-1 border-4 border-pink-700 rounded-b">
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-none touch-pan-x"
          onTouchStart={handleTouchStart}
        >
          <ul className="flex min-w-max space-x-2 p-1 bg-[#9c379a] rounded-md">
            {tabs.map((tab) => (
              <li
                key={tab}
                className={`px-4 py-2 cursor-pointer transition-colors whitespace-nowrap
                ${
                  activeTab === tab
                    ? "bg-pink-700 rounded-md text-white"
                    : "text-white hover:bg-pink-600 hover:bg-opacity-50 rounded-md"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <section className="fixed z-[1] space-y-6 top-[200px] bottom-0 left-0 w-full p-2 overflow-y-auto">
        {activeTab === "Rekomendasi"
          ? recommendation?.map((menu, index) => (
              <div
                key={index}
                className={`container pr-3 ${menu.isAvailable ? `bg-pink-500` : `bg-gray-400 text-[#B0B0B0]`}  rounded-l-full rounded-r-md min-h-20 flex items-center shadow-lg relative`}
              >
                <div className="flex flex-1 items-center gap-2 overflow-hidden">
                  <div className="flex-shrink-0">
                    <Image
                      width={100}
                      height={100}
                      alt="Logo"
                      src={`${url}/images/${menu.image}`}
                      className="w-20 h-20 object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 py-2 px-3">
                    <h3 className="font-bold text-md text-white mb-1 line-clamp-2">
                      {menu.name}
                    </h3>
                    <p className="text-gray-100 text-xs italic line-clamp-2">
                      {menu.isAvailable ? Number(menu.price).toLocaleString("id-ID"): "Tidak tersedia" }
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-2">
                  <button
                    type="button"
                    disabled={!menu.isAvailable}
                    onClick={() => addToCartHandler(menu)}
                    className={`${menu.isAvailable ? `bg-pink-700 hover:bg-pink-800` : `bg-gray-400`}  text-white p-2 rounded-full border-white border-2  transition-colors`}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            ))
          : menusFilteredByCategory.map((menu, index) => (
              <div
                key={index}
                className={`container pr-3 ${menu.isAvailable ? `bg-pink-500` : `bg-gray-400 text-[#B0B0B0]`}  rounded-l-full rounded-r-md min-h-20 flex items-center shadow-lg relative`}
              >
                <div className="flex flex-1 items-center gap-2 overflow-hidden">
                  <div className="flex-shrink-0">
                    <Image
                      width={100}
                      height={100}
                      alt="Logo"
                      src={`${url}/images/${menu.image}`}
                      className="w-20 h-20 object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 py-2 px-3">
                    <h3 className="font-bold text-md text-white mb-1 line-clamp-2">
                      {menu.name}
                    </h3>
                    <p className="text-gray-100 text-xs italic line-clamp-2">
                      {menu.isAvailable ? Number(menu.price).toLocaleString("id-ID"): "Tidak tersedia" }
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-2">
                  <button
                    type="button"
                    disabled={!menu.isAvailable}
                    onClick={() => addToCartHandler(menu)}
                    className={`${menu.isAvailable ? `bg-pink-700 hover:bg-pink-800` : `bg-gray-400`}  text-white p-2 rounded-full border-white border-2  transition-colors`}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            ))}
      </section>
      {totalItemAdded === 0 ? (
        <></>
      ) : (
        <footer className="fixed z-[1] bottom-1 left-0 max-h-20 w-full px-6 ">
          <button
            type="button"
            onClick={handleCartClick}
            className="bg-[#9c379a] text-white text-md font-bold w-full py-3 px-6 rounded-md flex justify-between items-center"
          >
            <p>Lihat Keranjang</p>
            <div className="relative flex items-center">
              <BsCart3 className="text-2xl" />
              <p className="absolute text-sm rounded-full bg-red-600 px-2  right-[-10px] top-[-10px] text-white">
                {totalItemAdded}
              </p>
            </div>
          </button>
        </footer>
      )}
    </CustomerLayout>
  );
};

export default MainPage;
