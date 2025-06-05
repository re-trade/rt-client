import React from "react";

interface VoucherCardProps {
  title: string;
  date: string;
}

export default function VoucherCard({ title, date }: VoucherCardProps) {
 return (
    <div className="bg-white border-l-4 border-orange-500 p-5 shadow rounded-lg relative space-y-3 h-full">
      <div className="absolute top-2 left-2 bg-[#FF9999] text-white text-xs px-2 py-0.5 rounded">
        Số lượng có hạn
      </div>
      <div className="absolute top-2 right-2 text-red-500 font-semibold text-sm">
        Dùng ngay &gt;
      </div>
      <div className="font-bold text-orange-600 text-lg">{title}</div>
      <div className="text-sm text-gray-500">{date}</div>
      <div>
        <a href="#" className="text-blue-500 text-sm underline">
          Điều Kiện
        </a>
      </div>
    </div>
  );
}
