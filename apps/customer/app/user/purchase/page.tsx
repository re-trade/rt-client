'use client';

import { useOrder } from '@/hooks/use-order';
import { OrderCombo } from '@/services/order.api';
import Pagination from '@components/common/Pagination';
import PurchaseOrderEmpty from '@components/purchase/PurchaseOrderEmpty';
import PurchaseOrderItem from '@components/purchase/PurchaseOrderItem';
import PurchaseSkeleton from '@components/purchase/PurchaseSkeleton';
import {
  CheckCircle,
  DollarSign,
  Filter,
  RefreshCw,
  Search,
  ShoppingBag,
  XCircle,
} from 'lucide-react';
import { memo, useMemo } from 'react';

export default function PurchasePage() {
  const {
    orders,
    pagination,
    isLoading,
    error,
    search,
    orderStatusRecord,
    selectedOrderStatuses,
    updateSearchFilter,
    updateOrderStatusFilter,
    getStatusDisplay,
    getMyOrders,
    goToPage,
  } = useOrder();

  const formatPrice = useMemo(() => {
    return (price: number) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price);
    };
  }, []);

  const { totalOrders, deliveredCount, totalSpent } = useMemo(() => {
    const totalOrders = pagination?.totalElements || 0;
    const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;
    const totalSpent = orders.reduce((sum, order) => sum + order.grandPrice, 0);

    return { totalOrders, deliveredCount, totalSpent };
  }, [orders, pagination?.totalElements]);

  if (isLoading) {
    return <PurchaseSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-orange-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-md border border-orange-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-orange-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Đơn hàng của tôi</h1>
                  <p className="text-gray-600 mt-1">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
                </div>
              </div>
              <button
                onClick={() => getMyOrders()}
                disabled={isLoading}
                className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>
            </div>
          </div>
        </div>

        <StatsCards
          totalOrders={totalOrders}
          deliveredCount={deliveredCount}
          totalSpent={totalSpent}
          formatPrice={formatPrice}
        />

        <SearchAndFilter
          search={search}
          selectedOrderStatuses={selectedOrderStatuses}
          orderStatusRecord={orderStatusRecord}
          updateSearchFilter={updateSearchFilter}
          updateOrderStatusFilter={updateOrderStatusFilter}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {orders.length === 0 ? (
            <PurchaseOrderEmpty
              statusFilter={selectedOrderStatuses || ''}
              searchTerm={search || ''}
            />
          ) : (
            <OrderList orders={orders} getStatusDisplay={getStatusDisplay} />
          )}
        </div>

        {pagination && (
          <Pagination
            currentPage={pagination.page + 1}
            totalPages={pagination.totalPages}
            totalElements={pagination.totalElements}
            onPageChange={goToPage}
            loading={isLoading}
            theme="purchase"
            showInfo={true}
            showQuickJump={true}
            size="md"
          />
        )}
      </div>
    </div>
  );
}

const OrderList = memo(
  ({
    orders,
    getStatusDisplay,
  }: {
    orders: OrderCombo[];
    getStatusDisplay: (id: string) => { label: string; color: string; icon: React.ElementType };
  }) => {
    return (
      <>
        {orders.map((order) => {
          const statusDisplay = getStatusDisplay(order.orderStatusId);
          return (
            <PurchaseOrderItem key={order.comboId} order={order} statusDisplay={statusDisplay} />
          );
        })}
      </>
    );
  },
);

OrderList.displayName = 'OrderList';

const SearchAndFilter = memo(
  ({
    search,
    selectedOrderStatuses,
    orderStatusRecord,
    updateSearchFilter,
    updateOrderStatusFilter,
  }: {
    search: string;
    selectedOrderStatuses: string | null;
    orderStatusRecord: Record<string, any>;
    updateSearchFilter: (search: string) => void;
    updateOrderStatusFilter: (status: string | null) => void;
  }) => {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-orange-200">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng, tên sản phẩm hoặc người bán..."
              value={search}
              onChange={(e) => {
                updateSearchFilter(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 text-black rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedOrderStatuses ?? 'all'}
              onChange={(e) => updateOrderStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 text-black rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              {Object.entries(orderStatusRecord).map(([key, status]) => (
                <option key={key} value={key}>
                  {status.config.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  },
);

SearchAndFilter.displayName = 'SearchAndFilter';

const StatsCards = memo(
  ({
    totalOrders,
    deliveredCount,
    totalSpent,
    formatPrice,
  }: {
    totalOrders: number;
    deliveredCount: number;
    totalSpent: number;
    formatPrice: (price: number) => string;
  }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-orange-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-orange-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-gray-800">{deliveredCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-orange-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng chi tiêu</p>
              <p className="text-lg font-bold text-gray-800">{formatPrice(totalSpent)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

StatsCards.displayName = 'StatsCards';
