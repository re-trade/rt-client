// SummaryPage.tsx
'use client';
import React, { useState } from 'react';
import AwaitingPayment from '@/components/order-product/AwaitingPayment';
import Shipping from '@/components/order-product/Shipping';
import Completed from '@/components/order-product/Completed';
import Cancelled from '@/components/order-product/Cancelled';
import Returned from '@/components/order-product/Returned';

const tabs = [
  { key: 'awaiting', label: 'Chờ thanh toán' },
  { key: 'shipping', label: 'Đang vận chuyển' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
  { key: 'returned', label: 'Trả hàng/Hoàn tiền' },
];

export default function SummaryPage() {
  const [activeTab, setActiveTab] = useState<string>('awaiting');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Tổng quan đơn hàng</h1>

      <div className="flex space-x-4 mb-6 border-b">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 px-4 font-semibold border-b-2 ${
              activeTab === tab.key
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'awaiting' && <AwaitingPayment />}
        {activeTab === 'shipping' && <Shipping />}
        {activeTab === 'completed' && <Completed />}
        {activeTab === 'cancelled' && <Cancelled />}
        {activeTab === 'returned' && <Returned />}
      </div>
    </div>
  );
}
