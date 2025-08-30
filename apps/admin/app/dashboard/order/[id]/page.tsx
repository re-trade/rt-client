'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrderCombo } from '@/hooks/use-order-manager';
import { TOrderCombo } from '@/services/order.api';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShoppingCart,
  Store,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const comboId = params.id as string;

  const { orderCombo, loading, error, refetch } = useOrderCombo(comboId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const orderStatusConfig = {
    PENDING: { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    PAYMENT_CONFIRMATION: {
      label: 'Xác nhận thanh toán',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    PREPARING: { label: 'Đang xử lý', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    DELIVERING: { label: 'Đang giao', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    DELIVERED: { label: 'Đã giao', color: 'bg-green-100 text-green-800 border-green-300' },
    RETRIEVED: { label: 'Đã lấy hàng', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    COMPLETED: { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-300' },
    RETURN_REQUESTED: {
      label: 'Đổi/Trả hàng',
      color: 'bg-orange-100 text-orange-800 border-orange-300',
    },
    RETURNED: { label: 'Đã trả hàng', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    PAYMENT_CANCELLED: { label: 'Hủy thanh toán', color: 'bg-red-100 text-red-800 border-red-300' },
    PAYMENT_FAILED: {
      label: 'Thanh toán thất bại',
      color: 'bg-red-100 text-red-800 border-red-300',
    },
    REFUNDED: { label: 'Đã hoàn tiền', color: 'bg-green-100 text-green-800 border-green-300' },
    DEFAULT: { label: 'Khác', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  };

  const paymentStatusConfig = {
    PAID: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800 border-green-300' },
    PENDING: { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    FAILED: { label: 'Thất bại', color: 'bg-red-100 text-red-800 border-red-300' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-300' },
    REFUNDED: { label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-800 border-gray-300' },
    PROCESSING: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    DEFAULT: { label: 'Khác', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  };

  const getStatusBadge = (orderStatus: TOrderCombo['orderStatus']) => {
    if (!orderStatus?.code) {
      return (
        <Badge variant="outline" className={orderStatusConfig.DEFAULT.color}>
          <Truck className="h-3 w-3 mr-1" />
          {orderStatusConfig.DEFAULT.label}
        </Badge>
      );
    }

    const statusCode = orderStatus.code.toUpperCase();
    const config =
      orderStatusConfig[statusCode as keyof typeof orderStatusConfig] || orderStatusConfig.DEFAULT;

    return (
      <Badge variant="outline" className={config.color}>
        <Truck className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    if (!paymentStatus) {
      return (
        <Badge variant="outline" className={paymentStatusConfig.DEFAULT.color}>
          <CreditCard className="h-3 w-3 mr-1" />
          {paymentStatusConfig.DEFAULT.label}
        </Badge>
      );
    }

    const statusKey = paymentStatus.toUpperCase();
    const config =
      paymentStatusConfig[statusKey as keyof typeof paymentStatusConfig] ||
      paymentStatusConfig.DEFAULT;

    return (
      <Badge variant="outline" className={config.color}>
        <CreditCard className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-20 w-20 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-3 w-20 mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-gray-700 font-medium mb-2">Lỗi tải đơn hàng</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push('/dashboard/order')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <Button onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!orderCombo) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-gray-700 font-medium mb-2">Không tìm thấy đơn hàng</h3>
          <p className="text-gray-500 mb-4">Đơn hàng không tồn tại hoặc đã bị xóa</p>
          <Button onClick={() => router.push('/dashboard/order')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors"
              onClick={() => router.push('/dashboard/order')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border border-orange-200/50 shadow-sm">
              <ShoppingCart className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                  Chi tiết đơn hàng
                </h1>
                {orderCombo.orderStatus && getStatusBadge(orderCombo.orderStatus)}
                {orderCombo.paymentStatus && getPaymentStatusBadge(orderCombo.paymentStatus)}
              </div>
              <p className="text-gray-600">
                ID:{' '}
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded border">
                  {orderCombo.comboId}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={refetch} size="lg" className="shadow-sm">
              <RefreshCw className="h-5 w-5 mr-2" />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-slate-200/50 bg-slate-50/50">
              <CardTitle className="flex items-center text-lg text-slate-900">
                <Package className="h-5 w-5 mr-2 text-purple-500" />
                Sản phẩm trong đơn hàng ({orderCombo.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
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

              <Separator className="my-6" />

              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-slate-700">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {orderCombo.grandPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-slate-200/50 bg-slate-50/50">
              <CardTitle className="flex items-center text-lg text-slate-900">
                <MapPin className="h-5 w-5 mr-2 text-green-500" />
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {orderCombo.destination.customerName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {orderCombo.destination.phone}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-gray-700">
                    {orderCombo.destination.addressLine}
                    {orderCombo.destination.ward && `, ${orderCombo.destination.ward}`}
                    {orderCombo.destination.district && `, ${orderCombo.destination.district}`}
                    {orderCombo.destination.state && `, ${orderCombo.destination.state}`}
                    {orderCombo.destination.country && `, ${orderCombo.destination.country}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-slate-200/50 bg-slate-50/50">
              <CardTitle className="flex items-center text-lg text-slate-900">
                <ShoppingCart className="h-5 w-5 mr-2 text-orange-500" />
                Thông tin đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-gray-500 mb-1">ID Combo</dt>
                  <dd className="font-mono bg-gray-50 p-2 rounded border break-all">
                    {orderCombo.comboId}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500 mb-1">Trạng thái đơn hàng</dt>
                  <dd>{orderCombo.orderStatus ? getStatusBadge(orderCombo.orderStatus) : 'N/A'}</dd>
                </div>

                <div>
                  <dt className="text-gray-500 mb-1">Trạng thái thanh toán</dt>
                  <dd>
                    {orderCombo.paymentStatus
                      ? getPaymentStatusBadge(orderCombo.paymentStatus)
                      : 'N/A'}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500 mb-1">Tổng tiền</dt>
                  <dd className="text-xl font-bold text-orange-600">
                    {orderCombo.grandPrice.toLocaleString('vi-VN')}đ
                  </dd>
                </div>

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
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-slate-200/50 bg-slate-50/50">
              <CardTitle className="flex items-center text-lg text-slate-900">
                <Store className="h-5 w-5 mr-2 text-blue-500" />
                Thông tin người bán
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {orderCombo.sellerAvatarUrl ? (
                    <Image
                      src={orderCombo.sellerAvatarUrl}
                      alt={orderCombo.sellerName}
                      width={50}
                      height={50}
                      className="rounded-full border object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-avatar.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] bg-gray-200 rounded-full flex items-center justify-center">
                      <Store className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{orderCombo.sellerName}</p>
                    <p className="text-sm text-gray-500">ID: {orderCombo.sellerId}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
