'use client';

import { useAuth } from '@/hooks/use-auth';
import { useCustomerProfile } from '@/hooks/use-customer-profile';
import { TCustomerProfileResponse } from '@/services/auth.api';
import { Calendar, Camera, Check, Edit3, Mail, Phone, Shield, User, X } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

export default function ProfilePage() {
  const { profile, setUpdateProfileForm } = useCustomerProfile();
  const { account } = useAuth();
  const [avatar, setAvatar] = useState<string>(profile?.avatarUrl || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      setTimeout(() => {
        setAvatar(url);
        setIsUploading(false);
      }, 1500);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (field: keyof TCustomerProfileResponse, value: string) => {
    // setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFEF9] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md border border-[#525252]/20 overflow-hidden">
          <div className="bg-[#FFD2B2] p-6 text-[#121212]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Hồ Sơ Cá Nhân</h1>
                  <p className="text-[#121212] mt-1">
                    Quản lý thông tin và tùy chỉnh tài khoản của bạn
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-white/20 hover:bg-white/30 text-[#121212] px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Lưu</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-white/10 hover:bg-white/20 text-[#121212] px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Hủy</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-[#121212] hover:bg-[#FDFEF9] px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                    {isUploading ? (
                      <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                      </div>
                    ) : (
                      <Image
                        src={avatar}
                        alt={profile?.lastName ?? 'N/A'}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mt-4">{profile?.lastName}</h2>
                <p className="text-gray-600">@{profile?.username}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
              <h3 className="text-lg font-semibold text-[#121212] mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#121212]" />
                Thông tin tài khoản
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ngày tham gia</span>
                  <span className="text-sm font-medium text-gray-800 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-amber-600" />
                    {account?.joinInDate
                      ? new Date(account?.joinInDate).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cập nhật cuối</span>
                  <span className="text-sm font-medium text-gray-800">{account?.joinInDate}</span>
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
            <div className="bg-white rounded-xl shadow-md p-8 border border-[#525252]/20">
              <div className="mb-8 text-gray-900">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-amber-600" />
                  Thông tin cá nhân
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ *</label>
                    <input
                      type="text"
                      value={profile?.lastName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-xl transition-all duration-200 ${isEditing
                        ? 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên *</label>
                    <input
                      type="text"
                      value={profile?.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-xl transition-all duration-200 ${isEditing
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
                      value={account?.username}
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
                      value={profile?.gender ?? 0}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-xl transition-all duration-200 ${isEditing
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
              <div className="mb-8 text-gray-900">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-amber-600" />
                  Thông tin liên hệ
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={profile?.email}
                        disabled
                        className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
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
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={profile?.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Nhập số điện thoại"
                        className={`w-full pl-10 p-3 border rounded-xl transition-all duration-200 ${isEditing
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
