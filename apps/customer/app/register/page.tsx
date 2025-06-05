'use client';
import { handlePhoneInput } from '@/components/input/InputHandle';
import { registerInternal } from '@/services/auth.api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';


export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    avatarUrl: '',
    password: '',
    rePassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!termsAccepted) {
      setError('Bạn phải đồng ý với Điều khoản và Chính sách.');
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.rePassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp.');
      setIsLoading(false);
      return;
    }
    if (
      !formData.username ||
      !formData.email ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.password
    ) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc.');
      setIsLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Vui lòng nhập email hợp lệ.');
      setIsLoading(false);
      return;
    }

    try {
      await registerInternal(formData);
      setSuccess('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
  setError(errorMessage);
}

  };

  return (
    <section className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-7xl flex flex-col md:flex-row bg-white shadow-md">
        {/* Left Image */}
        <div className="relative w-full md:w-1/2 h-64 md:h-4/5">
          <Image src="/image_register.jpg" alt="Market Scene" fill className="object-cover" />
        </div>

        {/* Right Form */}
        <div className="flex justify-center  w-full md:w-1/2 px-6 py-16">
          <div className="w-full max-w-xl">
            <h1 className="text-3xl font-bold text-black text-center mb-4">Tạo tài khoản</h1>
            <p className="text-center text-gray-600 mb-6">
              Bắt đầu hành trình &quot;săn đồ&quot; thông minh!
            </p>

            {error && (
              <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded">{error}</p>
            )}
            {success && (
              <p className="text-green-500 text-center mb-4 bg-green-100 p-2 rounded">{success}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Tên đăng nhập"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                  required
                />
              </div>

              {/* First + Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Họ"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Tên"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                  required
                />
              </div>

              {/* Phone + Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onInput={handlePhoneInput}
                  placeholder="Số điện thoại"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                  required
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Địa chỉ (tùy chọn)"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                />
              </div>

              {/* Avatar (full) */}
              <input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleInputChange}
                placeholder="URL ảnh đại diện (tùy chọn)"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
              />

              {/* Password + Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Mật khẩu"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('password')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="rePassword"
                    value={formData.rePassword}
                    onChange={handleInputChange}
                    placeholder="Xác nhận mật khẩu"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start text-sm">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 mr-2 size-8"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label htmlFor="terms" className="text-gray-600">
                  Bằng cách tạo tài khoản, tôi đồng ý với{' '}
                  <a href="#" className="underline text-blue-500">
                    Điều khoản
                  </a>{' '}
                  và{' '}
                  <a href="#" className="underline text-blue-500">
                    Chính sách
                  </a>{' '}
                  của chúng tôi.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-orange-400 text-white p-3 rounded-lg transition ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-500'
                }`}
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>

              <div className="text-center text-gray-500">HOẶC</div>

              {/* Social buttons */}
              <button
                type="button"
                className="w-full border border-gray-300 py-2 rounded flex items-center justify-center gap-2"
              >
                <Image src="/Google__G__logo.svg.png" alt="Google" width={20} height={20} />
                <span className="text-black">Đăng nhập với Google</span>
              </button>
              <button
                type="button"
                className="w-full border border-gray-300 py-2 rounded flex items-center justify-center gap-2"
              >
                <Image src="/Facebook_icon.svg.png" alt="Facebook" width={20} height={20} />
                <span className="text-black">Đăng nhập với Facebook</span>
              </button>

              <div className="flex justify-center space-x-1">
                <span className="text-black">Bạn đã có tài khoản?</span>
                <a href="/login" className="text-black font-bold ml-1">
                  Đăng nhập ở đây
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
