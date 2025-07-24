'use client';

import { Send } from 'lucide-react';

export default function MessengerPage() {
  return (
    <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
      <div className="text-center max-w-lg mx-auto p-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Send className="text-orange-500" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Chào mừng đến với Chat Seller</h2>
        <p className="text-gray-600 leading-relaxed mb-8 text-lg">
          Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin với khách hàng
        </p>
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg">Mẹo sử dụng</h3>
          <ul className="text-gray-600 space-y-3 text-left">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Tìm kiếm khách hàng bằng thanh tìm kiếm
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Sử dụng nút gọi để liên hệ trực tiếp với khách hàng
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Đính kèm hình ảnh và tệp tin để hỗ trợ khách hàng tốt hơn
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Trả lời nhanh chóng để tăng trải nghiệm khách hàng
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
