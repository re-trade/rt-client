import { OrderResponse, ordersApi } from '@/service/orders.api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderResponse | null;
}

export function OrderDetailDialog({ open, onOpenChange, order }: OrderDetailDialogProps) {
  if (!order) return null;

  const getStatusColor = (status: OrderResponse['orderStatus']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready_to_ship':
        return 'bg-orange-100 text-orange-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: OrderResponse['orderStatus']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'preparing':
        return 'Đang chuẩn bị';
      case 'ready_to_ship':
        return 'Sẵn sàng giao';
      case 'shipped':
        return 'Đã giao shipper';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng {order.comboId}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã đơn hàng:</span>
                <span className="font-medium">{order.comboId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái:</span>
                <Badge className={getStatusColor(order.orderStatus)}>
                  {getStatusText(order.orderStatus)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày tạo:</span>
                <span>{new Date(order.createDate).toLocaleString('vi-VN')}</span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-muted-foreground">Cập nhật lần cuối:</span>
                <span>{new Date(order.updatedAt).toLocaleString('vi-VN')}</span>
              </div> */}
              {/* {order.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã vận đơn:</span>
                  <span className="font-medium">{order.trackingNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phương thức vận chuyển:</span>
                <span>{order.shippingMethod}</span>
              </div>
              {order.notes && (
                <div>
                  <span className="text-muted-foreground">Ghi chú:</span>
                  <p className="mt-1 text-sm">{order.notes}</p>
                </div>
              )} */}
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Họ tên:</span>
                <span className="font-medium">{order.destination.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số điện thoại:</span>
                <span>{order.destination.phone}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Địa chỉ giao hàng:</span>
                <p className="mt-1 text-sm">{order.destination.ward}, {order.destination.state}, {order.destination.district}, {order.destination.country}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sản phẩm đặt hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Image
                    src={item.itemThumbnail || '/placeholder.svg'}
                    alt={item.itemName}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.itemName}</h4>
                    <p className="text-sm text-muted-foreground">
                      Số lượng: {item.quantity} × {item.basePrice.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {(item.quantity * item.basePrice).toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông tin thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phương thức thanh toán:</span>
              {/* <span>{getPaymentMethodText(order.paymentMethod)}</span> */}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trạng thái thanh toán:</span>
              <Badge
                className={
                  order.orderStatus === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }
              >
                {order.orderStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{order.grandPrice.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                {/* <span>{order.shippingFee.toLocaleString('vi-VN')}đ</span> */}
              </div>
              {/* {order.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Giảm giá:</span>
                  <span>-{order.discount.toLocaleString('vi-VN')}đ</span>
                </div>
              )} */}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng:</span>
                <span>{order.grandPrice.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
