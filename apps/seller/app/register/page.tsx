'use client'

import Image from 'next/image';
import { useState } from 'react';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') setShowPassword(!showPassword);
    else if (field === 'confirmPassword') setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Section - Image */}
      <div className="w-1/3 relative">
        <Image
          src="/image_register.jpg"
          alt="Market Scene"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Section - Form */}
      <div className="w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-md justify-center">
          <h1 className="text-3xl font-bold text-black text-center mb-6">Tạo tài khoản</h1>
          <p className="text-center text-gray-600 mb-6">Bắt đầu hành trình "săn đồ" thăng minh!</p>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
            />
            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input type="checkbox" id="terms" className="mr-2" />
              <label htmlFor="terms" className="text-gray-600 text-sm">
                Bằng cách tạo tài khoản, tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật của chúng tôi.
              </label>
            </div>

            {/* Register button */}
            <button
              type="submit"
              className="w-full bg-orange-400 text-white p-3 rounded-lg hover:bg-orange-500 transition"
            >
              Đăng ký
            </button>

            <div className="text-center text-gray-600">HOẶC</div>

            {/* Google */}
            <button className="w-full border border-gray-300 py-2 rounded flex items-center text-black justify-center gap-2">
              <Image src="/Google__G__logo.svg.png" alt="Google" width={20} height={20} />
              Đăng nhập với Google
            </button>

            {/* Facebook */}
            <button className="w-full border border-gray-300 py-2 rounded flex items-center text-black justify-center gap-2">
              <Image src="/Facebook_icon.svg.png" alt="Facebook" width={20} height={20} />
              Đăng nhập với Facebook
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
