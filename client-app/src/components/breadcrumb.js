import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Breadcrumb = () => {
  const router = useRouter();

  const pathParts = router.asPath.split("/").filter((part) => part);

  return (
    <div aria-label="breadcrumb" className="text-gray-600 text-sm mb-4">
      <ol className="flex space-x-2">
        <li>
          <Link href="/admin/AdminHome" className="hover:text-blue-500">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
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
