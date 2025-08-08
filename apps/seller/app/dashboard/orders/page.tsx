'use client';

import { OrderDetailDialog } from '@/components/dialog-common/add/order-detail-dialog';
import { OrderTable } from '@/components/dialog-common/view-update/order-table';
import { UpdateStatusDialog } from '@/components/dialog-common/view-update/update-status-dialog';
import OrderListEmpty from '@/components/order/OrderListEmpty';
import OrderListSkeleton from '@/components/order/OrderListSkeleton';
import OrderStatusDropdown from '@/components/order/OrderStatusDropdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { useOrder } from '@/hooks/use-order';
import { OrderResponse } from '@/service/orders.api';
import {
  DollarSign,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-orange-500 border-b-2 border-orange-400 pb-2 inline-block">
              Danh sách đơn hàng
            </h1>
            <p className="text-slate-600 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Quản lý và theo dõi tất cả đơn hàng ({orders.length})
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{orders.length} đơn hàng</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing || isLoading}
                className="flex items-center gap-2 border-orange-200 hover:bg-orange-50 text-orange-600"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing || isLoading ? 'animate-spin' : ''}`}
                />
                Làm mới
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {orderMetric ? orderMetric.totalOrder : 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Hoàn thành</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {orderMetric ? orderMetric.orderCompleted : 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Đơn hủy</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {orderMetric ? orderMetric.orderCancelled : 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Package className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {orderMetric ? orderMetric.totalPaymentReceived.toLocaleString('vi-VN') : 0}đ
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border shadow bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên khách hàng, SĐT..."
                  className="pl-10 border-slate-200 focus:border-orange-300 focus:ring-orange-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyUp={handleKeyPress}
                />
              </div>
              <OrderStatusDropdown setStatusFilter={setStatusFilter} statusFilter={statusFilter} />
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border shadow bg-white">
            <CardContent className="p-6">
              <p className="text-red-600 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        <Card className="border shadow bg-white">
          <CardContent className="p-6">
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
          </CardContent>
        </Card>

        <Card className="border shadow bg-white">
          <CardContent className="p-6">
            <Pagination
              currentPage={page}
              totalPages={totalPage}
              totalItems={total}
              itemsPerPage={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              loading={isLoading}
              pageSizeOptions={[10, 20, 50]}
              className="text-gray-600"
            />
          </CardContent>
        </Card>

        <OrderDetailDialog
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          order={selectedOrder}
        />

        <UpdateStatusDialog
          open={isUpdateStatusOpen}
          onOpenChange={setIsUpdateStatusOpen}
          order={selectedOrder}
          onUpdateStatus={handleOrderStatusUpdate}
        />
      </div>
    </div>
  );
}
