import CustomerLayout from '@/components/layout/CustomerLayout';
import React, { useEffect } from 'react'
import { useState } from 'react';
import Image from 'next/image';
import { FaMinus, FaPlus } from "react-icons/fa6";
import { FaChevronLeft, FaTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import useGetCartItems from '@/hooks/cartHooks/useGetCartItems';
import { useSearchParams } from 'next/navigation';
import {Router} from 'next/navigation';
import useUpdateCart from '@/hooks/cartHooks/useUpdateCart';
import useRemoveCartItem from '@/hooks/cartHooks/useRemoveCartItem';
import useClearCart from '@/hooks/cartHooks/useClearCart';


const CartPage = () => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table");
  const custName = searchParams.get("CustomerName");
  const custId = searchParams.get("CustomerId");
  const custPhone = searchParams.get("CustomerPhone");

  const {clearCart} = useClearCart();
  const {updateCart} = useUpdateCart();
  const {removeCartItem} = useRemoveCartItem();
  const {cartData, getCartItems} = useGetCartItems();
  const [localCart, setLocalCart] = useState([]);


  useEffect(() => {
    if (tableNumber && custId) {
      getCartItems(tableNumber, custId);
    }
  }, [tableNumber, custId, getCartItems]);

  useEffect(() => {
    if (cartData?.cartItems) {
      setLocalCart(cartData.cartItems);
    }
  }, [cartData]);


  const handleQuantityChange = async (index, newQty) => {

    const newQuantity = newQty === "" ? 0 :  parseInt(newQty);

    const updatedCart = [...localCart];
    updatedCart[index].quantity = newQuantity;
    setLocalCart(updatedCart);

    if ( isNaN(newQuantity) || newQuantity < 1) {
      const userConfirmed = window.confirm("Apakah anda ingin menghapus item ini?");
      if (userConfirmed) {

        try {
          const menuId =  updatedCart[index].menuId
          console.log ("menuId : " + menuId)

          const isRemove = await removeCartItem(tableNumber, custId, menuId )
          console.log(isRemove)

          if (!isRemove){
            const revertCart = [...localCart];
            revertCart[index].quantity = 1;
            setLocalCart(revertCart);
          }else {
            const updatedCart = localCart.filter((_, i) => i !== index);
            setLocalCart(updatedCart);
          }
        } catch (error) {
          console.log("Remove gagal. Error : " + error);
        }

      }else{
        const revertCart = [...localCart];
        revertCart[index].quantity = 1;
        setLocalCart(revertCart);
      }
      return;
    }

    try {
      const params = new FormData();
        
      params.append("newQuantity", newQuantity);

      const success = await updateCart(tableNumber, custId, updatedCart[index].menuId, params);
      if(!success){
        const revertCart = [...localCart];
        revertCart[index].quantity = 1;
        setLocalCart(revertCart);
      }
    } catch (error) {
      console.log("Update Qty gagal. Error : " + error)
    };
   
  };

  const incrementQuantity = async (index) => {
    const updatedCart = [...localCart];
    updatedCart[index].quantity += 1;
    const newQty = updatedCart[index].quantity

    const param = new FormData();
    param.append("newQuantity", newQty);

    setLocalCart(updatedCart);

    try {
      const menuId =  updatedCart[index].menuId
      const isUpdate = await updateCart(tableNumber, custId, menuId, param);
      if(!isUpdate){
        const revertCart = [...localCart];
        revertCart[index].quantity -= 1;
        setLocalCart(revertCart);
      }
    } catch (error) {
      console.log("Update Qty gagal. Error : " + error)
    }

  };

  const decrementQuantity = async (index) => {
    if (localCart[index].quantity > 1) {
      const updatedCart = [...localCart];
      console.log(updatedCart[index].quantity)
      updatedCart[index].quantity -= 1;
      const newQty = updatedCart[index].quantity
      
      setLocalCart(updatedCart);

      try {
        const menuId = localCart[index].menuId
        
        const params = new FormData();
        params.append("newQuantity", newQty);

        const isUpdate = await updateCart(tableNumber, custId, menuId, params)
        if(!isUpdate){
          const revertCart = [...localCart];
          revertCart[index].quantity += 1;
          setLocalCart(revertCart);
        }
      } catch (error) {
        console.log("Update Qty gagal. Error : " + error)
      }
    }else {
      const userConfirmed = window.confirm("Apakah anda ingin menghapus item ini?");
      if(userConfirmed){
        try {
          const menuId = localCart[index].menuId
          const isRemove = await removeCartItem(tableNumber, custId, menuId);
          
          if(!isRemove){
            const revertCart = [...localCart];
            revertCart[index].quantity = 1;
            setLocalCart(revertCart);
          }
        } catch (error) {
          console.log("Remove gagal. Error : " + error);
        }

        const updatedCart = localCart.filter((_, i) => i !== index);
        setLocalCart(updatedCart);
      }
    }
  };

  const clearCartHandler = async () => {
    try {
      const isClear = await clearCart(tableNumber, custId);
      if(isClear){
        setLocalCart([]);
      }
    } catch (error) {
      console.log("Clear gagal. Error : " + error);
    }
  }

  const creatOrderHandler = () => {
    router.push(`/customer/confirmPage?table=${tableNumber}&CustomerId=${custId}&CustomerName=${custName}&CustomerPhone=${custPhone}`);
  }

  const backHandler = () => {
    router.back();
  }


  return (
    <CustomerLayout>
      <header className="fixed left-0 top-0 w-full bg-[#9c379a] shadow-md px-4 pt-4  text-2xl text-white font-bold justify-center items-center flex flex-col">
        <div className='relative flex items-center'>
            <p type="button" className='absolute left-[-110px]' onClick={backHandler}>
                <FaChevronLeft />
            </p>
            <h2>Keranjang</h2>
        </div>
        <div className='w-full flex justify-between text-sm mb-2 mt-3'>
            <p>Daftar Pesanan</p>
            <div className='flex space-x-1 ' disabled={localCart.length === 0}>
                <p>Semua</p>
                <button type='button' onClick={clearCartHandler} className='text-red-900 text-lg'>
                    <FaTrashAlt />
                </button>
            </div>
        </div>
        
      </header>

      <section className="fixed top-[66px] left-0 bottom-[64px] w-full bg-transparent text-white p-4 overflow-y-auto">
      {localCart.map((item, index) => (
        <div key={index} className="bg-[#EB65AE] p-4 rounded-md shadow-md mt-4 space-y-5">
          <div className="container  h-20 flex justify-between items-center space-x-2 py-3 overflow-hidden">
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
                <h3 className="font-bold text-md text-white">
                  {item.menuName}
                </h3>
                <p className="text-gray-100 font-bold text-xs">
                  {Number(item.price).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            <div className="flex space-x-0 justify-center items-center text-gray-600">
              <button type='button' className='bg-[#9c379a] text-white p-1' onClick={() => decrementQuantity(index)}>
                <FaMinus />
              </button>
              <input type='text' value={item.quantity} className='w-8 text-center'  onChange={(e) => handleQuantityChange(index, e.target.value)}></input>
              <button type='button' className='bg-[#9c379a] text-white p-1' onClick={() => incrementQuantity(index)}>
                <FaPlus />
              </button>
            </div>
          </div>
        </div>
      ))}

      </section>

      <footer className="fixed z-[1] bottom-0 left-0 max-h-20 w-full ">
        <button disabled={localCart.length === 0} type='button' className="bg-[#9c379a] text-white text-2xl font-bold w-full p-4 " onClick={creatOrderHandler}>
          Buat Pesanan
        </button>
      </footer>
    </CustomerLayout>
  )
}

export default CartPage;