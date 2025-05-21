'use client';
import { Mail } from "lucide-react";
import Image from 'next/image';

interface Profile {
    name: string;
    username: string;
    email: string;
    phone?: string;
    gender: string;
    country: string;
    avatarUrl: string;
    lastUpdated: string;
}

const fakeProfile: Profile = {
    name: "Hien Nguyen",
    username: "Hiennguyen123",
    email: "Hiennguyen25@gmail.com",
    phone: "",
    gender: "Nữ",
    country: "Việt Nam",
    avatarUrl: "/Facebook_icon.svg.png",
    lastUpdated: "1 month ago",
};

export default function ProfilePage() {
    const profile = fakeProfile;

    return (
        <div className="w-full bg-white flex items-center justify-center p-10">
            <div className="w-[900px] bg-[#FFF8F3] rounded-lg shadow-lg p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <div className="w-40 h-40 bg-gray-300 rounded-full mr-4 overflow-hidden">
                            <Image
                                src={profile.avatarUrl}
                                alt={profile.name}
                                width={150}
                                height={150}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-black">{profile.name}</h2>
                            <p className="text-sm text-gray-600">{profile.email}</p>
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
                                placeholder="Thêm số điện thoại"
                                defaultValue={profile.phone || ""}
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
                                defaultValue={profile.name}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                            <select
                                defaultValue={profile.gender}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                            >
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
                            <select
                                defaultValue={profile.country}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                            >
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
                                <Mail className='w-6 h-6'/>
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
    );
}
