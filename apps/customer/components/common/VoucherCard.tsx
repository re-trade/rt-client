import React from "react";
import { BiCategory } from "react-icons/bi";

interface Voucher {
  id: number;
  title: string;
  date: string;
  decription: string;
  categoryName: string;
  categoryIcon: string;
}
interface Props {
  vouchers: Voucher;
  index: number;
}

export default function VoucherCard({ vouchers, index }: Props) {
  return (
    <div className="bg-white border-l-4 border-orange-500 p-5 shadow rounded-lg relative space-y-3 h-full">
      <div className="absolute top-2 left-2 bg-[#FF9999] text-white text-xs px-2 py-0.5 rounded">
        Số lượng có hạn
      </div>
      <div className="absolute top-2 right-2 text-red-500 font-semibold text-sm">
        Dùng ngay &gt;
      </div>
      <div className="flex items-center space-x-3">
        <div className="size-6">{vouchers.categoryIcon}</div>
        <div>
          <div className="font-bold text-orange-600 mt-2 text-lg">{vouchers.title}</div>
          <div className="text-sm text-gray-500">{vouchers.date}</div>
        </div>

      </div>
      <div>
        <a href="#" className="text-blue-500 text-sm underline">
          Điều Kiện
        </a>
      </div>
    </div>
  );
}
