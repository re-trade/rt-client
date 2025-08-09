import { XCircle } from 'lucide-react';
import Link from 'next/link';

interface OrderDetailErrorProps {
  error?: string;
}

export function OrderDetailError({ error }: OrderDetailErrorProps) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-gray-600 mb-6">{error || 'Đơn hàng không tồn tại hoặc đã bị xóa'}</p>
        <Link href="/dashboard/my-order">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium">
            Quay lại danh sách đơn hàng
          </button>
        </Link>
      </div>
    </div>
  );
}
