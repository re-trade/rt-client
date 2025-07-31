'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSellerOrders } from '@/hooks/use-seller-orders';
import { Package, ShoppingCart } from 'lucide-react';

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

export default function RecentOrdersWidget() {
  const { formattedOrders, isLoading } = useSellerOrders();

  const recentOrders = formattedOrders.slice(0, 5);

  // Format the date to show how long ago it was
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ngày trước`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} tháng trước`;
  };

  return (
    <Card className="bg-white shadow-lg border-0 overflow-hidden h-full">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Đơn hàng gần đây
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingIndicator />
        ) : recentOrders.length > 0 ? (
          <ScrollArea className="h-[350px]">
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">#{order.id.substring(0, 8)}</p>
                      <p className="text-sm text-gray-500">{order.receiverName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{order.formattedPrice}</p>
                    <Badge variant="outline" className="text-xs font-normal">
                      {getTimeAgo(order.createdDate)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="h-[350px] flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có đơn hàng nào</p>
            </div>
          </div>
        )}

        {recentOrders.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a
              href="/dashboard/orders"
              className="text-sm text-teal-600 hover:text-teal-800 font-medium flex items-center justify-center"
            >
              Xem tất cả đơn hàng
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
