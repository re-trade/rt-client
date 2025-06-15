'use client';

import { Calendar, Camera, Check, Edit3, Mail, Phone, Shield, User, X } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

interface Profile {
  name: string;
  username: string;
  email: string;
  phone?: string;
  gender: string;
  country: string;
  avatarUrl: string;
  lastUpdated: string;
  joinDate: string;
  bio?: string;
}

const fakeProfile: Profile = {
  name: 'Hien Nguyen',
  username: 'Hiennguyen123',
  email: 'Hiennguyen25@gmail.com',
  phone: '+84 987 654 321',
  gender: 'Nữ',
  country: 'Việt Nam',
  avatarUrl: '/Facebook_icon.svg.png',
  lastUpdated: '1 tháng trước',
  joinDate: '15/03/2023',
  bio: 'Yêu thích việc chia sẻ và trao đổi đồ cũ để kết nối với cộng đồng. Tìm kiếm những món đồ độc đáo và có ý nghĩa.',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(fakeProfile);
  const [avatar, setAvatar] = useState<string>(profile.avatarUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile>(profile);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      // Simulate upload delay
      setTimeout(() => {
        setAvatar(url);
        setIsUploading(false);
      }, 1500);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Hồ Sơ Cá Nhân</h1>
                <p className="text-orange-100 mt-1">
                  Quản lý thông tin và tùy chỉnh tài khoản của bạn
                </p>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Lưu</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Hủy</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
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
                        alt={profile.name}
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

                <h2 className="text-xl font-bold text-gray-800 mt-4">{profile.name}</h2>
                <p className="text-gray-600">@{profile.username}</p>

                <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-700 italic">"{profile.bio}"</p>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-amber-600" />
                Thông tin tài khoản
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ngày tham gia</span>
                  <span className="text-sm font-medium text-gray-800 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-amber-600" />
                    {profile.joinDate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cập nhật cuối</span>
                  <span className="text-sm font-medium text-gray-800">{profile.lastUpdated}</span>
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

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-amber-600" />
                  Thông tin cá nhân
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editedProfile.name : profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-xl transition-all duration-200 ${
                        isEditing
                          ? 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Username */}
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

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới tính
                    </label>
                    <select
                      value={isEditing ? editedProfile.gender : profile.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-xl transition-all duration-200 ${
                        isEditing
                          ? 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quốc gia</label>
                    <select
                      value={isEditing ? editedProfile.country : profile.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-xl transition-all duration-200 ${
                        isEditing
                          ? 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    >
                      <option value="Việt Nam">Việt Nam</option>
                      <option value="Mỹ">Mỹ</option>
                      <option value="Nhật Bản">Nhật Bản</option>
                      <option value="Hàn Quốc">Hàn Quốc</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    value={isEditing ? editedProfile.bio : profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Chia sẻ về bản thân và sở thích của bạn..."
                    className={`w-full p-3 border rounded-xl transition-all duration-200 resize-none ${
                      isEditing
                        ? 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-amber-600" />
                  Thông tin liên hệ
                </h3>

                <div className="space-y-6">
                  {/* Email */}
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
                        value={profile.email}
                        disabled
                        className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email đã được xác thực và không thể thay đổi
                    </p>
                  </div>

                  {/* Phone */}
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
                        value={isEditing ? editedProfile.phone : profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Nhập số điện thoại"
                        className={`w-full pl-10 p-3 border rounded-xl transition-all duration-200 ${
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

        {/* Hidden file input */}
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
