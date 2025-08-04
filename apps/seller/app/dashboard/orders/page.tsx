'use client';

import { OrderDetailDialog } from '@/components/dialog-common/add/order-detail-dialog';
import { OrderTable } from '@/components/dialog-common/view-update/order-table';
import { UpdateStatusDialog } from '@/components/dialog-common/view-update/update-status-dialog';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderResponse, ordersApi } from '@/service/orders.api';
import { Search, ShoppingBag, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.orderStatus.code === statusFilter;
    return matchesStatus;
  });

  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrders(1, pageSize, searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleViewDetail = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsUpdateStatusOpen(true);
  };

  const fetchOrders = async (
    page: number = currentPage,
    size: number = pageSize,
    query?: string,
  ) => {
    try {
      setLoading(true);
      const response = await ordersApi.getAllOrdersBySeller(page - 1, size, query);
      if (response.orders) {
        setOrders(response.orders);
        setTotalPages(response.totalPages);
        setTotalItems(response.totalElements);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, pageSize);
  }, []);

  useEffect(() => {
    if (currentPage > 0) {
      fetchOrders(currentPage, pageSize, searchTerm);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!loading) {
      setCurrentPage(1);
      fetchOrders(1, pageSize, searchTerm);
    }
  }, [statusFilter]);

  const handleStatusUpdate = (
    comboId: string,
    newStatus: OrderResponse['orderStatus'],
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
    fetchOrders(currentPage, pageSize, searchTerm);
  };

  return (
    <div className="space-y-3">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Danh sách đơn hàng
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Quản lý và theo dõi tất cả đơn hàng
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{orders.length} đơn hàng</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo tên khách hàng, SĐT..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
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
      </CardContent>
      <OrderTable
        orders={filteredOrders}
        onViewDetail={handleViewDetail}
        onUpdateStatus={handleUpdateStatus}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={loading}
        pageSizeOptions={[10, 20, 50]}
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
