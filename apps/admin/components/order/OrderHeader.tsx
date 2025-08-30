'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw, ShoppingCart } from 'lucide-react';

interface OrderHeaderProps {
  totalOrders: number;
  onRefresh: () => void;
}

export default function OrderHeader({ totalOrders, onRefresh }: OrderHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border border-orange-200/50 shadow-sm">
            <ShoppingCart className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Quản lý đơn hàng
            </h1>
            <p className="text-gray-600">Tổng cộng {totalOrders} đơn hàng</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onRefresh} size="lg" className="shadow-sm">
            <RefreshCw className="h-5 w-5 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>
    </div>
  );
}
