'use client';
import { handlePhoneInput } from '@/components/input/InputHandle';
import { registerInternal } from '@/services/auth.api';
import { fileApi } from '@/services/file.api';
import { IconUpload, IconUser, IconX } from '@tabler/icons-react';
import Joi from 'joi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const registerSchema = Joi.object({
  username: Joi.string().required().min(3).max(30).alphanum().messages({
    'string.empty': 'Tên đăng nhập không được để trống',
    'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
    'string.max': 'Tên đăng nhập không được vượt quá 30 ký tự',
    'string.alphanum': 'Tên đăng nhập chỉ được chứa chữ cái và số',
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email không được để trống',
      'string.email': 'Vui lòng nhập email hợp lệ',
    }),
  firstName: Joi.string().required().min(1).max(50).messages({
    'string.empty': 'Họ không được để trống',
    'string.max': 'Họ không được vượt quá 50 ký tự',
  }),
  lastName: Joi.string().required().min(1).max(50).messages({
    'string.empty': 'Tên không được để trống',
    'string.max': 'Tên không được vượt quá 50 ký tự',
  }),
  phone: Joi.string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      'string.empty': 'Số điện thoại không được để trống',
      'string.pattern.base': 'Số điện thoại phải có đúng 10 chữ số',
    }),
  address: Joi.string().optional().allow('').max(200).messages({
    'string.max': 'Địa chỉ không được vượt quá 200 ký tự',
  }),
  gender: Joi.number().valid(0, 1, 2).optional().allow('').messages({
    'any.only': 'Vui lòng chọn giới tính hợp lệ',
  }),
  password: Joi.string().required().min(6).max(128).messages({
    'string.empty': 'Mật khẩu không được để trống',
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'string.max': 'Mật khẩu không được vượt quá 128 ký tự',
  }),
  rePassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.empty': 'Xác nhận mật khẩu không được để trống',
    'any.only': 'Mật khẩu và xác nhận mật khẩu không khớp',
  }),
  avatarUrl: Joi.string().optional().allow(''),
});

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    gender: '',
    avatarUrl: '',
    password: '',
    rePassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarError, setAvatarError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAvatarError('');
    if (file) {
      if (!file.type.startsWith('image/')) {
        setAvatarError('Vui lòng chọn file hình ảnh hợp lệ.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setAvatarError('Kích thước file không được vượt quá 5MB.');
        return;
      }

      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    setAvatarError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setAvatarError('');

    try {
      if (!termsAccepted) {
        setErrors((prev) => ({
          ...prev,
          terms: 'Bạn phải đồng ý với Điều khoản và Chính sách.',
        }));
        setIsLoading(false);
        return;
      }

      const validation = registerSchema.validate(formData, { abortEarly: false });
      if (validation.error) {
        const newErrors: Record<string, string> = {};
        validation.error.details.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      let avatarUrl = formData.avatarUrl;
      if (avatarFile) {
        avatarUrl = await fileApi.fileUpload(avatarFile);
      }
      const submitData = {
        ...formData,
        gender: formData.gender ? Number(formData.gender) : undefined,
        avatarUrl,
      };

      await registerInternal(submitData);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="w-full max-w-7xl flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden my-8">
        <div className="relative w-full md:w-1/2 h-64 md:h-auto">
          <Image src="/image_register.jpg" alt="Market Scene" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Tham gia ReTrade</h2>
            <p className="text-orange-100">Nơi mua bán đồ cũ uy tín nhất Việt Nam</p>
          </div>
        </div>

        <div className="flex justify-center w-full md:w-1/2 px-8 py-12">
          <div className="w-full max-w-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
                Đăng ký tài khoản
              </h1>
              <p className="text-gray-600">Bắt đầu hành trình "săn đồ" thông minh!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="text-red-500 text-sm text-center">{errors.general}</div>
              )}
              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-orange-200 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <IconUser size={32} className="text-orange-400" />
                      </div>
                    )}
                  </div>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <IconX size={14} />
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors duration-200 text-sm font-medium"
                  >
                    <IconUpload size={16} />
                    {avatarFile ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />

                <p className="text-xs text-gray-500 text-center">
                  Chọn ảnh đại diện (tùy chọn)
                  <br />
                  Định dạng: JPG, PNG. Kích thước tối đa: 5MB
                </p>
                {avatarError && <div className="text-red-500 text-sm">{avatarError}</div>}
              </div>

              {/* Username + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tên đăng nhập *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Nhập tên đăng nhập"
                    className={`w-full p-3 border-2 rounded-lg bg-white text-black focus:outline-none transition-colors ${
                      errors.username
                        ? 'border-red-500'
                        : 'border-orange-200 focus:border-orange-400'
                    }`}
                    required
                  />
                  {errors.username && <div className="text-red-500 text-sm">{errors.username}</div>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập email"
                    className={`w-full p-3 border-2 rounded-lg bg-white text-black focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500' : 'border-orange-200 focus:border-orange-400'
                    }`}
                    required
                  />
                  {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                </div>
              </div>

              {/* First + Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Họ *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ"
                    className={`w-full p-3 border-2 rounded-lg bg-white text-black focus:outline-none transition-colors ${
                      errors.firstName
                        ? 'border-red-500'
                        : 'border-orange-200 focus:border-orange-400'
                    }`}
                    required
                  />
                  {errors.firstName && (
                    <div className="text-red-500 text-sm">{errors.firstName}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tên *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Nhập tên"
                    className={`w-full p-3 border-2 rounded-lg bg-white text-black focus:outline-none transition-colors ${
                      errors.lastName
                        ? 'border-red-500'
                        : 'border-orange-200 focus:border-orange-400'
                    }`}
                    required
                  />
                  {errors.lastName && <div className="text-red-500 text-sm">{errors.lastName}</div>}
                </div>
              </div>

              {/* Phone + Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onInput={handlePhoneInput}
                    placeholder="Nhập số điện thoại"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    className={`w-full p-3 border-2 rounded-lg bg-white text-black focus:outline-none transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-orange-200 focus:border-orange-400'
                    }`}
                    required
                  />
                  {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Giới tính</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full p-3 border-2 rounded-lg bg-white text-black focus:outline-none transition-colors ${
                      errors.gender ? 'border-red-500' : 'border-orange-200 focus:border-orange-400'
                    }`}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="0">Nam</option>
                    <option value="1">Nữ</option>
                    <option value="2">Khác</option>
                  </select>
                  {errors.gender && <div className="text-red-500 text-sm">{errors.gender}</div>}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ (tùy chọn)"
                  className={`w-full p-3 border-2 rounded-lg bg-white text-black focus:outline-none transition-colors ${
                    errors.address ? 'border-red-500' : 'border-orange-200 focus:border-orange-400'
                  }`}
                />
                {errors.address && <div className="text-red-500 text-sm">{errors.address}</div>}
              </div>

              {/* Password + Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mật khẩu *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Nhập mật khẩu"
                      className={`w-full p-3 border-2 rounded-lg bg-white text-black focus:outline-none transition-colors pr-12 ${
                        errors.password
                          ? 'border-red-500'
                          : 'border-orange-200 focus:border-orange-400'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('password')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="rePassword"
                      value={formData.rePassword}
                      onChange={handleInputChange}
                      placeholder="Nhập lại mật khẩu"
                      className={`w-full p-3 border-2 rounded-lg bg-white text-black focus:outline-none transition-colors pr-12 ${
                        errors.rePassword
                          ? 'border-red-500'
                          : 'border-orange-200 focus:border-orange-400'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.rePassword && (
                    <div className="text-red-500 text-sm">{errors.rePassword}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-5 h-5 text-orange-600 border-2 border-orange-300 rounded focus:ring-orange-500 focus:ring-2"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                  Bằng cách tạo tài khoản, tôi đồng ý với{' '}
                  <a
                    href="#"
                    className="text-orange-600 hover:text-orange-700 font-medium underline"
                  >
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a
                    href="#"
                    className="text-orange-600 hover:text-orange-700 font-medium underline"
                  >
                    Chính sách bảo mật
                  </a>{' '}
                  của ReTrade.
                </label>
              </div>
              {errors.terms && <div className="text-red-500 text-sm">{errors.terms}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg font-medium text-lg transition-all duration-200 ${
                  isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-orange-600 hover:to-orange-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  'Tạo tài khoản'
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

              {/* Social buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full border-2 border-orange-200 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 group"
                >
                  <Image src="/Google__G__logo.svg.png" alt="Google" width={20} height={20} />
                  <span className="text-gray-700 font-medium group-hover:text-gray-800">
                    Đăng ký với Google
                  </span>
                </button>
              </div>

              <div className="text-center pt-4 border-t border-orange-200">
                <span className="text-gray-600">Bạn đã có tài khoản? </span>
                <a
                  href="/login"
                  className="text-orange-600 hover:text-orange-700 font-bold transition-colors duration-200"
                >
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
