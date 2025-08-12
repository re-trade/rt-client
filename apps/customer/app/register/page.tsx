'use client';
import { Province, useCustomerRegister } from '@/hooks/use-customer-register';
import { unAuthApi } from '@retrade/util';
import { IconUpload, IconUser, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export interface District {
  code: number;
  name: string;
  wards: Ward[];
}

export interface Ward {
  code: number;
  name: string;
}

export default function Register() {
  const {
    // Form data
    formData,
    handleInputChange,

    // Validation states
    usernameValidation,
    emailValidation,

    // Form errors
    errors,
    setErrors,

    // Avatar handling
    avatarFile,
    avatarPreview,
    avatarError,
    handleAvatarUpload,
    removeAvatar,
    triggerFileInput,
    fileInputRef,

    // Password visibility
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,

    // Terms and submission
    termsAccepted,
    setTermsAccepted,
    isLoading,
    handleSubmit,
  } = useCustomerRegister();

  // Address selection state
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingAddress(true);
        const response = await unAuthApi.province.get<Province[]>('/p/');
        setProvinces(response.data);
      } catch {
        setErrors((prev) => ({ ...prev, general: 'Không thể tải danh sách tỉnh/thành phố' }));
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchProvinces();
  }, [setErrors]);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) {
        setDistricts([]);
        setWards([]);
        return;
      }

      try {
        setLoadingAddress(true);
        const response = await unAuthApi.province.get<Province>(`/p/${selectedProvince}?depth=2`);
        setDistricts(response.data.districts || []);
        setWards([]);
      } catch {
        setErrors((prev) => ({ ...prev, general: 'Không thể tải danh sách quận/huyện' }));
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchDistricts();
  }, [selectedProvince, setErrors]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) {
        setWards([]);
        return;
      }

      try {
        setLoadingAddress(true);
        const response = await unAuthApi.province.get<District>(`/d/${selectedDistrict}?depth=2`);
        setWards(response.data.wards || []);
      } catch {
        setErrors((prev) => ({ ...prev, general: 'Không thể tải danh sách phường/xã' }));
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchWards();
  }, [selectedDistrict, setErrors]);

  // Handle address selection changes
  const handleAddressChange = (type: string, value: string) => {
    // Only clear address errors when actually selecting a value (not just clicking dropdown)
    if (value) {
      setErrors((prev) => ({ ...prev, address: '' }));
    }

    if (type === 'province') {
      setSelectedProvince(value);
      setSelectedDistrict('');
      setSelectedWard('');

      // Find the province name for the address
      const province = provinces.find((p) => p.code.toString() === value);
      if (province) {
        handleInputChange({
          target: { name: 'address', value: province.name },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    } else if (type === 'district') {
      setSelectedDistrict(value);
      setSelectedWard('');

      // Update address with province and district
      const province = provinces.find((p) => p.code.toString() === selectedProvince);
      const district = districts.find((d) => d.code.toString() === value);
      if (province && district) {
        handleInputChange({
          target: { name: 'address', value: `${district.name}, ${province.name}` },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    } else if (type === 'ward') {
      setSelectedWard(value);

      // Update full address with ward, district, and province
      const province = provinces.find((p) => p.code.toString() === selectedProvince);
      const district = districts.find((d) => d.code.toString() === selectedDistrict);
      const ward = wards.find((w) => w.code.toString() === value);

      if (province && district && ward) {
        const fullAddress = `${ward.name}, ${district.name}, ${province.name}`;

        // Update the form data with the full address string
        handleInputChange({
          target: { name: 'address', value: fullAddress },
        } as React.ChangeEvent<HTMLInputElement>);

        // Set address error to empty immediately when we have a complete address
        setErrors((prev) => ({ ...prev, address: '' }));
      }
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-amber-900 mb-4">Đăng ký tài khoản</h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto leading-relaxed">
            Bắt đầu hành trình &ldquo;săn đồ&rdquo; thông minh trên ReTrade
          </p>
        </div>

        <div className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">Thông tin cá nhân</h2>
            <p className="text-amber-100 text-sm">
              Vui lòng điền đầy đủ thông tin để tạo tài khoản
            </p>
          </div>

          <div className="p-8">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p className="text-red-700 font-medium">{errors.general}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-amber-200 overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <IconUser size={32} className="text-amber-600" />
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
                    className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors duration-200 text-sm font-medium"
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

              {/* Main form grid */}
              <div className="bg-white rounded-xl border border-amber-100 p-6 space-y-6">
                {/* Username + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-900">Tên đăng nhập *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Nhập tên đăng nhập"
                        className={`w-full p-3 border-2 rounded-lg bg-white text-gray-900 focus:outline-none transition-colors ${
                          errors.username || usernameValidation.isValid === false
                            ? 'border-red-500'
                            : usernameValidation.isValid === true
                              ? 'border-green-500'
                              : 'border-amber-200 focus:border-amber-500'
                        }`}
                        required
                      />
                      {usernameValidation.isValidating && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
                        </div>
                      )}
                    </div>
                    {errors.username && (
                      <div className="text-red-500 text-sm">{errors.username}</div>
                    )}
                    {!errors.username && usernameValidation.message && (
                      <div
                        className={`text-sm ${
                          usernameValidation.isValid === true
                            ? 'text-green-600'
                            : usernameValidation.isValid === false
                              ? 'text-red-500'
                              : 'text-gray-500'
                        }`}
                      >
                        {usernameValidation.message}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-900">Email *</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Nhập email"
                        className={`w-full p-3 border-2 rounded-lg bg-white text-gray-900 focus:outline-none transition-colors ${
                          errors.email || emailValidation.isValid === false
                            ? 'border-red-500'
                            : emailValidation.isValid === true
                              ? 'border-green-500'
                              : 'border-amber-200 focus:border-amber-500'
                        }`}
                        required
                      />
                      {emailValidation.isValidating && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
                        </div>
                      )}
                    </div>
                    {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                    {!errors.email && emailValidation.message && (
                      <div
                        className={`text-sm ${
                          emailValidation.isValid === true
                            ? 'text-green-600'
                            : emailValidation.isValid === false
                              ? 'text-red-500'
                              : 'text-gray-500'
                        }`}
                      >
                        {emailValidation.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* First + Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-900">Họ *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ"
                      className={`w-full p-3 border-2 rounded-lg bg-white text-gray-900 focus:outline-none transition-colors ${
                        errors.firstName
                          ? 'border-red-500'
                          : 'border-amber-200 focus:border-amber-500'
                      }`}
                      required
                    />
                    {errors.firstName && (
                      <div className="text-red-500 text-sm">{errors.firstName}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-900">Tên *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Nhập tên"
                      className={`w-full p-3 border-2 rounded-lg bg-white text-gray-900 focus:outline-none transition-colors ${
                        errors.lastName
                          ? 'border-red-500'
                          : 'border-amber-200 focus:border-amber-500'
                      }`}
                      required
                    />
                    {errors.lastName && (
                      <div className="text-red-500 text-sm">{errors.lastName}</div>
                    )}
                  </div>
                </div>

                {/* Phone + Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-900">Số điện thoại *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      className={`w-full p-3 border-2 rounded-lg bg-white text-gray-900 focus:outline-none transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-amber-200 focus:border-amber-500'
                      }`}
                      required
                    />
                    {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-900">Giới tính</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full p-3 border-2 rounded-lg bg-white text-gray-900 focus:outline-none transition-colors ${
                        errors.gender ? 'border-red-500' : 'border-amber-200 focus:border-amber-500'
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

                {/* Address Section */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-900">
                      Tỉnh/Thành phố <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => handleAddressChange('province', e.target.value)}
                      disabled={loadingAddress || provinces.length === 0}
                      className={`w-full p-3 border-2 rounded-lg bg-white text-gray-900 focus:outline-none transition-colors ${
                        selectedProvince
                          ? 'border-green-500'
                          : errors.address
                            ? 'border-red-500'
                            : 'border-amber-200 focus:border-amber-500'
                      }`}
                      required
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code.toString()}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                    {loadingAddress && (
                      <div className="flex items-center text-amber-600 text-xs mt-1">
                        <div className="animate-spin w-3 h-3 border border-amber-600 border-t-transparent rounded-full mr-2"></div>
                        Đang tải dữ liệu địa chỉ...
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-900">
                      Quận/Huyện <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => handleAddressChange('district', e.target.value)}
                      disabled={loadingAddress || districts.length === 0 || !selectedProvince}
                      className={`w-full p-3 border-2 rounded-lg bg-white text-gray-900 focus:outline-none transition-colors ${
                        selectedDistrict
                          ? 'border-green-500'
                          : errors.address
                            ? 'border-red-500'
                            : 'border-amber-200 focus:border-amber-500'
                      } ${!selectedProvince ? 'bg-gray-50 text-gray-400' : ''}`}
                      required
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.map((district) => (
                        <option key={district.code} value={district.code.toString()}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-900">
                      Phường/Xã <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={selectedWard}
                      onChange={(e) => handleAddressChange('ward', e.target.value)}
                      disabled={loadingAddress || wards.length === 0 || !selectedDistrict}
                      className={`w-full p-3 border-2 rounded-lg bg-white text-gray-900 focus:outline-none transition-colors ${
                        selectedWard
                          ? 'border-green-500'
                          : errors.address
                            ? 'border-red-500'
                            : 'border-amber-200 focus:border-amber-500'
                      } ${!selectedDistrict ? 'bg-gray-50 text-gray-400' : ''}`}
                      required
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map((ward) => (
                        <option key={ward.code} value={ward.code.toString()}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                    {!selectedProvince && !selectedDistrict && !selectedWard && !errors.address && (
                      <p className="text-amber-600 text-xs mt-1">
                        Vui lòng chọn lần lượt Tỉnh/Thành phố, Quận/Huyện và Phường/Xã
                      </p>
                    )}
                  </div>

                  {errors.address && (
                    <div className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded border border-red-100 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      {errors.address}
                    </div>
                  )}

                  {/* Hidden input for storing the full address - this is what gets submitted */}
                  <input type="hidden" name="address" value={formData.address} required />

                  {/* Visual indicator that selection is complete */}
                  {selectedProvince && selectedDistrict && selectedWard && !errors.address && (
                    <div className="text-green-600 text-sm mt-2 bg-green-50 p-2 rounded border border-green-100 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Đã chọn đầy đủ: {formData.address}
                    </div>
                  )}
                </div>

                {/* Password + Confirm Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-900">Mật khẩu *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Nhập mật khẩu"
                        className={`w-full p-3 border-2 rounded-lg bg-white text-gray-900 focus:outline-none transition-colors pr-12 ${
                          errors.password
                            ? 'border-red-500'
                            : 'border-amber-200 focus:border-amber-500'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('password')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-500 transition-colors"
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible size={20} />
                        ) : (
                          <AiOutlineEye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="text-red-500 text-sm">{errors.password}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-900">
                      Xác nhận mật khẩu *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="rePassword"
                        value={formData.rePassword}
                        onChange={handleInputChange}
                        placeholder="Nhập lại mật khẩu"
                        className={`w-full p-3 border-2 rounded-lg bg-white text-gray-900 focus:outline-none transition-colors pr-12 ${
                          errors.rePassword
                            ? 'border-red-500'
                            : 'border-amber-200 focus:border-amber-500'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-500 transition-colors"
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
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-5 h-5 text-amber-600 border-2 border-amber-300 rounded focus:ring-amber-500 focus:ring-2"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                  Bằng cách tạo tài khoản, tôi đồng ý với{' '}
                  <a href="#" className="text-amber-600 hover:text-amber-700 font-medium underline">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="#" className="text-amber-600 hover:text-amber-700 font-medium underline">
                    Chính sách bảo mật
                  </a>{' '}
                  của ReTrade.
                </label>
              </div>
              {errors.terms && <div className="text-red-500 text-sm">{errors.terms}</div>}

              {/* Submit button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    usernameValidation.isValidating ||
                    emailValidation.isValidating ||
                    usernameValidation.isValid === false ||
                    emailValidation.isValid === false
                  }
                  className={`px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                    isLoading ||
                    usernameValidation.isValidating ||
                    emailValidation.isValidating ||
                    usernameValidation.isValid === false ||
                    emailValidation.isValid === false
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </div>
                  ) : usernameValidation.isValidating || emailValidation.isValidating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang kiểm tra...
                    </div>
                  ) : (
                    'Tạo tài khoản'
                  )}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-amber-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">HOẶC</span>
                </div>
              </div>

              {/* Social buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full border-2 border-amber-200 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 group"
                >
                  <Image src="/Google__G__logo.svg.png" alt="Google" width={20} height={20} />
                  <span className="text-gray-700 font-medium group-hover:text-gray-800">
                    Đăng ký với Google
                  </span>
                </button>
              </div>

              <div className="text-center pt-4 border-t border-amber-200">
                <span className="text-gray-600">Bạn đã có tài khoản? </span>
                <a
                  href="/login"
                  className="text-amber-600 hover:text-amber-700 font-bold transition-colors duration-200"
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
