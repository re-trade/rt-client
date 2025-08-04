'use client';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Joi from 'joi';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const loginSchema = Joi.object({
  username: Joi.string().required().min(3).max(30).messages({
    'string.empty': 'Tên đăng nhập không được để trống',
    'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
    'string.max': 'Tên đăng nhập không được vượt quá 30 ký tự',
  }),
  password: Joi.string().required().min(6).messages({
    'string.empty': 'Mật khẩu không được để trống',
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
  }),
});

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();
  const { login, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const validation = loginSchema.validate(formData, { abortEarly: false });
      if (validation.error) {
        showToast(validation.error.details[0]?.message || 'Validation error', 'error');
        return;
      }
      await login(formData);
      showToast('Đăng nhập thành công!', 'success');
      setTimeout(() => router.push('/dashboard'), 500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="w-full max-w-7xl flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden my-8">
        <div className="relative w-full md:w-1/2 h-64 md:h-auto">
          <Image src="/image_login.jpg" alt="Seller Dashboard" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Chào mừng Seller trở lại</h2>
            <p className="text-orange-100">
              Quản lý cửa hàng và phát triển kinh doanh cùng Retrade
            </p>
          </div>
        </div>

        <div className="flex justify-center w-full md:w-1/2 px-8 py-12">
          <div className="w-full max-w-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
                Đăng nhập Seller
              </h1>
              <p className="text-gray-600">Truy cập vào bảng điều khiển quản lý cửa hàng của bạn</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tên đăng nhập *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Nhập tên đăng nhập"
                  className="w-full p-3 border-2 border-orange-200 rounded-lg bg-white text-black focus:border-orange-400 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mật khẩu *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu"
                    className="w-full p-3 border-2 border-orange-200 rounded-lg bg-white text-black focus:border-orange-400 focus:outline-none transition-colors pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-orange-600 hover:text-orange-700 font-medium underline"
                >
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg font-medium text-lg transition-all duration-200 ${
                  isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-orange-600 hover:to-orange-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang đăng nhập...
                  </div>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Chưa có tài khoản seller?{' '}
                <Link
                  href="/register"
                  className="text-orange-600 hover:text-orange-700 font-medium underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
              <p className="text-gray-500 text-sm">
                Bằng cách đăng nhập, bạn đồng ý với{' '}
                <a href="/terms" className="text-orange-600 hover:text-orange-700 underline">
                  Điều khoản sử dụng
                </a>{' '}
                và{' '}
                <a href="/privacy" className="text-orange-600 hover:text-orange-700 underline">
                  Chính sách bảo mật
                </a>{' '}
                của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
