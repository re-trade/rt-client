'use client';

import { Card, CardContent } from '@/components/ui/card';
import { OrderMetricResponse } from '@/service/dashboard.api';
import { Box, CheckCircle, DollarSign, ShoppingBag } from 'lucide-react';

interface OrderMetricsProps {
  metrics?: OrderMetricResponse;
  loading?: boolean;
}

export const OrderMetrics = ({ metrics, loading = false }: OrderMetricsProps) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN') + 'đ';
  };

  if (!metrics && !loading) {
    return null;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <Card key={index} className="border-0 shadow-lg shadow-slate-200/50 bg-slate-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-24 bg-slate-200 animate-pulse rounded"></div>
                    <div className="h-8 w-16 bg-slate-300 animate-pulse rounded mt-2"></div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-slate-200 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  const defaultMetrics = {
    totalOrder: 0,
    orderCompleted: 0,
    orderCancelled: 0,
    totalPaymentReceived: 0,
  };

  const metricsData = [
    {
      title: 'Tổng đơn hàng',
      value: metrics?.totalOrder ?? defaultMetrics.totalOrder,
      icon: <ShoppingBag className="h-6 w-6 text-blue-600" />,
      bgGradient: 'from-blue-50 to-indigo-50',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Đơn hoàn thành',
      value: metrics?.orderCompleted ?? defaultMetrics.orderCompleted,
      icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
      bgGradient: 'from-emerald-50 to-green-50',
      iconBg: 'bg-emerald-100',
    },
    {
      title: 'Đơn hủy',
      value: metrics?.orderCancelled ?? defaultMetrics.orderCancelled,
      icon: <Box className="h-6 w-6 text-amber-600" />,
      bgGradient: 'from-amber-50 to-orange-50',
      iconBg: 'bg-amber-100',
    },
    {
      title: 'Tổng tiền nhận',
      value: formatCurrency(metrics?.totalPaymentReceived ?? defaultMetrics.totalPaymentReceived),
      icon: <DollarSign className="h-6 w-6 text-purple-600" />,
      bgGradient: 'from-purple-50 to-pink-50',
      iconBg: 'bg-purple-100',
      isMonetary: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((metric, index) => (
        <Card
          key={index}
          className={`border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br ${metric.bgGradient}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
              </div>
              <div
                className={`h-12 w-12 rounded-full ${metric.iconBg} flex items-center justify-center`}
              >
                {metric.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderMetrics;
