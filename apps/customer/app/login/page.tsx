'use client';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Joi from 'joi';
import Image from 'next/image';
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
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();
  const { isAuth, login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.username.trim() !== '' && formData.password.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const validation = loginSchema.validate(formData, { abortEarly: false });
      if (validation.error) {
        showToast(validation.error.details[0].message, 'error');
        return;
      }
      await login(formData);
      await isAuth();
      showToast('Đăng nhập thành công!', 'success');
      setTimeout(() => router.push('/'), 500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="w-full max-w-7xl flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden my-8">
        <div className="relative w-full md:w-1/2 h-64 md:h-auto">
          <Image src="/image_login.jpg" alt="Shop Interior" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Chào mừng bạn trở lại</h2>
            <p className="text-orange-100">Khám phá những điều đặc biệt tại ReTrade</p>
          </div>
        </div>

        <div className="flex justify-center w-full md:w-1/2 px-8 py-12">
          <div className="w-full max-w-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
                Đăng nhập tài khoản
              </h1>
              <p className="text-gray-600">Chào mừng bạn trở lại với ReTrade!</p>
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
                disabled={isLoading || !isFormValid}
                className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg font-medium text-lg transition-all duration-200 ${
                  isLoading || !isFormValid
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-orange-600 hover:to-orange-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang đăng nhập...
                  </div>
                ) : (
                  'Đăng nhập'
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-orange-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">HOẶC</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full border-2 border-orange-200 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 group"
                >
                  <Image src="/Google__G__logo.svg.png" alt="Google" width={20} height={20} />
                  <span className="text-gray-700 font-medium group-hover:text-gray-800">
                    Đăng nhập với Google
                  </span>
                </button>
              </div>

              <div className="text-center pt-4 border-t border-orange-200">
                <span className="text-gray-600">Chưa có tài khoản? </span>
                <a
                  href="/register"
                  className="text-orange-600 hover:text-orange-700 font-bold transition-colors duration-200"
                >
                  Đăng ký ở đây
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
