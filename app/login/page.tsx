"use client";

import React, { useState } from "react";
import Image from "next/image";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const Page = () => {
  const { login, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({
        phone: form.phone,
        password: form.password,
      });
      toast.success("Logged in successfully");
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      toast.error(message);
    }
  };
  return (
    <div className="flex items-center justify-center pt-8 md:pt-14 pb-12 md:pb-20  px-4">
      <div className="w-full sm:w-11/12 xl:w-10/12 md:w-[95%] max-w-[1440px] lg:w-8/12 bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden border border-gray-200">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full md:w-11/12 2xl:w-9/12 sm:w-[80%]">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-1 text-center 2xl:text-3xl 2xl:mb-4 md:text-left">
              Sign In{" "}
              
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mb-8 text-center md:text-left">
              Signup/login to enjoy the feature of Revolute
            </p>
            <div className="w-10/12 md:w-full xl:w-9/12  mx-auto md:mx-0">
              {/* Form */}
              <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                {/* Phone Field */}
                <div className="relative">
                  <label
                    htmlFor="phone"
                    className="absolute -top-2 left-3 bg-white px-1 text-xs text-[#1e40af]"
                  >
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border text-[#1e40af] border-gray-300 rounded-md px-4 py-3 sm:py-4 text-sm focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af] outline-none"
                  />
                </div>

                {/* Login Field */}
                <div className="relative">
                  <label
                    htmlFor="login"
                    className="absolute -top-2 left-3 bg-white px-1 text-xs text-[#1e40af]"
                  >
                   Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-[#1e40af] rounded-md px-4 py-3 sm:py-4 text-sm focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af] outline-none"
                  />
                </div>

                <div className="text-right">
                  <a
                    href="#"
                    className="text-xs text-[#1e40af] hover:text-[#7b97f5]"
                  >
                    Forgot Your Password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1e40af] text-white py-2 sm:py-3 rounded-md font-semibold hover:bg-[#6486f3] transition text-sm sm:text-base disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Sign In"}
                </button>

               
              </form>

              {/* Divider */}
              <div className="flex items-center gap-2 my-6">
                <div className="h-px bg-gray-300 w-full"></div>
                <p className="text-gray-400 text-sm">or</p>
                <div className="h-px bg-gray-300 w-full"></div>
              </div>

              {/* Social Logins */}
              <div className="space-y-3">
                {/* <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 w-full hover:bg-gray-100 transition text-sm sm:text-base">
                  <FcGoogle className="text-lg" />
                  <span className="text-gray-700">
                    Sign up / Login with Google
                  </span>
                </button> */}

                 <p className="mt-5 text-xs sm:text-sm text-center text-gray-500">
                  Don&apos;t have an account?{" "}
                  <Link href="/registration" className="text-[#1e40af] font-medium hover:underline">
                    Create One
                  </Link>
                </p>

                
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="hidden md:block w-full md:w-1/2 bg-[#FF6B01]/10">
          <Image
            src="/images/iphone161.png"
            alt="Login Banner"
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
