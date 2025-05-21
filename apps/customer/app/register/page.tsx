'use client'
import Image from 'next/image'
import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from 'next/navigation'
import { handlePhoneInput, handleEmailInput } from '@/components/input/InputHandle';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter();

    const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
        if (field === 'password') setShowPassword(!showPassword)
        else setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <section className="flex justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-7xl flex flex-col md:flex-row bg-white shadow-md">
                {/* Left - Image */}
                <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                    <Image
                        src="/image_register.jpg"
                        alt="Market Scene"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Right - Form */}
                <div className="flex justify-center items-center w-full md:w-1/2 px-6 py-10">
                    <div className="w-full max-w-sm">
                        <h1 className="text-3xl font-bold text-black text-center mb-4">Tạo tài khoản</h1>
                        <p className="text-center text-gray-600 mb-6">Bắt đầu hành trình "săn đồ" thông minh!</p>
                        <div className="space-y-4">
                            <input
                                type="text"
                                id="username"
                                placeholder="Tên đăng nhập"
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Số điện thoại"
                                inputMode="numeric"
                                onInput={handlePhoneInput}
                                pattern="[0-9]*"
                                maxLength={10}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                                required
                            />

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    id='password'
                                    placeholder="Mật khẩu"
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('password')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? (
                                        <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <AiOutlineEye className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name='password'
                                    id='password'
                                    placeholder="Xác nhận mật khẩu"
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirmPassword')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showConfirmPassword ? (
                                        <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <AiOutlineEye className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start text-sm">
                                <input type="checkbox" id="terms" className="mt-1 mr-2 size-8" />
                                <label htmlFor="terms" className="text-gray-600">
                                    Bằng cách tạo tài khoản, tôi đồng ý với{' '}
                                    <a href="#" className="underline text-blue-500">Điều khoản</a> và{' '}
                                    <a href="#" className="underline text-blue-500">Chính sách</a> của chúng tôi.
                                </label>
                            </div>

                            {/* Register button */}
                            <button
                                type="submit"
                                className="w-full bg-orange-400 text-white p-3 rounded-lg hover:bg-orange-500 transition"
                                onClick={() => router.push('/login')}
                            >
                                Đăng ký
                            </button>

                            <div className="text-center text-gray-500">HOẶC</div>

                            {/* Social login */}
                            <button className="w-full border border-gray-300 py-2 rounded flex items-center justify-center gap-2">
                                <Image src="/Google__G__logo.svg.png" alt="Google" width={20} height={20} />
                                <span className="text-black">Đăng nhập với Google</span>
                            </button>
                            <button className="w-full border border-gray-300 py-2 rounded flex items-center justify-center gap-2">
                                <Image src="/Facebook_icon.svg.png" alt="Facebook" width={20} height={20} />
                                <span className="text-black">Đăng nhập với Facebook</span>
                            </button>
                            <div className='flex justify-center space-x-1'>
                                <a className="text-black">
                                    Bạn đã có tài khoản?
                                </a>
                                <a href="/forgot-password" className="text-black font-bold ml-1 ">
                                    Đăng nhập ở đây
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

