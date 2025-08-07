'use client';

import { OrderDetailDialog } from '@/components/dialog-common/add/order-detail-dialog';
import { OrderTable } from '@/components/dialog-common/view-update/order-table';
import { UpdateStatusDialog } from '@/components/dialog-common/view-update/update-status-dialog';
import OrderListEmpty from '@/components/order/OrderListEmpty';
import OrderListSkeleton from '@/components/order/OrderListSkeleton';
import OrderMetrics from '@/components/order/OrderMetrics';
import OrderStatusDropdown from '@/components/order/OrderStatusDropdown';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { useOrder } from '@/hooks/use-order';
import { OrderResponse } from '@/service/orders.api';
import { RefreshCw, Search, ShoppingBag, Users } from 'lucide-react';
import { useState } from 'react';

export default function OrdersPage() {
  const {
    orders,
    orderMetric,
    isLoading,
    error,
    page,
    pageSize,
    total,
    totalPage,
    searchTerm,
    statusFilter,
    refreshing,
    sort,
    setPage,
    setPageSize,
    setSearchTerm,
    setStatusFilter,
    handleRefresh,
    handleKeyPress,
    handleStatusUpdate,
    handleSortChange,
  } = useOrder();

  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleViewDetail = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsUpdateStatusOpen(true);
  };

  const handleOrderStatusUpdate = (comboId: string, newStatus: OrderResponse['orderStatus']) => {
    handleStatusUpdate(comboId, newStatus);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
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
              onClick={handleRefresh}
              disabled={refreshing || isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing || isLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>
      </CardHeader>

      {orderMetric && <OrderMetrics metrics={orderMetric} loading={isLoading} />}

      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo tên khách hàng, SĐT..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={handleKeyPress}
            />
          </div>
          <OrderStatusDropdown setStatusFilter={setStatusFilter} statusFilter={statusFilter} />
        </div>
      </CardContent>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {isLoading ? (
        <OrderListSkeleton />
      ) : orders.length === 0 ? (
        <OrderListEmpty debouncedSearchTerm={searchTerm} statusFilter={statusFilter} />
      ) : (
        <OrderTable
          orders={orders}
          onViewDetail={handleViewDetail}
          onUpdateStatus={handleUpdateStatus}
          sort={sort}
          handleSortChange={handleSortChange}
        />
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPage}
        totalItems={total}
        itemsPerPage={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={isLoading}
        pageSizeOptions={[10, 20, 50]}
      />

      <OrderDetailDialog open={isDetailOpen} onOpenChange={setIsDetailOpen} order={selectedOrder} />

      <UpdateStatusDialog
        open={isUpdateStatusOpen}
        onOpenChange={setIsUpdateStatusOpen}
        order={selectedOrder}
        onUpdateStatus={handleOrderStatusUpdate}
      />
    </div>
  );
}
