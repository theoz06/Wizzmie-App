import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ImHome } from "react-icons/im";

const Breadcrumb = () => {
  const router = useRouter();

  const pathParts = router.asPath.split("/").filter((part) => part);

  return (
    <div aria-label="breadcrumb" className="text-gray-600 text-sm mb-4 ">
      <ol className="flex space-x-2">
        <li>
          <Link href="/admin/AdminHome" className="hover:text-blue-500">
          <div className="flex items-center space-x-2">
            <ImHome />
            <p>Home</p>
            <span className="mx-2">/</span>
          </div>
          </Link>
          
        </li>

        {pathParts.map((part, index) => {
          const isLast = index === pathParts.length - 1;
          const href = "/" + pathParts.slice(0, index + 1).join("/");

          return (
            <li key={index}>
              {isLast ? (
                <span className="text-gray-400">{part.replace("-", " ")}</span>
              ) : (
                <>
                  <Link href={href} className="hover:text-blue-500">
                    {part.replace("-", " ")}
                  </Link>
                  <span className="mx-2">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Breadcrumb;
