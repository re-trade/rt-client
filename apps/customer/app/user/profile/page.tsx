'use client';
import Image from 'next/image';

interface Profile {
    name: string;
    username: string;
    email: string;
    phone ?: string;
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
                            <h2 className="text-black text-lg text-font font-semibold">{profile.name}</h2>
                            <p className="text-gray-600 text-sm">{profile.email}</p>
                        </div>
                    </div>
                    <button className="bg-[#FFD2B2] text-black px-4 py-2 rounded hover:bg-[#ffbf99] transition">
                        Lưu
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                            <input
                                type="text"
                                value={profile.username}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
                                readOnly
                            />
                            <p className="text-xs text-gray-500 mt-1">Tên đăng nhập chỉ có thể thay đổi bằng cách liên hệ hỗ trợ.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                            <input
                                type="text"
                                placeholder="Thêm số điện thoại"
                                value={profile.phone}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên</label>
                            <input
                                type="text"
                                value={profile.name}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                            <select
                                value={profile.gender}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
                            >
                                <option>Nam</option>
                                <option>Nữ</option>
                                <option>Khác</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quốc gia</label>
                            <select
                                value={profile.country}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
                            >
                                <option>Việt Nam</option>
                                <option>Mỹ</option>
                                <option>Khác</option>
                            </select>
                        </div>
                        <div></div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Địa chỉ Email</label>
                        <div className="mt-1 flex items-center">
                            <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                value={profile.email}
                                readOnly
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{profile.lastUpdated}</p>
                        <button className="mt-2 bg-[#FFD2B2] text-black px-4 py-2 rounded hover:bg-[#ffbf99] transition">
                            +Add Email Address
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
