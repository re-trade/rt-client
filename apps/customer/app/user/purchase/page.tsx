'use client';

import { statusOrder, useOrder } from '@/hooks/use-order';
import { orderApi, OrderCombo, OrderStatsResponse } from '@/services/order.api';
import Pagination from '@components/common/Pagination';
import PurchaseOrderEmpty from '@components/purchase/PurchaseOrderEmpty';
import PurchaseOrderItem from '@components/purchase/PurchaseOrderItem';
import PurchaseSkeleton from '@components/purchase/PurchaseSkeleton';
import {
  CheckCircle,
  ChevronDown,
  DollarSign,
  Filter,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

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
    sortOrdersByStatus,
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
  const [orderStats, setOrderStats] = useState<OrderStatsResponse | null>(null);

  useEffect(() => {
    const fecthOrderStats = async () => {
      try {
        const response = await orderApi.getOrderStats();
        setOrderStats(response);
        console.log('Order stats fetched:', response);
      } catch (error) {
        console.error('Failed to fetch order stats:', error);
      }
    };
    fecthOrderStats();
  }, []);

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

        <StatsCards orderStats={orderStats} formatPrice={formatPrice} />

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
            <OrderList orders={sortOrdersByStatus(orders)} getStatusDisplay={getStatusDisplay} />
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedStatus = selectedOrderStatuses ? orderStatusRecord[selectedOrderStatuses] : null;

    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-orange-200">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Search Input */}
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

          {/* Custom Status Filter Dropdown */}
          <div className="relative w-full md:w-64" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full pl-4 pr-4 py-3 border border-gray-200 text-black rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all bg-white hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {selectedStatus ? (
                  <>
                    <selectedStatus.config.icon className="w-4 h-4 flex-shrink-0 text-gray-600" />
                    <div
                      className={`w-full px-3 py-1 rounded-md text-sm font-medium ${selectedStatus.config.color} text-center`}
                    >
                      {selectedStatus.config.label}
                    </div>
                  </>
                ) : (
                  <>
                    <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500 truncate">Tất cả trạng thái</span>
                  </>
                )}
              </div>

              <ChevronDown
                className={`w-4 h-4 transition-transform ml-2 flex-shrink-0 text-gray-500 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                {/* Option "Tất cả trạng thái" */}
                <button
                  type="button"
                  onClick={() => {
                    updateOrderStatusFilter(null);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    !selectedOrderStatuses ? 'bg-amber-50 border-l-4 border-amber-500' : ''
                  }`}
                >
                  <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700 flex-1 font-medium">Tất cả trạng thái</span>
                </button>

                {/* Các option trạng thái */}
                {Object.entries(orderStatusRecord)
                  .sort(([, a], [, b]) => {
                    const orderA = statusOrder[a.code as keyof typeof statusOrder] || 999;
                    const orderB = statusOrder[b.code as keyof typeof statusOrder] || 999;
                    return orderA - orderB;
                  })
                  .map(([key, status]) => {
                    const IconComponent = status.config.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          updateOrderStatusFilter(key);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          selectedOrderStatuses === key
                            ? 'bg-amber-50 border-l-4 border-amber-500'
                            : ''
                        }`}
                      >
                        <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                          {IconComponent ? (
                            <IconComponent className="w-4 h-4 text-gray-600" />
                          ) : (
                            <Filter className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div
                            className={`w-full px-3 py-1 rounded-md text-sm font-medium ${status.config.color} text-center`}
                          >
                            {status.config.label}
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

SearchAndFilter.displayName = 'SearchAndFilter';

const StatsCards = memo(
  ({
    orderStats,
    formatPrice,
  }: {
    orderStats: OrderStatsResponse | null;
    formatPrice: (price: number) => string;
  }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-orange-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-800">{orderStats?.totalOrders}</p>
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
              <p className="text-2xl font-bold text-gray-800">{orderStats?.totalOrdersCompleted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-orange-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đang giao</p>
              <p className="text-2xl font-bold text-gray-800">
                {orderStats?.totalOrdersBeingDelivered}
              </p>
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
              <p className="text-lg font-bold text-gray-800">
                {' '}
                {orderStats?.totalPaymentCost != null
                  ? formatPrice(orderStats.totalPaymentCost)
                  : '0₫'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

StatsCards.displayName = 'StatsCards';
