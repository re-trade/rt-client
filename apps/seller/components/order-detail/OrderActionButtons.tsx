import { ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function OrderActionButtons() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-orange-200 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200">
          <MessageCircle className="w-4 h-4" />
          <span>Liên hệ người bán</span>
        </button>

        <Link href="/dashboard/my-order">
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg">
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
