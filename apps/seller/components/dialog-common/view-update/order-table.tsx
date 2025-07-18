'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { OrderResponse } from '@/service/orders.api';
import { snipppetCode } from '@/service/snippetCode';
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  Calendar,
  CheckCheck,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Edit,
  Eye,
  MoreHorizontal,
  Package,
  PackageCheck,
  PackageX,
  RefreshCw,
  RotateCcw,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface OrderTableProps {
  orders: OrderResponse[];
  onViewDetail: (order: OrderResponse) => void;
  onUpdateStatus: (order: OrderResponse) => void;
}

export function OrderTable({ orders, onViewDetail, onUpdateStatus }: OrderTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const getStatusConfig = (status: OrderResponse['orderStatus']) => {
    const configs = {
      PENDING: {
        color: 'bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100',
        icon: <Clock className="h-3.5 w-3.5" />,
        text: 'Chờ xác nhận',
        pulse: true,
      },
      PREPARING: {
        color: 'bg-violet-50 text-violet-700 border-violet-200 shadow-violet-100',
        icon: <Package className="h-3.5 w-3.5" />,
        text: 'Đang chuẩn bị',
        pulse: true,
      },
      DELIVERING: {
        color: 'bg-orange-50 text-orange-700 border-orange-200 shadow-orange-100',
        icon: <Truck className="h-3.5 w-3.5" />,
        text: 'Đang giao hàng',
        pulse: true,
      },
      DELIVERED: {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100',
        icon: <PackageCheck className="h-3.5 w-3.5" />,
        text: 'Đã giao hàng',
        pulse: false,
      },
      CANCELLED: {
        color: 'bg-red-50 text-red-700 border-red-200 shadow-red-100',
        icon: <Ban className="h-3.5 w-3.5" />,
        text: 'Đã hủy',
        pulse: false,
      },
      RETURNING: {
        color: 'bg-orange-50 text-orange-700 border-orange-200 shadow-orange-100',
        icon: <RefreshCw className="h-3.5 w-3.5" />,
        text: 'Đang hoàn trả',
        pulse: true,
      },
      REFUNDED: {
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-indigo-100',
        icon: <DollarSign className="h-3.5 w-3.5" />,
        text: 'Đã hoàn tiền',
        pulse: false,
      },
      RETURN_REJECTED: {
        color: 'bg-red-50 text-red-700 border-red-200 shadow-red-100',
        icon: <XCircle className="h-3.5 w-3.5" />,
        text: 'Từ chối hoàn trả',
        pulse: false,
      },
      RETURN_REQUESTED: {
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-yellow-100',
        icon: <RotateCcw className="h-3.5 w-3.5" />,
        text: 'Yêu cầu hoàn trả',
        pulse: true,
      },
      COMPLETED: {
        color: 'bg-green-50 text-green-700 border-green-200 shadow-green-100',
        icon: <CheckCircle className="h-3.5 w-3.5" />,
        text: 'Đã hoàn tất',
        pulse: false,
      },
      RETURNED: {
        color: 'bg-slate-50 text-slate-700 border-slate-200 shadow-slate-100',
        icon: <PackageX className="h-3.5 w-3.5" />,
        text: 'Đã trả hàng',
        pulse: false,
      },
      RETURN_APPROVED: {
        color: 'bg-teal-50 text-teal-700 border-teal-200 shadow-teal-100',
        icon: <CheckCheck className="h-3.5 w-3.5" />,
        text: 'Chấp nhận hoàn trả',
        pulse: false,
      },
      PAYMENT_CONFIRMATION: {
        color: 'bg-green-50 text-green-700 border-green-200 shadow-green-100',
        icon: <CreditCard className="h-3.5 w-3.5" />,
        text: 'Đã thanh toán',
        pulse: false,
      },
      PAYMENT_FAILED: {
        color: 'bg-red-50 text-red-700 border-red-200 shadow-red-100',
        icon: <AlertTriangle className="h-3.5 w-3.5" />,
        text: 'Thanh toán thất bại',
        pulse: false,
      },
      PAYMENT_CANCELLED: {
        color: 'bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100',
        icon: <XCircle className="h-3.5 w-3.5" />,
        text: 'Thanh toán đã huỷ',
        pulse: false,
      },
    };

    return (
      configs[status.code] || {
        color: 'bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100',
        icon: <AlertCircle className="h-3.5 w-3.5" />,
        text: 'Không xác định',
        pulse: false,
      }
    );
  };

  const getPaymentStatusConfig = (status: OrderResponse['paymentStatus']) => {
    const configs = {
      PENDING: {
        color: 'bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100',
        icon: <Clock className="h-3.5 w-3.5" />,
        text: 'Chờ thanh toán',
        pulse: true,
      },
      PAYMENT_CONFIRMATION: {
        color: 'bg-green-50 text-green-700 border-green-200 shadow-green-100',
        icon: <CheckCircle className="h-3.5 w-3.5" />,
        text: 'Đã thanh toán',
        pulse: false,
      },
      PAYMENT_FAILED: {
        color: 'bg-red-50 text-red-700 border-red-200 shadow-red-100',
        icon: <AlertTriangle className="h-3.5 w-3.5" />,
        text: 'Thất bại',
        pulse: false,
      },
      PAYMENT_CANCELLED: {
        color: 'bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100',
        icon: <XCircle className="h-3.5 w-3.5" />,
        text: 'Đã hủy thanh toán',
        pulse: false,
      },
    };

    return (
      configs[status] || {
        color: 'bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100',
        icon: <AlertCircle className="h-3.5 w-3.5" />,
        text: 'Không xác định',
        pulse: false,
      }
    );
  };

  const canUpdateStatus = (status: OrderResponse['orderStatus']) => {
    return !['DELIVERED', 'CANCELLED', 'COMPLETED', 'RETURNED', 'REFUNDED'].includes(status.code);
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

  if (orders.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-muted-foreground">
            Đơn hàng sẽ hiển thị tại đây khi có khách hàng đặt hàng
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0 bg-white/60 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="font-semibold text-gray-700 py-4">Mã đơn hàng</TableHead>
                <TableHead className="font-semibold text-gray-700">Khách hàng</TableHead>
                <TableHead className="font-semibold text-gray-700">Sản phẩm</TableHead>
                <TableHead className="font-semibold text-gray-700">Tổng tiền</TableHead>
                <TableHead className="font-semibold text-gray-700">Thanh toán</TableHead>
                <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                <TableHead className="font-semibold text-gray-700">Ngày tạo</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => {
                const orderStatus = getStatusConfig(order.orderStatus);
                const paymentStatus = getPaymentStatusConfig(order.paymentStatus);

                return (
                  <TableRow
                    key={order.comboId}
                    className="hover:bg-gray-50/50 transition-colors duration-200 border-gray-100"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-mono text-sm font-medium">
                            {snipppetCode.cutCode(order.comboId)}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                          <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {getCustomerInitials(order.destination.customerName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.destination.customerName}
                          </div>
                          <div className="text-sm text-gray-500">{order.destination.phone}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{order.items.length} sản phẩm</span>
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-2">
                          {order.items[0]?.productName || 'Không có tên sản phẩm'}
                          {order.items.length > 1 && (
                            <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                              +{order.items.length - 1} khác
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.grandPrice)}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge
                        className={cn(
                          'flex items-center gap-1.5 w-fit shadow-sm',
                          paymentStatus.color,
                          paymentStatus.pulse && 'animate-pulse',
                        )}
                      >
                        {paymentStatus.icon}
                        <span className="text-xs font-medium">{paymentStatus.text}</span>
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge
                        className={cn(
                          'flex items-center gap-1.5 w-fit shadow-sm',
                          orderStatus.color,
                          orderStatus.pulse && 'animate-pulse',
                        )}
                      >
                        {orderStatus.icon}
                        <span className="text-xs font-medium">{orderStatus.text}</span>
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(order.createDate)}
                      </div>
                    </TableCell>

                    <TableCell className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={() => onViewDetail(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            {canUpdateStatus(order.orderStatus) && (
                              <DropdownMenuItem onClick={() => onUpdateStatus(order)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Cập nhật
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
