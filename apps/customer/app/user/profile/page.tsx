'use client';

import { useAuth } from '@/hooks/use-auth';
import { useCustomerProfile } from '@/hooks/use-customer-profile';
import { TAccountMeResponse } from '@/services/auth.api';
import { Calendar, Camera, Check, Edit3, Mail, Map, Phone, Shield, User, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

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
  } = useCustomerProfile();
  const { account } = useAuth();
  const [avatar, setAvatar] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
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

  const handleInputChange = (field: keyof TAccountMeResponse, value: string) => {
    if (updateProfileForm) {
      setUpdateProfileForm({
        ...updateProfileForm,
        [field]: value,
      });
    }
  };

  const handleSave = async () => {
    if (!updateProfileForm) return;

    try {
      await updateProfile();
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
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FDFEF9] p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEF9] p-3 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="bg-white rounded-xl shadow-md border border-[#525252]/20 overflow-hidden">
          <div className="bg-[#FFD2B2] p-4 sm:p-6 text-[#121212]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Hồ Sơ Cá Nhân</h1>
                  <p className="text-[#121212] mt-1 text-sm sm:text-base">
                    Quản lý thông tin và tùy chỉnh tài khoản của bạn
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-white/20 hover:bg-white/30 text-[#121212] px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#121212] border-t-transparent"></div>
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>{isLoading ? 'Đang lưu...' : 'Lưu'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="bg-white/10 hover:bg-white/20 text-[#121212] px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                      <span>Hủy</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-[#121212] hover:bg-[#FDFEF9] px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Chỉnh sửa</span>
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
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-[#525252]/20">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                    {isUploadingAvatar ? (
                      <div className="w-full h-full bg-[#FFD2B2] flex items-center justify-center">
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
                    className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Thay đổi ảnh đại diện"
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-4">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600">@{profile.username}</p>
                <p className="text-xs text-gray-500 mt-2 px-4">
                  Nhấp vào biểu tượng camera để thay đổi ảnh đại diện
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-[#525252]/20">
              <h3 className="text-base sm:text-lg font-semibold text-[#121212] mb-4 flex items-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#121212]" />
                Thông tin tài khoản
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ngày tham gia</span>
                  <span className="text-sm font-medium text-gray-800 flex items-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-amber-600" />
                    {account?.joinInDate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cập nhật cuối</span>
                  <span className="text-sm font-medium text-gray-800">
                    {profile.lastUpdate
                      ? new Date(profile.lastUpdate).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Trạng thái</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Đã xác thực
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-8 border border-[#525252]/20">
              <div className="mb-6 sm:mb-8 text-gray-900">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />
                  Thông tin cá nhân
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ *</label>
                    <input
                      type="text"
                      value={updateProfileForm?.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-xl transition-all duration-200 ${
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
                      className={`w-full p-3 border rounded-xl transition-all duration-200 ${
                        isEditing
                          ? 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      value={profile.username}
                      disabled
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Không thể thay đổi tên đăng nhập</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới tính
                    </label>
                    <select
                      value={updateProfileForm?.gender ?? 0}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-xl transition-all duration-200 ${
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
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-6 flex items-center">
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
                        className="w-full pl-8 sm:pl-10 p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
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
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Nhập số điện thoại"
                        className={`w-full pl-8 sm:pl-10 p-3 border rounded-xl transition-all duration-200 ${
                          isEditing
                            ? 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Map className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={updateProfileForm?.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Nhập địa chỉ của bạn"
                        className={`w-full pl-8 sm:pl-10 p-3 border rounded-xl transition-all duration-200 ${
                          isEditing
                            ? 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                      />
                    </div>
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
