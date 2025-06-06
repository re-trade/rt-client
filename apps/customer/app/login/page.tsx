'use client';

import { useToast } from '@/hooks/use-toast';
import { loginInternal } from '@/services/auth.api';
import Joi from 'joi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

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
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const formRef = useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState<number | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
    setShowPassword((prev) => !prev);
  };

  useLayoutEffect(() => {
    if (formRef.current) {
      setFormHeight(formRef.current.offsetHeight);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validation = loginSchema.validate(formData);
      if (validation.error) {
        throw new Error(validation.error.details[0].message);
      }

      await loginInternal(formData);

      showToast('Đăng nhập thành công!', 'success');

      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.';
      showToast(`${message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center min-h-screen bg-gray-100 font-[Open_Sans]">
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-center">
        <div ref={formRef} className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-center w-full">
            <div className="w-full max-w-sm">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-black text-center">
                Chào mừng bạn trở lại với Retrade Shop!
              </h1>
              <p className="text-center text-gray-600 mb-6">
                Nơi tìm món đồ đẹp, dùng món chất lượng – và gặp cơ hội đổi đời trong tích tắc!
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Tên đăng nhập"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={isVisible ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white hover:bg-gray-100"
                    placeholder="Mật khẩu"
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
                <div className="flex justify-end">
                  <a href="/forgot-password" className="text-black">
                    Quên mật khẩu ?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-orange-400 text-white p-3 rounded-lg transition ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-500'
                  } flex items-center justify-center gap-2`}
                >
                  {isLoading && <span className="loading loading-spinner loading-sm text-white" />}
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>

                <div className="text-center text-gray-600">OR</div>

                <button
                  type="button"
                  className="w-full border border-gray-300 py-2 rounded flex items-center text-black justify-center gap-2 hover:bg-gray-100"
                >
                  <FcGoogle className="w-5 h-5 text-red-500" />
                  Đăng nhập với Google
                </button>
              </form>

              <p className="text-center text-gray-600 mt-4">
                Bạn chưa có tài khoản Retrade Shop, đăng ký ngay!
              </p>
              <button
                className="w-full bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300 transition mt-2"
                onClick={() => router.push('/register')}
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        <div className="rounded overflow-hidden">
          <Image
            src="/image_login.jpg"
            alt="Shop Interior"
            width={600}
            height={formHeight ?? 400}
            style={{
              height: formHeight ? `${formHeight}px` : 'auto',
              objectFit: 'cover',
              borderRadius: '0.5rem',
            }}
          />
        </div>
      </div>
    </section>
  );
}
