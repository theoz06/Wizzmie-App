import CustomerLayout from '@/components/layout/CustomerLayout';
import Image from 'next/image';
import React from 'react'

const CustomerForm = () => {
  return (
    <CustomerLayout>
        <section className='space-y-6 m-14'>
            <figure className='flex flex-col items-center'>
            <Image src="/images/Logo-wizzmie.webp" alt="Wizzmie Logo" width={100} height={100} className='border-2 border-white rounded-full'/>
            <h1 className='outline-text font-bold text-lg text-[#754985] '> 
                <b>Selamat Datang</b>
            </h1>
            </figure>

            <form className='relative bg-white p-6 border-solid border-2 rounded-md border-white shadow-lg shadow-gray-300'>
                <h2 className='label-text absolute top-[-12px] left-[10px] text-gray-500 px-2 rounded-md shadow-md'>Data Pembeli</h2>

                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
                    <input type="text" name="name" id="name" autoComplete='off' className="mt-1 p-2 text-gray-500  border border-gray-300 block w-full rounded-md outline-none focus:outline-[rgb(245,208,254)] focus:border-white " />
                </div>

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <input type="text" name="name" id="name" autoComplete='off' className="mt-1 p-2 text-gray-500 border border-gray-300 block w-full rounded-md outline-none focus:outline-[rgb(245,208,254)] focus:border-white"/>
                    <p className="text-xs text-gray-500 mt-2"> 
                        <i>Catatan: Pastikan Nomor yang dimasukkan terdaftar di Whatsapp. Sistem akan mengirimkan struk pembelian melalui Whatsapp.</i>
                    </p>
                </div>

                
                <div className="relative mb-1 text-center">
                    <button type='button' onClick={()=> alert("Clicked")} className="bg-[#754985] hover:bg-[#a448c6] text-white p-2 rounded-md font-semibold ">Submit</button>
                </div>
            </form>
        </section>
    </CustomerLayout>
  )
}

export default CustomerForm;