import React from 'react'
import "../styles/CustomerGlobalStyle.css"
import Head from 'next/head';

const CustomerLayout = ({children}) => {
  return (
    <>
        <Head>
            <title>Order Page</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main className=' md:justify-center md:mx-auto md:w-full md:container md:px-4 md:py-4'>
            {children}
        </main>
    </>
  )
}

export default CustomerLayout;