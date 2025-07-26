'use client';

import { useOrder } from '@/hooks/use-order';
import { OrderCombo } from '@/services/order.api';
import PurchaseOrderEmpty from '@components/purchase/PurchaseOrderEmpty';
import PurchaseOrderItem from '@components/purchase/PurchaseOrderItem';
import PurchaseSkeleton from '@components/purchase/PurchaseSkeleton';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const statusConfig = {
  'Payment Confirmation': {
    label: 'Chờ thanh toán',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Clock className="w-4 h-4" />,
  },
  'Order Confirmed': {
    label: 'Đã xác nhận',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <Package className="w-4 h-4" />,
  },
  Preparing: {
    label: 'Đang chuẩn bị',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Package className="w-4 h-4" />,
  },
  Shipping: {
    label: 'Đang giao',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Truck className="w-4 h-4" />,
  },
  Delivered: {
    label: 'Đã giao',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  Cancelled: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <XCircle className="w-4 h-4" />,
  },
};

export default function PurchasePage() {
  const { orders, pagination, isLoading, error, getMyOrders, loadMoreOrders, resetOrderState } =
    useOrder();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filteredOrders, setFilteredOrders] = useState<OrderCombo[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadInitialOrders = async () => {
      try {
        await getMyOrders({ page: 0, size: 10 });
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialOrders();
  }, [getMyOrders]);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.comboId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.itemName.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.orderStatus === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusDisplay = (status: string) => {
    return (
      statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Package className="w-4 h-4" />,
      }
    );
  };

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.totalPages - 1) {
      loadMoreOrders({ page: pagination.page + 1, size: 10 });
    }
  };

  const handleRefresh = async () => {
    resetOrderState();
    setIsInitialLoading(true);
    try {
      await getMyOrders({ page: 0, size: 10 });
    } catch (error) {
      console.error('Failed to refresh orders:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const totalOrders = pagination?.totalElements || 0;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const totalSpent = orders.reduce((sum, order) => sum + order.grandPrice, 0);

  if (isInitialLoading) {
    return <PurchaseSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#FDFEF9] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md border border-[#525252]/20 overflow-hidden">
          <div className="bg-[#FFD2B2] p-6 text-[#121212]">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
                  <p className="text-[#121212] mt-1">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 text-[#121212] px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-gray-800">{deliveredCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                <p className="text-lg font-bold text-gray-800">{formatPrice(totalSpent)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng, tên sản phẩm hoặc người bán..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 text-black rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 text-black rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Payment Confirmation">Chờ thanh toán</option>
                <option value="Order Confirmed">Đã xác nhận</option>
                <option value="Preparing">Đang chuẩn bị</option>
                <option value="Shipping">Đang giao</option>
                <option value="Delivered">Đã giao</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <PurchaseOrderEmpty statusFilter={statusFilter} searchTerm={searchTerm} />
          ) : (
            filteredOrders.map((order) => {
              const statusDisplay = getStatusDisplay(order.orderStatus);
              return (
                <PurchaseOrderItem
                  key={order.comboId}
                  order={order}
                  statusDisplay={statusDisplay}
                />
              );
            })
          )}
        </div>

        {/* Load More */}
        {pagination && pagination.page < pagination.totalPages - 1 && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="bg-[#FFD2B2] hover:bg-[#FFBB99] text-[#121212] px-8 py-3 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#121212] border-t-transparent"></div>
                  <span>Đang tải...</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  <span>Tải thêm đơn hàng</span>
                </>
              )}
            </button>
          </div>
        )}

        {pagination && (
          <div className="text-center text-sm text-gray-600">
            Hiển thị {orders.length} trên {pagination.totalElements} đơn hàng
          </div>
        )}
      </div>
    </div>
  );
}
