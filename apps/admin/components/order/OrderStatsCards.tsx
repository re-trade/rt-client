'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TOrderCombo } from '@/services/order.api';
import { CreditCard, Package, ShoppingCart, TrendingUp } from 'lucide-react';

interface OrderStatsCardsProps {
  orderCombos: TOrderCombo[];
}

export default function OrderStatsCards({ orderCombos }: OrderStatsCardsProps) {
  const processingCount =
    orderCombos?.filter((o) =>
      ['PREPARING', 'DELIVERING'].includes(o.orderStatus?.code?.toUpperCase()),
    ).length || 0;

  const deliveredCount =
    orderCombos?.filter((o) =>
      ['DELIVERED', 'COMPLETED'].includes(o.orderStatus?.code?.toUpperCase()),
    ).length || 0;

  const totalRevenue = orderCombos?.reduce((sum, o) => sum + (o.grandPrice || 0), 0) || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">{orderCombos?.length || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Đang xử lý</p>
              <p className="text-2xl font-bold text-orange-600">{processingCount}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Đã giao</p>
              <p className="text-2xl font-bold text-green-600">{deliveredCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Doanh thu</p>
              <p className="text-2xl font-bold text-purple-600">
                {totalRevenue.toLocaleString('vi-VN') || '0'}đ
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
