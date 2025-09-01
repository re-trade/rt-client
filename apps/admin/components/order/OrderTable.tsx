'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TOrderCombo } from '@/services/order.api';
import { Calendar, CreditCard, Package, ShoppingCart, Store, Truck, User } from 'lucide-react';
import Image from 'next/image';

interface OrderTableProps {
  orderCombos: TOrderCombo[];
  loading: boolean;
  onRowClick: (combo: TOrderCombo) => void;
  searchQuery: string;
}

export default function OrderTable({
  orderCombos,
  loading,
  onRowClick,
  searchQuery,
}: OrderTableProps) {
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
    PAYMENT_CONFIRMATION: {
      label: 'Đã thanh toán',
      color: 'bg-green-100 text-green-800 border-green-300',
    },
    UNPAID: { label: 'Chưa thanh toán', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    PAYMENT_FAILED: { label: 'Thất bại', color: 'bg-red-100 text-red-800 border-red-300' },
    PAYMENT_CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-300' },
    DEFAULT: { label: 'Khác', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (orderStatus: TOrderCombo['orderStatus']) => {
    if (!orderStatus?.code) {
      return (
        <Badge variant="outline" className={orderStatusConfig.DEFAULT.color}>
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
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!orderCombos || orderCombos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-gray-700 font-medium mb-2">Không có đơn hàng</h3>
        <p className="text-gray-500">
          {searchQuery ? 'Không tìm thấy đơn hàng phù hợp' : 'Chưa có đơn hàng nào trong hệ thống'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="font-semibold text-slate-700">Đơn hàng</TableHead>
            <TableHead className="font-semibold text-slate-700">Người bán</TableHead>
            <TableHead className="font-semibold text-slate-700">Khách hàng</TableHead>
            <TableHead className="font-semibold text-slate-700">Sản phẩm</TableHead>
            <TableHead className="font-semibold text-slate-700">Tổng tiền</TableHead>
            <TableHead className="font-semibold text-slate-700">Trạng thái</TableHead>
            <TableHead className="font-semibold text-slate-700">Thanh toán</TableHead>
            <TableHead className="font-semibold text-slate-700">Ngày tạo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderCombos.map((combo) => (
            <TableRow
              key={combo.comboId}
              className="hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => onRowClick(combo)}
            >
              <TableCell className="font-medium">
                <div>
                  <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded border inline-block">
                    {combo.comboId.slice(0, 8)}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  {combo.sellerAvatarUrl ? (
                    <Image
                      src={combo.sellerAvatarUrl}
                      alt={combo.sellerName}
                      width={32}
                      height={32}
                      className="rounded-full border object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-avatar.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Store className="h-4 w-4 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">{combo.sellerName}</p>
                    <p className="text-xs text-gray-500">ID: {combo.sellerId}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">{combo.destination.customerName}</p>
                    <p className="text-xs text-gray-500">{combo.destination.phone}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{combo.items.length} sản phẩm</span>
                </div>
              </TableCell>

              <TableCell>
                <p className="font-bold text-orange-600">
                  {combo.grandPrice.toLocaleString('vi-VN')}đ
                </p>
              </TableCell>

              <TableCell>{getStatusBadge(combo.orderStatus)}</TableCell>

              <TableCell>{getPaymentStatusBadge(combo.paymentStatus)}</TableCell>

              <TableCell>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {formatDate(combo.createDate)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
