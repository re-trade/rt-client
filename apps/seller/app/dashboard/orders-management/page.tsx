'use client';

import { OrderDetailDialog } from '@/components/dialog-common/add/order-detail-dialog';
import { OrderTable } from '@/components/dialog-common/view-update/order-table';
import { UpdateStatusDialog } from '@/components/dialog-common/view-update/update-status-dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderResponse, ordersApi } from '@/service/orders.api';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.destination.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.destination.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsUpdateStatusOpen(true);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersApi.getAllOrdersBySeller();
        console.log('Fetched orders:', response);
        setOrders(response);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = (
    comboId: string,
    newStatus: string,
    trackingNumber?: string,
    notes?: string,
  ) => {
    setOrders(
      orders.map((order) =>
        order.comboId === comboId
          ? {
              ...order,
              orderStatus: newStatus,
            }
          : order,
      ),
    );
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Quản lý đơn hàng</h2>
        <p className="text-muted-foreground">Theo dõi và cập nhật trạng thái đơn hàng</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo tên khách hàng, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Trạng thái đơn hàng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ xác nhận</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
            <SelectItem value="ready_to_ship">Sẵn sàng giao</SelectItem>
            <SelectItem value="shipped">Đã giao shipper</SelectItem>
            <SelectItem value="delivered">Đã giao hàng</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <OrderTable
        orders={filteredOrders}
        onViewDetail={handleViewDetail}
        onUpdateStatus={handleUpdateStatus}
      />

      <OrderDetailDialog open={isDetailOpen} onOpenChange={setIsDetailOpen} order={selectedOrder} />

      <UpdateStatusDialog
        open={isUpdateStatusOpen}
        onOpenChange={setIsUpdateStatusOpen}
        order={selectedOrder}
        onUpdateStatus={handleStatusUpdate}
      />
    </div>
  );
}
