'use client';
import VoucherCard from '@/components/common/VoucherCard';
import { useState } from 'react';
const categories = [
  { name: 'HÀNG TIÊU DÙNG', icon: '🧴' },
  { name: 'THỜI TRANG', icon: '👕' },
  { name: 'ĐIỆN TỬ', icon: '📷' },
  { name: 'PHONG CÁCH SỐNG', icon: '🏍️' },
  { name: 'ƯU ĐÃI ĐỐI TÁC', icon: '🤝' },
];

const vouchers = Array.from({ length: 10 }, (_, i) => {
  const category = categories[i % categories.length]!; // dùng non-null assertion

  const day = String(i + 1).padStart(2, '0');

  return {
    id: i + 1,
    title: 'Hoàn 100% xu Đơn Tối Thiểu 0₫ Tối đa 88k Xu',
    date: `Có Hiệu Lực Từ: ${day}.01.2021 09:00`,
    decription:
      'Giảm giá 100% cho đơn hàng tối thiểu 0₫, tối đa 88k xu. Chỉ áp dụng cho khách hàng mới.',
    categoryName: category.name,
    categoryIcon: category.icon,
  };
});

export default function VoucherPage() {
  const ITEMS_PER_PAGE = 9;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(vouchers.length / ITEMS_PER_PAGE);

  const currentVouchers = vouchers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-10 gap-y-6 sm:gap-y-8">
          {currentVouchers.map((voucher, idx) => (
            <VoucherCard key={voucher.id} index={idx} vouchers={voucher} />
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-orange-600 rounded disabled:opacity-50"
          >
            Trang trước
          </button>

          <span className="px-4 py-2">
            Trang {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-orange-600 rounded disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}
