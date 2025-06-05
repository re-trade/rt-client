"use client";
import React from "react";
import VoucherCard from "@/components/common/VoucherCard";
const categories = [
  { name: "HÀNG TIÊU DÙNG", icon: "🧴" },
  { name: "THỜI TRANG", icon: "👕" },
  { name: "ĐIỆN TỬ", icon: "📷" },
  { name: "PHONG CÁCH SỐNG", icon: "🏍️" },
  { name: "ƯU ĐÃI ĐỐI TÁC", icon: "🤝" },
];

const vouchers = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: "Hoàn 100% xu Đơn Tối Thiểu 0₫ Tối đa 88k Xu",
  date: `Có Hiệu Lực Từ: 0${i + 1}.01.2021 09:00`,
}));

export default function VoucherPage() {
  return (
    <div className="w-full h-full bg-white p-10">
      <div className="w-full bg-[#FFF8F3] rounded-lg shadow-lg p-6">
        {/* Header Categories */}
        <div className="flex justify-around bg-white p-4 rounded-lg shadow mb-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex flex-col items-center text-sm text-gray-700 hover:text-orange-600 transition"
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div>{cat.name}</div>
            </div>
          ))}
        </div>
        {/* Voucher Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {vouchers.map((voucher) => (
            <VoucherCard
              key={voucher.id}
              title={voucher.title}
              date={voucher.date}
            />
          ))}
          </div>
    
      </div>
    </div>
  );
}
