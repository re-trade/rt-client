import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { OrderResponse } from '@/service/orders.api';
import { TProduct, productApi } from '@/service/product.api';
import { snipppetCode } from '@/service/snippetCode';
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  Banknote,
  Calendar,
  CheckCheck,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  Package,
  PackageCheck,
  PackageX,
  Phone,
  Receipt,
  RefreshCw,
  RotateCcw,
  ShoppingBag,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { ProductDetailsDialog } from '../view-update/view-detail-product';

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderResponse | null;
}

export function OrderDetailDialog({ open, onOpenChange, order }: OrderDetailDialogProps) {
  if (!order) return null;

  const getStatusConfig = (status: OrderResponse['orderStatus']) => {
    const configs = {
      PENDING: {
        color: 'bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100',
        icon: <Clock className="h-4 w-4" />,
        text: 'Chờ xác nhận',
        pulse: true,
      },
      PREPARING: {
        color: 'bg-violet-50 text-violet-700 border-violet-200 shadow-violet-100',
        icon: <Package className="h-4 w-4" />,
        text: 'Đang chuẩn bị',
        pulse: true,
      },
      DELIVERING: {
        color: 'bg-orange-50 text-orange-700 border-orange-200 shadow-orange-100',
        icon: <Truck className="h-4 w-4" />,
        text: 'Đang giao hàng',
        pulse: true,
      },
      DELIVERED: {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100',
        icon: <PackageCheck className="h-4 w-4" />,
        text: 'Đã giao hàng',
        pulse: false,
      },
      CANCELLED: {
        color: 'bg-red-50 text-red-700 border-red-200 shadow-red-100',
        icon: <Ban className="h-4 w-4" />,
        text: 'Đã hủy',
        pulse: false,
      },
      RETURNING: {
        color: 'bg-orange-50 text-orange-700 border-orange-200 shadow-orange-100',
        icon: <RefreshCw className="h-4 w-4" />,
        text: 'Đang hoàn trả',
        pulse: true,
      },
      REFUNDED: {
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-indigo-100',
        icon: <DollarSign className="h-4 w-4" />,
        text: 'Đã hoàn tiền',
        pulse: false,
      },
      RETURN_REJECTED: {
        color: 'bg-red-50 text-red-700 border-red-200 shadow-red-100',
        icon: <XCircle className="h-4 w-4" />,
        text: 'Từ chối hoàn trả',
        pulse: false,
      },
      RETURN_REQUESTED: {
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-yellow-100',
        icon: <RotateCcw className="h-4 w-4" />,
        text: 'Yêu cầu hoàn trả',
        pulse: true,
      },
      COMPLETED: {
        color: 'bg-green-50 text-green-700 border-green-200 shadow-green-100',
        icon: <CheckCircle className="h-4 w-4" />,
        text: 'Đã hoàn tất',
        pulse: false,
      },
      RETURNED: {
        color: 'bg-slate-50 text-slate-700 border-slate-200 shadow-slate-100',
        icon: <PackageX className="h-4 w-4" />,
        text: 'Đã trả hàng',
        pulse: false,
      },
      RETURN_APPROVED: {
        color: 'bg-teal-50 text-teal-700 border-teal-200 shadow-teal-100',
        icon: <CheckCheck className="h-4 w-4" />,
        text: 'Chấp nhận hoàn trả',
        pulse: false,
      },
      PAYMENT_CONFIRMATION: {
        color: 'bg-green-50 text-green-700 border-green-200 shadow-green-100',
        icon: <CreditCard className="h-4 w-4" />,
        text: 'Đã thanh toán',
        pulse: false,
      },
      PAYMENT_FAILED: {
        color: 'bg-red-50 text-red-700 border-red-200 shadow-red-100',
        icon: <AlertTriangle className="h-4 w-4" />,
        text: 'Thanh toán thất bại',
        pulse: false,
      },
      PAYMENT_CANCELLED: {
        color: 'bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100',
        icon: <XCircle className="h-4 w-4" />,
        text: 'Thanh toán đã huỷ',
        pulse: false,
      },
    };

    return (
      configs[status.code] || {
        color: 'bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100',
        icon: <AlertCircle className="h-4 w-4" />,
        text: 'Không xác định',
        pulse: false,
      }
    );
  };

  const getPaymentStatusConfig = (status: OrderResponse['paymentStatus']) => {
    const configs = {
      PENDING: {
        color: 'bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100',
        icon: <Clock className="h-4 w-4" />,
        text: 'Chờ thanh toán',
        pulse: true,
      },
      PAYMENT_CONFIRMATION: {
        color: 'bg-green-50 text-green-700 border-green-200 shadow-green-100',
        icon: <CheckCircle className="h-4 w-4" />,
        text: 'Đã thanh toán',
        pulse: false,
      },
      PAYMENT_FAILED: {
        color: 'bg-red-50 text-red-700 border-red-200 shadow-red-100',
        icon: <AlertTriangle className="h-4 w-4" />,
        text: 'Thất bại',
        pulse: false,
      },
      PAYMENT_CANCELLED: {
        color: 'bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100',
        icon: <XCircle className="h-4 w-4" />,
        text: 'Đã hủy thanh toán',
        pulse: false,
      },
    };

    return (
      configs[status] || {
        color: 'bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100',
        icon: <AlertCircle className="h-4 w-4" />,
        text: 'Không xác định',
        pulse: false,
      }
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCustomerInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const orderStatus = getStatusConfig(order.orderStatus);
  const paymentStatus = getPaymentStatusConfig(order.paymentStatus);
  const [productDetails, setProductDetails] = useState<TProduct | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleDetailsProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      const response = await productApi.getProduct(productId);
      console.log('ahahhhaa', response);
      setProductDetails(response as TProduct);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Chi tiết đơn hàng
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Mã đơn hàng:{' '}
                  <span className="font-mono font-medium">
                    {snipppetCode.cutCode(order.comboId)}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 shadow-sm',
                  orderStatus.color,
                  orderStatus.pulse && 'animate-pulse',
                )}
              >
                {orderStatus.icon}
                <span className="text-sm font-medium">{orderStatus.text}</span>
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Order Information */}
          <Card className="shadow-sm border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Receipt className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Thông tin đơn hàng
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Tag className="h-4 w-4" />
                  <span>Mã đơn hàng:</span>
                </div>
                <span className="font-mono font-medium bg-gray-100 px-2 py-1 rounded text-sm">
                  {snipppetCode.cutCode(order.comboId)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="h-4 w-4" />
                  <span>Trạng thái:</span>
                </div>
                <Badge
                  className={cn(
                    'flex items-center gap-1.5 shadow-sm',
                    orderStatus.color,
                    orderStatus.pulse && 'animate-pulse',
                  )}
                >
                  {orderStatus.icon}
                  <span className="text-xs font-medium">{orderStatus.text}</span>
                </Badge>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Ngày tạo:</span>
                </div>
                <span className="text-sm font-medium">{formatDate(order.createDate)}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Banknote className="h-4 w-4" />
                  <span>Thanh toán:</span>
                </div>
                <Badge
                  className={cn(
                    'flex items-center gap-1.5 shadow-sm',
                    paymentStatus.color,
                    paymentStatus.pulse && 'animate-pulse',
                  )}
                >
                  {paymentStatus.icon}
                  <span className="text-xs font-medium">{paymentStatus.text}</span>
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="shadow-sm border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Thông tin khách hàng
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center gap-4 py-2">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {getCustomerInitials(order.destination.customerName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">
                    {order.destination.customerName}
                  </div>
                  <div className="text-sm text-gray-500">Khách hàng</div>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="font-medium">{order.destination.phone}</span>
              </div>

              <div className="flex items-start gap-3 py-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-gray-600">Địa chỉ:</span>
                  <p className="font-medium text-sm mt-1 leading-relaxed">
                    {order.destination.ward}, {order.destination.state},{' '}
                    {order.destination.district}, {order.destination.country}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="shadow-sm border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Sản phẩm đặt hàng
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ShoppingCart className="h-4 w-4" />
                <span>{order.items.length} sản phẩm</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={item.productId}
                  onClick={() => handleDetailsProduct(item.productId)}
                  className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="relative">
                    <Image
                      src={item.itemThumbnail || '/placeholder.svg'}
                      alt={item.itemName}
                      width={64}
                      height={64}
                      className="rounded-lg object-cover border border-gray-200"
                    />
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{item.itemName}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        Số lượng: <span className="font-medium">{item.quantity}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Đơn giá:{' '}
                        <span className="font-medium">{formatCurrency(item.basePrice)}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(item.quantity * item.basePrice)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.quantity} × {formatCurrency(item.basePrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="shadow-sm border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Thông tin thanh toán
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Trạng thái thanh toán:</span>
                <Badge
                  className={cn(
                    'flex items-center gap-1.5 shadow-sm',
                    paymentStatus.color,
                    paymentStatus.pulse && 'animate-pulse',
                  )}
                >
                  {paymentStatus.icon}
                  <span className="text-xs font-medium">{paymentStatus.text}</span>
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span className="font-medium">{formatCurrency(order.grandPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold text-gray-900 bg-gray-50 p-3 rounded-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">{formatCurrency(order.grandPrice)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>

      <ProductDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        product={productDetails}
      />
    </Dialog>
  );
}
