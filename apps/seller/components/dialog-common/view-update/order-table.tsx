'use client';

import type { Order } from '@/app/dashboard/orders-management/page';
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
import {
  CheckCircle,
  Edit,
  Eye,
  Package,
  Truck,
  Clock,
  XCircle,
  CheckCheck,
  RefreshCw,
} from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
  onViewDetail: (order: Order) => void;
  onUpdateStatus: (order: Order) => void;
}

export function OrderTable({ orders, onViewDetail, onUpdateStatus }: OrderTableProps) {
  const getStatusColor = (status: Order['orderStatus']) => {
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

  const getStatusText = (status: Order['orderStatus']) => {
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

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'pending':
        return 'Chờ thanh toán';
      case 'paid':
        return 'Đã thanh toán';
      case 'failed':
        return 'Thất bại';
      default:
        return 'Không xác định';
    }
  };

const getStatusIcon = (status: Order['orderStatus']) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'confirmed':
      return <CheckCheck className="h-4 w-4 text-blue-600" />;
    case 'preparing':
      return <Package className="h-4 w-4 text-purple-600" />;
    case 'ready_to_ship':
      return <RefreshCw className="h-4 w-4 text-orange-600" />;
    case 'shipped':
      return <Truck className="h-4 w-4 text-indigo-600" />;
    case 'delivered':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return null;
  }
};

  const canUpdateStatus = (status: Order['orderStatus']) => {
    return !['delivered', 'cancelled'].includes(status);
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
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{order.orderNumber}</div>
                    {order.trackingNumber && (
                      <div className="text-xs text-muted-foreground">
                        Mã vận đơn: {order.trackingNumber}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {order.items.length} sản phẩm
                    <div className="text-xs text-muted-foreground">
                      {order.items[0]?.productName}
                      {order.items.length > 1 && ` +${order.items.length - 1} khác`}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {order.finalAmount.toLocaleString('vi-VN')}đ
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
                <TableCell>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</TableCell>
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
