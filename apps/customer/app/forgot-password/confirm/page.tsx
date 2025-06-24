'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setStatus('error');
      setMessage('Liên kết không hợp lệ hoặc đã hết hạn.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Không thể đặt lại mật khẩu');
      }
      setStatus('success');
      setMessage('Mật khẩu đã được đặt lại thành công.');
    } catch {
      setStatus('error');
      setMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  return (
    <section className="flex justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="w-full max-w-7xl flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden my-8">
        <div className="relative w-full md:w-1/2 h-64 md:h-auto">
          <Image src="/image_login.jpg" alt="Reset Password" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Đặt lại mật khẩu</h2>
            <p className="text-orange-100">
              Chỉ mất một chút thời gian để bạn quay lại và sử dụng ReTrade!
            </p>
          </div>
        </div>

        <div className="flex justify-center w-full md:w-1/2 px-8 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
                Thiết lập mật khẩu mới
              </h1>
              <p className="text-gray-600">Vui lòng nhập mật khẩu mới của bạn bên dưới.</p>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg text-sm flex items-start gap-2 mb-6 ${
                  status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {status === 'success' ? (
                  <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5 text-red-600" />
                )}
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className="w-full p-3 border-2 border-orange-200 rounded-lg bg-white text-black focus:border-orange-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full p-3 border-2 border-orange-200 rounded-lg bg-white text-black focus:border-orange-400 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg font-medium text-lg transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Cập nhật mật khẩu
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
