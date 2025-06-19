'use client';
import { Bell } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FDFEF9] p-3 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md border border-[#525252]/20 overflow-hidden">
          <div className="bg-[#FFD2B2] p-4 sm:p-6 text-[#121212]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Thông Báo</h1>
                  <p className="text-[#121212] mt-1 text-sm sm:text-base">
                    Thông báo từ hệ thống và các cập nhật mới nhất
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-[#525252]/20">
          <div className="flex gap-2 sm:gap-4 mb-6 border-b overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`py-2 px-3 sm:px-4 border-b-2 transition-all duration-200 whitespace-nowrap text-sm sm:text-base ${
                  activeTab === cat.id
                    ? 'border-[#FFD2B2] text-[#121212] font-semibold'
                    : 'border-transparent text-[#525252] hover:text-[#121212]'
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
                className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition border-[#525252]/20"
              >
                <h2 className="font-semibold text-base sm:text-lg text-[#121212]">{item.title}</h2>
                <p className="text-[#525252] mt-1 text-sm sm:text-base">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
