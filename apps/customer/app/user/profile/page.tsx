'use client';

import { useAuth } from '@/hooks/use-auth';
import { useCustomerProfile } from '@/hooks/use-customer-profile';
import { TCustomerProfileResponse } from '@/services/customer-profile.api';
import {
  Calendar,
  Camera,
  Check,
  ChevronDown,
  Edit3,
  Loader2,
  Mail,
  Map,
  Phone,
  Shield,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function ProfilePage() {
  const {
    profile,
    updateProfile,
    updateProfileForm,
    setUpdateProfileForm,
    uploadAndUpdateAvatar,
    isLoading,
    isUploadingAvatar,
    error,
    // Address management
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    loadingAddress,
    handleAddressChange,
    handleEnterEditMode,
    handleExitEditMode,
  } = useCustomerProfile();
  const { account } = useAuth();
  const [avatar, setAvatar] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [phoneError, setPhoneError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile?.avatarUrl) {
      try {
        new URL(profile.avatarUrl);
        setAvatar(profile.avatarUrl);
      } catch {
        setAvatar('/default-avatar.png');
      }
    } else {
      setAvatar('/default-avatar.png');
    }
  }, [profile]);

  const handleAvatarUpload = async (file: File) => {
    try {
      await uploadAndUpdateAvatar(file);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update avatar. Please try again.');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      try {
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select a valid image file');
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('File size must be less than 5MB');
        }
        await handleAvatarUpload(file);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to upload avatar');
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (field: keyof TCustomerProfileResponse, value: string) => {
    if (updateProfileForm) {
      setUpdateProfileForm({
        ...updateProfileForm,
        [field]: value,
      });
    }
  };

  // Phone number validation handler
  const handlePhoneChange = (value: string) => {
    // Remove all non-digit characters
    const numbersOnly = value.replace(/\D/g, '');

    // Limit to 10 digits
    const limitedValue = numbersOnly.slice(0, 10);

    // Validate and set error message
    if (limitedValue.length > 0 && limitedValue.length < 10) {
      setPhoneError('Số điện thoại phải có đúng 10 chữ số');
    } else {
      setPhoneError('');
    }

    // Update the form
    if (updateProfileForm) {
      setUpdateProfileForm({
        ...updateProfileForm,
        phone: limitedValue,
      });
    }
  };

  const handleSave = async () => {
    if (!updateProfileForm) return;

    // Validate phone number
    if (updateProfileForm.phone && updateProfileForm.phone.length !== 10) {
      alert('Số điện thoại phải có đúng 10 chữ số');
      return;
    }

    // Validate phone number contains only digits
    if (updateProfileForm.phone && !/^\d{10}$/.test(updateProfileForm.phone)) {
      alert('Số điện thoại chỉ được chứa số');
      return;
    }

    try {
      await updateProfile();
      handleExitEditMode(); // Clear address fields
      setPhoneError(''); // Clear phone validation error
      setIsEditing(false);
    } catch {}
  };

  const handleCancel = () => {
    if (profile) {
      setUpdateProfileForm(profile);
      try {
        if (profile.avatarUrl) {
          new URL(profile.avatarUrl);
          setAvatar(profile.avatarUrl);
        } else {
          setAvatar('/default-avatar.png');
        }
      } catch {
        setAvatar('/default-avatar.png');
      }
    }
    handleExitEditMode(); // Clear address fields
    setPhoneError(''); // Clear phone validation error
    setIsEditing(false);
  };

  const handleEdit = async () => {
    setIsEditing(true);
    await handleEnterEditMode(); // Load address data for editing
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FDFEF9] p-4 sm:p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-orange-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="bg-white rounded-xl shadow-md border border-orange-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 sm:p-6 border-b border-orange-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-orange-500 rounded-lg">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Hồ sơ cá nhân</h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Quản lý thông tin và tùy chỉnh tài khoản của bạn
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 sm:space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-white/20 hover:bg-white/30 text-[#121212] px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#121212] border-t-transparent"></div>
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">{isLoading ? 'Đang lưu...' : 'Lưu'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="bg-white/10 hover:bg-white/20 text-[#121212] px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <X className="w-4 h-4" />
                      <span className="hidden sm:inline">Hủy</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="bg-white text-[#121212] hover:bg-[#FDFEF9] px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium text-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Chỉnh sửa</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-[#525252]/20">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                    {isUploadingAvatar ? (
                      <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-white border-t-transparent"></div>
                      </div>
                    ) : (
                      <Image
                        src={avatar || '/default-avatar.png'}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                        onError={() => {
                          setAvatar('/default-avatar.png');
                        }}
                      />
                    )}
                  </div>
                  <button
                    onClick={triggerFileInput}
                    disabled={isUploadingAvatar}
                    className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-1.5 sm:p-2 rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Thay đổi ảnh đại diện"
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-4">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">@{profile.username}</p>
                <p className="text-xs text-gray-500 mt-2 px-2">
                  Nhấp vào biểu tượng camera để thay đổi ảnh đại diện
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-orange-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500" />
                Thông tin tài khoản
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                  <span className="text-sm text-gray-600">Ngày tham gia</span>
                  <span className="text-sm font-medium text-gray-800 flex items-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-orange-500" />
                    {account?.joinInDate
                      ? new Date(account?.joinInDate).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                  <span className="text-sm text-gray-600">Cập nhật cuối</span>
                  <span className="text-sm font-medium text-gray-800">
                    {profile.lastUpdate
                      ? new Date(profile.lastUpdate).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                  <span className="text-sm text-gray-600">Trạng thái</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                    Đã xác minh
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8 border border-[#525252]/20">
              <div className="mb-6 sm:mb-8 text-gray-900">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />
                  Thông tin cá nhân
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ *</label>
                    <input
                      type="text"
                      value={updateProfileForm?.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-xl transition-all duration-200 text-sm sm:text-base ${
                        isEditing
                          ? 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên *</label>
                    <input
                      type="text"
                      value={updateProfileForm?.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-xl transition-all duration-200 text-sm sm:text-base ${
                        isEditing
                          ? 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      value={profile.username}
                      disabled
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-sm sm:text-base"
                    />
                    <p className="text-xs text-gray-500 mt-1">Không thể thay đổi tên đăng nhập</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới tính
                    </label>
                    <select
                      value={updateProfileForm?.gender ?? 0}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-xl transition-all duration-200 text-sm sm:text-base ${
                        isEditing
                          ? 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    >
                      <option value="0">Nam</option>
                      <option value="1">Nữ</option>
                      <option value="2">Khác</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-6 sm:mb-8 text-gray-900">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />
                  Thông tin liên hệ
                </h3>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full pl-9 sm:pl-10 p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-sm sm:text-base"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email đã được xác thực và không thể thay đổi
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={updateProfileForm?.phone || ''}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Nhập số điện thoại (10 số)"
                        maxLength={10}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        className={`w-full pl-9 sm:pl-10 p-3 border rounded-xl transition-all duration-200 text-sm sm:text-base ${
                          isEditing
                            ? phoneError
                              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white'
                              : 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                      />
                      {isEditing && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-xs text-gray-400">
                            {updateProfileForm?.phone?.length || 0}/10
                          </span>
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <p
                        className={`text-xs mt-1 ${phoneError ? 'text-red-500' : 'text-gray-500'}`}
                      >
                        {phoneError || 'Chỉ nhập số, tối đa 10 chữ số'}
                      </p>
                    )}
                  </div>
                  {/* Address Section with Toggle Behavior */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ{' '}
                      {isEditing && (
                        <span className="text-xs text-amber-600">(Chế độ chỉnh sửa)</span>
                      )}
                    </label>

                    {!isEditing ? (
                      /* Display Mode - Single Address Field */
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Map className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={updateProfileForm?.address || 'Chưa có địa chỉ'}
                          disabled
                          className="w-full pl-9 sm:pl-10 p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-sm sm:text-base"
                          placeholder="Địa chỉ của bạn"
                        />
                      </div>
                    ) : (
                      /* Edit Mode - Dropdown Components */
                      <div className="space-y-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="flex items-center gap-2 text-xs text-amber-700 font-medium mb-2">
                          <span>📍</span>
                          <span>Chọn địa chỉ mới của bạn</span>
                        </div>
                        {/* Province/District/Ward Dropdowns */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Province Dropdown */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                              Tỉnh/Thành phố <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <select
                                value={selectedProvince}
                                onChange={(e) => handleAddressChange('province', e.target.value)}
                                disabled={loadingAddress}
                                className="w-full p-3 border border-amber-300 rounded-xl transition-all duration-200 text-sm appearance-none bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                              >
                                <option value="">
                                  {loadingAddress ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}
                                </option>
                                {provinces.map((province) => (
                                  <option key={province.code} value={province.code.toString()}>
                                    {province.name}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                {loadingAddress ? (
                                  <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* District Dropdown */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                              Quận/Huyện <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <select
                                value={selectedDistrict}
                                onChange={(e) => handleAddressChange('district', e.target.value)}
                                disabled={loadingAddress || !selectedProvince}
                                className={`w-full p-3 border rounded-xl transition-all duration-200 text-sm appearance-none ${
                                  selectedProvince
                                    ? 'border-amber-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                }`}
                              >
                                <option value="">
                                  {loadingAddress ? 'Đang tải...' : 'Chọn quận/huyện'}
                                </option>
                                {districts.map((district) => (
                                  <option key={district.code} value={district.code.toString()}>
                                    {district.name}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                {loadingAddress ? (
                                  <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Ward Dropdown */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                              Phường/Xã <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <select
                                value={selectedWard}
                                onChange={(e) => handleAddressChange('ward', e.target.value)}
                                disabled={loadingAddress || !selectedDistrict}
                                className={`w-full p-3 border rounded-xl transition-all duration-200 text-sm appearance-none ${
                                  selectedDistrict
                                    ? 'border-amber-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                }`}
                              >
                                <option value="">
                                  {loadingAddress ? 'Đang tải...' : 'Chọn phường/xã'}
                                </option>
                                {wards.map((ward) => (
                                  <option key={ward.code} value={ward.code.toString()}>
                                    {ward.name}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                {loadingAddress ? (
                                  <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
