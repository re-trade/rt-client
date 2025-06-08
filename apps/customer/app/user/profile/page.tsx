'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import { getCustomerProfile } from '@services/account.api'; 

type TCustomerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  address: string;
  avatarUrl: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<TCustomerProfile | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getCustomerProfile();
      if (data) {
        setProfile(data);
        setAvatarPreview(data.avatarUrl);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!profile) return <div className="p-10 text-center">Đang tải hồ sơ...</div>;

  return (
    <div className="w-full h-full bg-white p-10">
      <div className="w-full rounded-lg shadow-lg p-6">
        <div className="max-w-5xl mx-auto p-6 bg-[#fff2e6] shadow-lg rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-40 h-40 bg-gray-300 rounded-full mr-4 overflow-hidden relative cursor-pointer" onClick={triggerFileInput}>
                <Image
                  src={avatarPreview || '/default-avatar.png'}
                  alt="avatar"
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-black">{`${profile.firstName} ${profile.lastName}`}</h2>
                <p className="text-lg text-gray-600">{profile.email}</p>
              </div>
            </div>
            <button className="bg-[#FFD2B2] text-black px-4 py-2 rounded hover:bg-[#ffbf99] transition">
              Lưu
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Username & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                <input
                  type="text"
                  value={profile.username}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-black cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Không thể thay đổi tên đăng nhập.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="text"
                  defaultValue={profile.phone || ''}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                />
              </div>
            </div>

            {/* Name & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  defaultValue={`${profile.firstName} ${profile.lastName}`}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            {/* Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quốc gia</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black">
                  <option value="Việt Nam">Việt Nam</option>
                  <option value="Mỹ">Mỹ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div></div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Địa chỉ Email</label>
              <div className="mt-1 flex items-center">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500">
                  <Mail className="w-6 h-6" />
                </span>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-r-lg bg-gray-100 text-black cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
