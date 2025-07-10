'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OrderResponse } from '@/service/orders.api';
import {
  CheckCheck,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from 'lucide-react';

interface OrderTableProps {
  orders: OrderResponse[];
  onViewDetail: (order: OrderResponse) => void;
  onUpdateStatus: (order: OrderResponse) => void;
}

export function OrderTable({ orders, onViewDetail, onUpdateStatus }: OrderTableProps) {
  const getStatusColor = (status: OrderResponse['orderStatus']) => {
    switch (status.code) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PREPARING':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERING':
        return 'bg-orange-100 text-orange-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'RETURNING':
        return 'bg-orange-100 text-orange-800';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800';
      case 'RETURN_REJECTED':
        return 'bg-red-100 text-red-800';
      case 'RETURN_REQUESTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'RETURNED':
        return 'bg-gray-100 text-gray-800';
      case 'RETURN_APPROVED':
        return 'bg-blue-100 text-blue-800';
      // Các trạng thái thanh toán được xử lý như "Chưa xác nhận"
      case 'PAYMENT_CONFIRMATION':
      case 'PAYMENT_FAILED':
      case 'PAYMENT_CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: OrderResponse['orderStatus']) => {
    switch (status.code) {
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'PREPARING':
        return 'Đang chuẩn bị';
      case 'DELIVERING':
        return 'Đang giao hàng';
      case 'DELIVERED':
        return 'Đã giao hàng';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'RETURNING':
        return 'Đang hoàn trả';
      case 'REFUNDED':
        return 'Đã hoàn tiền';
      case 'RETURN_REJECTED':
        return 'Từ chối hoàn trả';
      case 'RETURN_REQUESTED':
        return 'Yêu cầu hoàn trả';
      case 'COMPLETED':
        return 'Đã hoàn tất';
      case 'RETURNED':
        return 'Đã trả hàng';
      case 'RETURN_APPROVED':
        return 'Chấp nhận hoàn trả';
      // Các trạng thái thanh toán được xử lý như "Chưa xác nhận"
      case 'PAYMENT_CONFIRMATION':
      case 'PAYMENT_FAILED':
      case 'PAYMENT_CANCELLED':
        return 'Chưa xác nhận';
      default:
        return 'Không xác định';
    }
  };

  const getPaymentStatusColor = (status: OrderResponse['paymentStatus']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAYMENT_CONFIRMATION':
        return 'bg-green-100 text-green-800';
      case 'PAYMENT_CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PAYMENT_FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: OrderResponse['paymentStatus']) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ thanh toán';
      case 'PAYMENT_CONFIRMATION':
        return 'Xác nhận thanh toán';
      case 'PAYMENT_FAILED':
        return 'Thất bại';
      case 'PAYMENT_CANCELLED':
        return 'Đã hủy thanh toán';
      default:
        return 'Không xác định';
    }
  };

  const getStatusIcon = (status: OrderResponse['orderStatus']) => {
    switch (status.code) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'CONFIRMED':
        return <CheckCheck className="h-4 w-4 text-blue-600" />;
      case 'PREPARING':
        return <Package className="h-4 w-4 text-purple-600" />;
      case 'DELIVERING':
        return <Truck className="h-4 w-4 text-orange-600" />;
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'RETURNING':
        return <RefreshCw className="h-4 w-4 text-orange-600" />;
      case 'REFUNDED':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'RETURN_REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'RETURN_REQUESTED':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'RETURNED':
        return <Package className="h-4 w-4 text-gray-600" />;
      case 'RETURN_APPROVED':
        return <CheckCheck className="h-4 w-4 text-blue-600" />;
      // Các trạng thái thanh toán được xử lý như "Chưa xác nhận"
      case 'PAYMENT_CONFIRMATION':
      case 'PAYMENT_FAILED':
      case 'PAYMENT_CANCELLED':
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const canUpdateStatus = (status: OrderResponse['orderStatus']) => {
    return !['DELIVERED', 'CANCELLED', 'COMPLETED', 'RETURNED', 'REFUNDED'].includes(status.code);
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.comboId}>
                <TableCell className="font-medium">
                  <div>
                    <div>{order.comboId}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.destination.customerName}</div>
                    <div className="text-sm text-muted-foreground">{order.destination.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {order.items.length} sản phẩm
                    <div className="text-xs text-muted-foreground">
                      {order.items[0]?.productName || 'Không có tên sản phẩm'}
                      {order.items.length > 1 && ` +${order.items.length - 1} khác`}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {order.grandPrice.toLocaleString('vi-VN')}đ
                </TableCell>
                <TableCell>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {getPaymentStatusText(order.paymentStatus)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.orderStatus)}
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {getStatusText(order.orderStatus)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{new Date(order.createDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onViewDetail(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canUpdateStatus(order.orderStatus) && (
                      <Button variant="outline" size="sm" onClick={() => onUpdateStatus(order)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
