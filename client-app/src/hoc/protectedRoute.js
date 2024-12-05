import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect} from 'react'

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();

    useEffect(()=>{
        const token = Cookies.get("token");

        if(!token){
            alert("Please Login first!");
            router.replace("/");
        }
    },[router]);

    return <WrappedComponent {...props}/>;
  };

  Wrapper.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return Wrapper;
};

export default withAuth;