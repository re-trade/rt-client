'use client';

import { OrderDetailDialog } from '@/components/dialog-common/add/order-detail-dialog';
import { OrderTable } from '@/components/dialog-common/view-update/order-table';
import { UpdateStatusDialog } from '@/components/dialog-common/view-update/update-status-dialog';
import { Button } from '@/components/ui/button';
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
import { RefreshCw, Search, ShoppingBag, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = () => {
    setCurrentPage(1);
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching orders with params:', {
        page: currentPage - 1,
        size: pageSize,
        keyword: debouncedSearchTerm,
        status: statusFilter,
      });

      const response = await ordersApi.getAllOrdersBySeller(
        currentPage - 1,
        pageSize,
        debouncedSearchTerm,
        statusFilter,
      );

      console.log('Orders API response:', response);

      if (response && response.orders) {
        setOrders(response.orders);
        setTotalPages(response.totalPages);
        setTotalItems(response.totalElements);
        console.log('Orders set successfully:', response.orders.length, 'orders');
      } else {
        console.warn('No orders in response or invalid response structure');
        setOrders([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Lỗi khi tải đơn hàng: ${errorMessage}`);
      setOrders([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize, debouncedSearchTerm, statusFilter]);

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
    fetchOrders();
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{orders.length} đơn hàng</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchOrders()}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
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
              <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
              <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
              <SelectItem value="PREPARING">Đang chuẩn bị</SelectItem>
              <SelectItem value="DELIVERING">Đã giao shipper</SelectItem>
              <SelectItem value="DELIVERED">Đã giao hàng</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Đang tải đơn hàng...</p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn hàng</h3>
            <p className="text-sm text-gray-500">
              {debouncedSearchTerm || statusFilter !== 'all'
                ? 'Không tìm thấy đơn hàng phù hợp với bộ lọc hiện tại.'
                : 'Chưa có đơn hàng nào được tạo.'}
            </p>
          </div>
        </div>
      ) : (
        <OrderTable
          orders={orders}
          onViewDetail={handleViewDetail}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

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
