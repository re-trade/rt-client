'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { OrderResponse } from '@/service/orders.api';
import { AlertCircle, CheckCircle, Package, Truck } from 'lucide-react';
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
  const [newStatus, setNewStatus] = useState<OrderResponse['orderStatus']>('pending');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (order) {
      setNewStatus(order.orderStatus);
      // setNotes(order.notes || '');
    }
  }, [order]);

  if (!order) return null;

  const getStatusColor = (status: OrderResponse['orderStatus']) => {
    switch (status.code) {
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
    switch (status.code) {
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

  const getStatusIcon = (status: OrderResponse['orderStatus']) => {
    switch (status.code) {
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getAvailableStatuses = (
    currentStatus: OrderResponse['orderStatus'],
  ): OrderResponse['orderStatus'][] => {
    switch (currentStatus.code) {
      case 'pending':
        return ['confirmed', 'cancelled'];
      case 'confirmed':
        return ['preparing', 'cancelled'];
      case 'preparing':
        return ['ready_to_ship', 'cancelled'];
      case 'ready_to_ship':
        return ['shipped', 'cancelled'];
      case 'shipped':
        return ['delivered'];
      default:
        return [];
    }
  };

  const requiresTrackingNumber = (status: OrderResponse['orderStatus']) => {
    return ['shipped', 'delivered'].includes(status.code);
  };

  const handleSubmit = () => {
    if (requiresTrackingNumber(newStatus) && !trackingNumber.trim()) {
      alert('Vui lòng nhập mã vận đơn');
      return;
    }

    onUpdateStatus(order.id, newStatus, trackingNumber, notes);
    onOpenChange(false);
  };

  const availableStatuses = getAvailableStatuses(order.orderStatus);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Đơn hàng</Label>
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <div className="font-medium">{order.orderNumber}</div>
              <div className="text-sm text-muted-foreground">{order.customerName}</div>
            </div>
          </div>

          <div>
            <Label>Trạng thái hiện tại</Label>
            <div className="mt-2 flex items-center gap-2">
              {getStatusIcon(order.orderStatus)}
              <Badge className={getStatusColor(order.orderStatus)}>
                {getStatusText(order.orderStatus)}
              </Badge>
            </div>
          </div>

          <div>
            <Label htmlFor="newStatus">Trạng thái mới</Label>
            <Select
              value={newStatus}
              onValueChange={(value: Order['orderStatus']) => setNewStatus(value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      {getStatusText(status)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {requiresTrackingNumber(newStatus) && (
            <div>
              <Label htmlFor="trackingNumber">
                Mã vận đơn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Nhập mã vận đơn"
                className="mt-2"
              />
            </div>
          )}

          <div>
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Thêm ghi chú cho đơn hàng..."
              className="mt-2"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              Cập nhật trạng thái
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
