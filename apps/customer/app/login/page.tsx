"use client";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
export default function login() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginDate] = useState<{
    username: string;
    passsword: string;
  }>();
  const toggleVisibility = () => {
    setIsVisible((prevState) => !prevState);
    setShowPassword((prevState) => !prevState);
  };
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 h-full">
      {/* Left Section - Form */}
      <div className="flex items-center justify-center bg-white p-4 md:p-10">
        <div className="w-full max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-black text-center">
            Chào mừng bạn trở lại với Retrade Shop!
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Nơi tìm món đồ đẹp, dùng món chất lượng – và gặp cơ hội đổi đời
            trong tích tắc!
          </p>
          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Tên đăng nhập"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <div className="relative">
              <input
                id="password"
                type={isVisible ? "text" : "password"}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white hover:bg-gray-100"
                placeholder="Mat khau"
                aria-label="Password"
                required
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500" />
                ) : (
                  <AiOutlineEye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-400 text-white p-3 rounded-lg hover:bg-orange-500 transition"
            >
              Đăng nhập
            </button>
            <div className="text-center text-gray-600">OR</div>
            <button className="w-full border border-gray-300 py-2 rounded flex items-center text-black justify-center gap-2 hover:bg-gray-100">
              <FcGoogle className="w-5 h-5 text-red-500" />
              Đăng nhập với Google
            </button>
            <button className="w-full border border-gray-300 py-2 rounded flex items-center text-black justify-center gap-2 hover:bg-gray-100">
              <FaFacebook className="w-5 h-5 text-blue-600" />
              Đăng nhập với Facebook
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Bạn chưa có tài khoản Retrade Shop, đăng ký ngay!
          </p>
          <button className="w-full bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300 transition mt-2">
            Đăng ký
          </button>
          <p className="text-center text-gray-500 text-sm mt-4">
            Bằng cách nhấn vào đăng nhập hoặc đăng ký, bạn đồng ý với Điều khoản
            sử dụng và Chính sách bảo mật của chúng tôi.
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="h-screen md:h-full order-first md:order-last">
        <Image
          src="/image_login.jpg"
          alt="Shop Interior"
          width={800}
          height={800}
          className="w-full h-full object-cover rounded"
        />
      </div>
    </section>
  );
}
