import React from "react";
import "./login.css";
import { useState } from "react";
import { redirect } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const {isLoading, error, login} = useAuth();
  const router = useRouter();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nik || !password) {
      alert("Username or Password is empty!");
      return;
    }

    const success = await login(nik, password);
    if (success) {
      alert("Login Success!");
      router.push("/admin/menu-management");
    }else {
      alert("Login Failed!");
      router.push("/")
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="wizzmie-logo"
          src="images/logo-wizzmie.webp"
          className="mx-auto h-40 w-auto"
        />
      </div>

      <div className="login-container rounded-lg shadow-2xl  mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} method="POST" className="space-y-6 p-8">
          <div>
            <label
              htmlFor="nik"
              className="block text-sm/6 font-medium text-white"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="nik"
                name="nik"
                type="text"
                onChange={(e) => setNik(e.target.value)}
                required
                disabled={isLoading}
                className="block w-full rounded-md border-0 py-1.5  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-[#e985bb]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-white"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="block w-full rounded-md border-0 py-1.5  text-grey-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-[#e985bb]"
              />
            </div>
          </div>

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#754985] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#754985] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8z"
                  ></path>
                </svg>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
