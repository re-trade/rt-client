'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitted(true);
      setMessage('Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến email của bạn.');
    } catch (error) {
      setSubmitted(false);
      setMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  return (
    <section className="flex justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="w-full max-w-7xl flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden my-8">
        {/* Left Image Section */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto">
          <Image src="/image_login.jpg" alt="Forgot Password" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Quên mật khẩu?</h2>
            <p className="text-orange-100">
              Đừng lo! Chúng tôi sẽ giúp bạn lấy lại tài khoản một cách nhanh chóng.
            </p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="flex justify-center w-full md:w-1/2 px-8 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
                Khôi phục mật khẩu
              </h1>
              <p className="text-gray-600">
                Nhập địa chỉ email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu cho bạn.
              </p>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg text-sm flex items-start gap-2 mb-6 ${
                  submitted ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {submitted && <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />}
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email đã đăng ký
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full p-3 border-2 border-orange-200 rounded-lg bg-white text-black focus:border-orange-400 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg font-medium text-lg transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Gửi liên kết khôi phục
              </button>
            </form>

            <p className="text-sm text-center text-gray-600 mt-6">
              Nhớ mật khẩu rồi?{' '}
              <a
                href="/login"
                className="font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center"
              >
                Quay lại đăng nhập
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
