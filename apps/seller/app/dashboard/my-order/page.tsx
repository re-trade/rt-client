'use client';

import { useMyOrder } from '@/hooks/use-myorder';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronDown,
  DollarSign,
  Eye,
  Filter,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function MyOrdersPage() {
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
    orderStats,
    formatPrice,
  } = useMyOrder();

  const handleRefresh = async () => {
    try {
      toast.loading('Đang làm mới dữ liệu...');
      await getMyOrders();
      toast.success('Dữ liệu đã được cập nhật');
    } catch (err) {
      toast.error('Không thể cập nhật dữ liệu');
    }
  };

  if (isLoading && !orders.length) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 w-full"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 border-t border-gray-100 flex">
                <div className="w-1/6 p-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="w-2/6 p-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="w-1/6 p-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="w-1/6 p-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="w-1/6 p-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Đơn hàng của tôi</h1>
            <p className="text-gray-600 mt-1">Quản lý các đơn hàng bạn đã mua từ người bán khác</p>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-orange-50 text-orange-600 px-4 py-2 rounded flex items-center space-x-2 hover:bg-orange-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Tổng đơn hàng"
          value={orderStats?.totalOrders || 0}
          icon={<ShoppingBag className="w-5 h-5 text-blue-600" />}
          color="blue"
        />
        <StatsCard
          title="Đã hoàn thành"
          value={orderStats?.totalOrdersCompleted || 0}
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          color="green"
        />
        <StatsCard
          title="Đang giao"
          value={orderStats?.totalOrdersBeingDelivered || 0}
          icon={<Truck className="w-5 h-5 text-orange-600" />}
          color="orange"
        />
        <StatsCard
          title="Tổng chi tiêu"
          value={formatPrice(orderStats?.totalPaymentCost || 0)}
          icon={<DollarSign className="w-5 h-5 text-purple-600" />}
          color="purple"
          isMonetary
        />
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        search={search}
        selectedOrderStatuses={selectedOrderStatuses}
        orderStatusRecord={orderStatusRecord}
        updateSearchFilter={updateSearchFilter}
        updateOrderStatusFilter={updateOrderStatusFilter}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <OrdersTable
          orders={orders}
          getStatusDisplay={getStatusDisplay}
          formatPrice={formatPrice}
        />
      </div>

      {/* Pagination */}
      {pagination && pagination.totalElements > 0 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">
            Hiển thị {pagination.page * pagination.size + 1}-
            {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} của{' '}
            {pagination.totalElements} đơn hàng
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(pagination.page)}
              disabled={pagination.page === 0}
              className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: pagination.totalPages })
              .map((_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= pagination.page + 1 - 1 && page <= pagination.page + 1 + 1),
              )
              .map((page, i, arr) => (
                <div key={page}>
                  {i > 0 && arr[i - 1] !== page - 1 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      page === pagination.page + 1
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                </div>
              ))}
            <button
              onClick={() => goToPage(pagination.page + 2)}
              disabled={pagination.page >= pagination.totalPages - 1}
              className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type StatsCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  isMonetary?: boolean;
};

const StatsCard = ({ title, value, icon, color, isMonetary = false }: StatsCardProps) => {
  const colorClass = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    orange: 'bg-orange-50',
    purple: 'bg-purple-50',
    red: 'bg-red-50',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${colorClass[color]}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-xl font-bold ${isMonetary ? 'text-lg' : 'text-2xl'}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

type OrdersTableProps = {
  orders: any[];
  getStatusDisplay: (id: string) => { label: string; color: string; icon: any };
  formatPrice: (price: number) => string;
};

const OrdersTable = ({ orders, getStatusDisplay, formatPrice }: OrdersTableProps) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="p-8 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">Không có đơn hàng nào</h3>
        <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào trong lịch sử mua hàng</p>
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Mã đơn hàng
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Người bán
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ngày đặt
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trạng thái
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tổng tiền
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {orders.map((order) => {
          const statusDisplay = getStatusDisplay(order.orderStatusId);
          const formattedDate = new Date(order.createDate).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <tr key={order.comboId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {order.comboId.substring(0, 8)}...
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900">{order.sellerName}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                  {formattedDate}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusDisplay.color}`}
                >
                  {statusDisplay.label}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatPrice(order.grandPrice)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/dashboard/my-order/${order.comboId}`}
                  className="flex items-center text-blue-600 hover:text-blue-900 mr-4 w-fit"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Chi tiết
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

type SearchAndFilterProps = {
  search: string;
  selectedOrderStatuses: string | null;
  orderStatusRecord: Record<string, any>;
  updateSearchFilter: (search: string) => void;
  updateOrderStatusFilter: (status: string | null) => void;
};

const SearchAndFilter = ({
  search,
  selectedOrderStatuses,
  orderStatusRecord,
  updateSearchFilter,
  updateOrderStatusFilter,
}: SearchAndFilterProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchFilter(e.target.value);
  };

  // Close dropdown when clicking outside
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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng, tên sản phẩm hoặc người bán..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative w-full md:w-64" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full pl-10 pr-4 py-3 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all bg-white hover:bg-gray-50"
          >
            <span className="flex items-center space-x-2 flex-1 min-w-0">
              {selectedStatus ? (
                <>
                  <selectedStatus.config.icon className="w-4 h-4 flex-shrink-0" />
                  <span
                    className={`px-2 py-1 rounded-md border text-xs font-medium ${selectedStatus.config.color} truncate`}
                  >
                    {selectedStatus.config.label}
                  </span>
                </>
              ) : (
                <>
                  <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500 truncate">Tất cả trạng thái</span>
                </>
              )}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ml-2 flex-shrink-0 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {/* "All statuses" option */}
              <button
                type="button"
                onClick={() => {
                  updateOrderStatusFilter(null);
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  !selectedOrderStatuses ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                }`}
              >
                <span className="text-gray-700 flex-1">Tất cả trạng thái</span>
              </button>

              {/* Status options */}
              {Object.entries(orderStatusRecord).map(([key, status]) => {
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
                        ? 'bg-orange-50 border-l-4 border-orange-500'
                        : ''
                    }`}
                  >
                    <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      {IconComponent ? (
                        <IconComponent className="w-4 h-4" />
                      ) : (
                        <Filter className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-md border text-sm font-medium flex-1 ${status.config?.color || ''}`}
                    >
                      {status.config?.label || 'Unknown'}
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
};
