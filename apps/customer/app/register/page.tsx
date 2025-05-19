'use client'
import Image from 'next/image';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = (field) => {
        if (field === 'password') setShowPassword(!showPassword);
        else if (field === 'confirmPassword') setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Left Section - Form */}
            <div className="w-1/3 relative">
                <Image
                    src="/image_register.jpg"
                    alt="Market Scene"
                    layout="fill"
                    objectFit="cover"
                />
            </div>

            <div className="w-1/2 flex items-center justify-center p-10">
                <div className="w-full max-w-md justify-center">
                    <h1 className="text-3xl font-bold text-black text-center mb-6">Tạo tài khoản</h1>
                    <p className="text-center text-gray-600 mb-6">Bắt đầu hành trình "săn đồ" thăng minh!</p>
                    <form className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Tên đăng nhập"
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Số điện thoại"
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>
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
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c-4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                )}
                            </button>
                        </div>
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
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c-4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="terms" className="mr-2 bg-white box-border size-10 border-4 p-4" />
                            <label htmlFor="terms" className="text-gray-600 text-sm">
                                Bằng cách tạo tài khoản, tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật của chúng tôi.
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-400 text-white p-3 rounded-lg hover:bg-orange-500 transition"
                        >
                            Đăng ký
                        </button>
                        <div className="text-center text-gray-600">OR</div>
                        <button className="w-full border border-gray-300 py-2 rounded flex items-center text-black justify-center gap-2">
                            <Image
                                src="/Google__G__logo.svg.png"
                                alt="Google"
                                width={20}
                                height={20}
                                className="mr-2"
                            />
                            Đăng nhập với Google
                        </button>
                        <button className="w-full border border-gray-300 py-2 rounded flex items-center text-black justify-center gap-2">
                            <Image
                                src="/Facebook_icon.svg.png"
                                alt="Facebook"
                                width={20}
                                height={20}
                                className="mr-2"
                            />
                            Đăng nhập với Facebook
                        </button>
                    </form>
                </div>
            </div>



        </div>
    );
}