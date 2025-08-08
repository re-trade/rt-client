'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CreateOrderHistory, orderHistoryApi } from '@/service/orderHistory.api';
import { OrderResponse } from '@/service/orders.api';
import { OrderStatusResponse, orderStatusApi } from '@/service/orderStatus.api';
import { snipppetCode } from '@/service/snippetCode';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Ban,
  Calendar,
  CheckCheck,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Info,
  Package,
  PackageCheck,
  PackageX,
  RefreshCw,
  RotateCcw,
  Save,
  Truck,
  TruckIcon,
  User,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderResponse | null;
  onUpdateStatus: (
    orderId: string,
    newStatus: OrderResponse['orderStatus'],
    trackingNumber?: string,
    notes?: string,
  ) => void;
}

export function UpdateStatusDialog({
  open,
  onOpenChange,
  order,
  onUpdateStatus,
}: UpdateStatusDialogProps) {
  const [newStatus, setNewStatus] = useState<OrderResponse['orderStatus']>('PENDING');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [orderStatuses, setOrderStatuses] = useState<OrderStatusResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataUpdtaeStatus, setDataupdateStatus] = useState<CreateOrderHistory>();

  useEffect(() => {
    if (order) {
      setNewStatus(order.orderStatus);
      setTrackingNumber('');
      setNotes('');
    }
  }, [order]);

  useEffect(() => {
    const fetchNextStatus = async () => {
      if (!order) return;
      setIsLoading(true);
      try {
        const response = await orderStatusApi.getNextStepOrderStaus(order.comboId);
        setOrderStatuses(response);
      } catch (error) {
        console.error('Failed to fetch next statuses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNextStatus();
  }, [order]);

  if (!order) return null;

  const getStatusConfig = (status: OrderResponse['orderStatus']) => {
    const configs = {
      PENDING: {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <Clock className="h-4 w-4" />,
        text: 'Chờ xử lý',
        bgColor: 'bg-amber-500',
      },
      PREPARING: {
        color: 'bg-violet-50 text-violet-700 border-violet-200',
        icon: <Package className="h-4 w-4" />,
        text: 'Đang chuẩn bị',
        bgColor: 'bg-violet-500',
      },
      DELIVERING: {
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: <Truck className="h-4 w-4" />,
        text: 'Đang giao hàng',
        bgColor: 'bg-orange-500',
      },
      DELIVERED: {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <PackageCheck className="h-4 w-4" />,
        text: 'Đã giao hàng',
        bgColor: 'bg-emerald-500',
      },
      CANCELLED: {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <Ban className="h-4 w-4" />,
        text: 'Huỷ đơn',
        bgColor: 'bg-red-500',
      },
      RETURNING: {
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: <RefreshCw className="h-4 w-4" />,
        text: 'Đang hoàn trả',
        bgColor: 'bg-orange-500',
      },
      REFUNDED: {
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: <DollarSign className="h-4 w-4" />,
        text: 'Đã hoàn tiền',
        bgColor: 'bg-indigo-500',
      },
      RETURN_REJECTED: {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <XCircle className="h-4 w-4" />,
        text: 'Từ chối hoàn trả',
        bgColor: 'bg-red-500',
      },
      RETURN_REQUESTED: {
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: <RotateCcw className="h-4 w-4" />,
        text: 'Yêu cầu hoàn trả',
        bgColor: 'bg-yellow-500',
      },
      COMPLETED: {
        color: 'bg-green-50 text-green-700 border-green-200',
        icon: <CheckCircle className="h-4 w-4" />,
        text: 'Đã hoàn tất',
        bgColor: 'bg-green-500',
      },
      RETURNED: {
        color: 'bg-slate-50 text-slate-700 border-slate-200',
        icon: <PackageX className="h-4 w-4" />,
        text: 'Đã trả hàng',
        bgColor: 'bg-slate-500',
      },
      RETURN_APPROVED: {
        color: 'bg-teal-50 text-teal-700 border-teal-200',
        icon: <CheckCheck className="h-4 w-4" />,
        text: 'Chấp nhận hoàn trả',
        bgColor: 'bg-teal-500',
      },
      PAYMENT_CONFIRMATION: {
        color: 'bg-green-50 text-green-700 border-green-200',
        icon: <CreditCard className="h-4 w-4" />,
        text: 'Đã thanh toán',
        bgColor: 'bg-green-500',
      },
      PAYMENT_FAILED: {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <AlertTriangle className="h-4 w-4" />,
        text: 'Thanh toán thất bại',
        bgColor: 'bg-red-500',
      },
      PAYMENT_CANCELLED: {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: <XCircle className="h-4 w-4" />,
        text: 'Thanh toán đã huỷ',
        bgColor: 'bg-gray-500',
      },
    };

    return (
      configs[status.code] || {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: <AlertCircle className="h-4 w-4" />,
        text: 'Không xác định',
        bgColor: 'bg-gray-500',
      }
    );
  };
  console.log('dsjhgfdjfgjds', order);

  const requiresTrackingNumber = (status: OrderResponse['orderStatus']) => {
    return ['DELIVERING', 'DELIVERED'].includes(status.code);
  };

  const handleSubmit = async () => {
    if (requiresTrackingNumber(newStatus) && !trackingNumber.trim()) {
      alert('Vui lòng nhập mã vận đơn');
      return;
    }

    setIsLoading(true);
    try {
      await onUpdateStatus(order.comboId, newStatus, trackingNumber, notes);
      const updateStatus = {
        orderComboId: order.comboId,
        notes: notes,
        newStatusId: newStatus.id,
      };
      const response = await orderHistoryApi.updateStatusOrder(updateStatus);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCustomerInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  const isFormValid =
    newStatus.code !== order.orderStatus.code &&
    notes.trim() !== '' &&
    (!requiresTrackingNumber(newStatus) || trackingNumber.trim() !== '');

  const currentStatusConfig = getStatusConfig(order.orderStatus);
  const newStatusConfig = getStatusConfig(newStatus);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-full', currentStatusConfig.bgColor)}>
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Cập nhật trạng thái đơn hàng
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Thay đổi trạng thái và theo dõi tiến trình đơn hàng
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Information */}
          <Card className="border-0 bg-gray-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                  <AvatarFallback className="text-sm font-medium bg-orange-500 text-white">
                    {getCustomerInitials(order.destination.customerName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">Mã đơn:</span>
                    <code className="px-2 py-1 bg-white rounded text-sm font-mono">
                      {snipppetCode.cutCode(order.comboId)}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {order.destination.customerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(order.createDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {order.grandPrice.toLocaleString('vi-VN')}đ
                  </div>
                  <div className="text-sm text-gray-600">{order.items.length} sản phẩm</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Transition */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Chuyển trạng thái</h3>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Info className="h-4 w-4" />
                <span>Chọn trạng thái tiếp theo</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Current Status */}
              <Card className="border-2 border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="mb-3">
                    <div
                      className={cn(
                        'inline-flex h-12 w-12 items-center justify-center rounded-full',
                        currentStatusConfig.bgColor,
                      )}
                    >
                      {currentStatusConfig.icon}
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Hiện tại</h4>
                  <Badge className={cn('text-xs', currentStatusConfig.color)}>
                    {currentStatusConfig.text}
                  </Badge>
                </CardContent>
              </Card>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="h-8 w-8 text-gray-400" />
              </div>

              {/* New Status */}
              {newStatus.code !== order.orderStatus.code && (
                <Card className="border-2 border-blue-200 bg-blue-50/30">
                  <CardContent className="p-4 text-center">
                    <div className="mb-3">
                      <div
                        className={cn(
                          'inline-flex h-12 w-12 items-center justify-center rounded-full',
                          newStatusConfig.bgColor,
                        )}
                      >
                        {newStatusConfig.icon}
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Mới</h4>
                    <Badge className={cn('text-xs', newStatusConfig.color)}>
                      {newStatusConfig.text}
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Separator />

          {/* Status Selection */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Chọn trạng thái mới</Label>
            </div>

            <Select
              value={newStatus.code}
              onValueChange={(value) => {
                const selected = orderStatuses.find((s) => s.code === value);
                if (selected) {
                  setNewStatus(selected as any);
                }
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Chọn trạng thái mới" />
              </SelectTrigger>
              <SelectContent>
                {orderStatuses.map((status) => {
                  const config = getStatusConfig(status as any);
                  return (
                    <SelectItem key={status.code} value={status.code}>
                      <div className="flex items-center gap-3 py-1">
                        <div className={cn('p-1.5 rounded-full', config.bgColor)}>
                          {config.icon}
                        </div>
                        <span className="font-medium">{config.text}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Tracking Number */}
          {requiresTrackingNumber(newStatus) && (
            <div className="space-y-2">
              <Label className="text-base font-medium flex items-center gap-2">
                <TruckIcon className="h-4 w-4" />
                Mã vận đơn <span className="text-red-500">*</span>
              </Label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Nhập mã vận đơn để theo dõi"
                className="h-12"
              />
              <p className="text-sm text-gray-600">
                Mã vận đơn sẽ được gửi cho khách hàng để theo dõi đơn hàng
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Ghi chú
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Thêm ghi chú về việc thay đổi trạng thái..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className={cn(
                'flex-1 h-12 text-base font-medium',
                isFormValid
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed',
              )}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Cập nhật trạng thái
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
