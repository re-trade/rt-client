'use client';

import { ArrowLeft, Copy } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface OrderDetailHeaderProps {
  orderId: string;
  status: {
    label: string;
    description: string;
    color: string;
    icon: React.ElementType;
  };
  createDate?: string;
  formatDate: (date: string) => string;
}

export function OrderDetailHeader({
  orderId,
  status,
  createDate,
  formatDate,
}: OrderDetailHeaderProps) {
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/my-order">
            <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex items-center space-x-2">
                <span className="text-orange-100 text-sm">Mã đơn hàng:</span>
                <span className="font-medium">#{orderId.slice(0, 8)}...</span>
                <button
                  onClick={handleCopyOrderId}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Sao chép mã đơn hàng"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {copiedOrderId && (
                  <span className="text-xs text-green-200 font-medium">Đã sao chép!</span>
                )}
              </div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border bg-white/20 text-white border-white/30`}
              >
                <status.icon className="w-4 h-4" />
                <span>{status.description}</span>
              </div>
            </div>
            {createDate && (
              <div className="text-sm text-orange-100 mt-1">
                <span>Mua lúc: {formatDate(createDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
