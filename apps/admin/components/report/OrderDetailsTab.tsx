'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { TOrderCombo } from '@/services/order.api';
import {
  Calendar,
  CreditCard,
  MapPin,
  Package,
  RefreshCw,
  ShoppingCart,
  Store,
  Truck,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';

interface OrderDetailsTabProps {
  orderCombo: TOrderCombo | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  formatDate: (dateString?: string) => string;
}

export default function OrderDetailsTab({
  orderCombo,
  loading,
  error,
  onRefresh,
  formatDate,
}: OrderDetailsTabProps) {
  if (loading) {
    return (
      <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-slate-200/50 bg-slate-50/50">
          <CardTitle className="flex items-center text-lg text-slate-900">
            <ShoppingCart className="h-5 w-5 mr-2 text-blue-500" />
            Thông tin đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-10 w-10 animate-spin text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Đang tải thông tin đơn hàng...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-slate-200/50 bg-slate-50/50">
          <CardTitle className="flex items-center text-lg text-slate-900">
            <ShoppingCart className="h-5 w-5 mr-2 text-blue-500" />
            Thông tin đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-gray-700 font-medium mb-2">Lỗi tải đơn hàng</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!orderCombo) {
    return (
      <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-slate-200/50 bg-slate-50/50">
          <CardTitle className="flex items-center text-lg text-slate-900">
            <ShoppingCart className="h-5 w-5 mr-2 text-blue-500" />
            Thông tin đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-gray-700 font-medium mb-2">Không có thông tin đơn hàng</h3>
            <p className="text-gray-500">Không tìm thấy thông tin đơn hàng cho báo cáo này</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b border-slate-200/50 bg-slate-50/50">
        <CardTitle className="flex items-center text-lg text-slate-900">
          <ShoppingCart className="h-5 w-5 mr-2 text-blue-500" />
          Thông tin đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Thông tin cơ bản</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500 mb-1">ID Combo</dt>
                    <dd className="font-mono bg-gray-50 p-2 rounded border break-all">
                      {orderCombo.comboId}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 mb-1">Trạng thái đơn hàng</dt>
                    <dd>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Truck className="h-3 w-3 mr-1" />
                        {orderCombo.orderStatus}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 mb-1">Trạng thái thanh toán</dt>
                    <dd>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        {orderCombo.paymentStatus}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 mb-1">Tổng tiền</dt>
                    <dd className="text-xl font-bold text-orange-600">
                      {orderCombo.grandPrice.toLocaleString('vi-VN')}đ
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Thông tin người bán</h3>
                <div className="flex items-center gap-3 mb-3">
                  {orderCombo.sellerAvatarUrl ? (
                    <Image
                      src={orderCombo.sellerAvatarUrl}
                      alt={orderCombo.sellerName}
                      width={40}
                      height={40}
                      className="rounded-full border object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-avatar.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-[40px] h-[40px] bg-gray-200 rounded-full flex items-center justify-center">
                      <Store className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{orderCombo.sellerName}</p>
                    <p className="text-sm text-gray-500">ID: {orderCombo.sellerId}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Thời gian</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500 mb-1">Ngày tạo</dt>
                    <dd className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {formatDate(orderCombo.createDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 mb-1">Cập nhật cuối</dt>
                    <dd className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {formatDate(orderCombo.updateDate)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium text-gray-700 mb-3 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-500" />
              Địa chỉ giao hàng
            </h3>
            <div className="bg-gray-50 p-4 rounded-md border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">{orderCombo.destination.customerName}</p>
                  <p className="text-sm text-gray-600">{orderCombo.destination.phone}</p>
                </div>
                <div>
                  <p className="text-sm">
                    {orderCombo.destination.addressLine}
                    {orderCombo.destination.ward && `, ${orderCombo.destination.ward}`}
                    {orderCombo.destination.district && `, ${orderCombo.destination.district}`}
                    {orderCombo.destination.state && `, ${orderCombo.destination.state}`}
                    {orderCombo.destination.country && `, ${orderCombo.destination.country}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium text-gray-700 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-purple-500" />
              Sản phẩm trong đơn hàng ({orderCombo.items.length})
            </h3>
            <div className="space-y-4">
              {orderCombo.items.map((item, index) => (
                <div
                  key={item.itemId || index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {item.itemThumbnail ? (
                        <Image
                          src={item.itemThumbnail}
                          alt={item.itemName}
                          width={80}
                          height={80}
                          className="rounded-md border object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-product.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-[80px] h-[80px] bg-gray-200 rounded-md flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{item.itemName}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">ID Sản phẩm</p>
                          <p className="font-mono text-xs bg-gray-100 p-1 rounded break-all">
                            {item.productId}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Số lượng</p>
                          <p className="font-medium">{item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Đơn giá</p>
                          <p className="font-medium text-orange-600">
                            {item.basePrice.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Thành tiền</p>
                          <p className="font-bold text-orange-600">
                            {(item.basePrice * item.quantity).toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
