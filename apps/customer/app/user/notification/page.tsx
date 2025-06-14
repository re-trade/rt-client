'use client';
import { useState } from 'react';

const categories = [
  { id: 'system', label: 'Thông báo hệ thống' },
  { id: 'promotion', label: 'Khuyến mãi' },
  { id: 'live', label: 'Live & Video' },
  { id: 'order', label: 'Đơn hàng' },
];

const fakeData = {
  system: [
    {
      id: 1,
      title: 'Cập nhật bảo trì hệ thống',
      content: 'Chúng tôi sẽ bảo trì từ 01:00 đến 03:00.',
    },
    { id: 2, title: 'Thay đổi chính sách', content: 'Chính sách hoàn trả đã được cập nhật.' },
  ],
  promotion: [
    { id: 3, title: 'Mã giảm giá 50%', content: 'Áp dụng cho đơn hàng từ 199k đến hết hôm nay.' },
    { id: 4, title: 'Freeship toàn quốc', content: 'Duy nhất 07/06 - không giới hạn lượt dùng!' },
  ],
  live: [
    { id: 5, title: 'Livestream 20h tối nay', content: 'Tham gia để nhận voucher 100k.' },
    { id: 6, title: 'Video mới từ Shop ABC', content: 'Khám phá sản phẩm mới nhất ngay.' },
  ],
  order: [
    { id: 7, title: 'Đơn hàng đã được giao', content: 'Mã đơn #123456 đã giao thành công.' },
    { id: 8, title: 'Đơn hàng bị hủy', content: 'Mã đơn #789012 đã bị hủy bởi người bán.' },
  ],
};

export default function NotificationPage() {
  const [activeTab, setActiveTab] = useState('system');

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thông Báo</h1>

      <div className="flex gap-4 mb-6 border-b">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`py-2 px-4 border-b-2 transition-all duration-200 ${
              activeTab === cat.id
                ? 'border-blue-500 text-blue-600 font-semibold'
                : 'border-transparent text-gray-600 hover:text-blue-500'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {fakeData[activeTab].map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded-lg shadow-sm bg-[#FFF2E6] hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg text-red-500">{item.title}</h2>
            <p className="text-black mt-1">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
