'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSellerOrderCount } from '@/hooks/use-seller-order-count';
import { Filter, PieChart } from 'lucide-react';
import { useState } from 'react';
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from 'recharts';
import CustomTooltip from './CustomToolTip';

const LoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center h-60">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 absolute top-0 left-0"
          style={{ animationDirection: 'reverse', opacity: 0.7, animationDuration: '1.5s' }}
        ></div>
      </div>
      <span className="ml-3 text-gray-600 font-medium">Đang tải dữ liệu...</span>
    </div>
  );
};

export default function OrderStatusChart() {
  const { formattedOrderCounts, totalOrders, isLoading, orderStatusConfig } = useSellerOrderCount();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="bg-white shadow-lg border-0 overflow-hidden h-full">
      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-full lg:w-1/2">
              {formattedOrderCounts.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Pie
                      data={formattedOrderCounts}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="label"
                      strokeWidth={1}
                    >
                      {formattedOrderCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={CustomTooltip} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center">
                  <p className="text-gray-500">Không có dữ liệu đơn hàng</p>
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/2 space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg mb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Tổng đơn hàng</p>
                    <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Filter className="h-3 w-3" />
                    {showDetails ? 'Thu gọn' : 'Chi tiết'}
                  </Button>
                </div>
              </div>

              {formattedOrderCounts.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-gray-700">{item.count}</span>
                      {totalOrders > 0 && (
                        <span className="text-xs text-gray-500">
                          ({Math.round((item.count / totalOrders) * 100)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Show detailed statuses when expanded */}
                  {showDetails && item.statuses && (
                    <div className="ml-6 mt-1 mb-2 space-y-1">
                      {item.statuses.map((status: any, statusIdx: number) => (
                        <div
                          key={statusIdx}
                          className="flex items-center justify-between px-2 py-1 text-xs border-l-2 ml-1"
                          style={{ borderColor: status.color }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-600">{status.label}</span>
                          </div>
                          <span className="text-gray-700 font-medium">{status.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
