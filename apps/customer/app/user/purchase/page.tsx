'use client';

import { useOrder } from '@/hooks/use-order';
import { OrderCombo } from '@/services/order.api';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Filter,
  Heart,
  MessageCircle,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Star,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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

  // Calculate stats
  const totalOrders = pagination?.totalElements || 0;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const totalSpent = orders.reduce((sum, order) => sum + order.grandPrice, 0);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#FDFEF9] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#525252]/20">
            <div className="animate-pulse space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 rounded w-64"></div>
                  <div className="h-4 bg-gray-200 rounded w-96"></div>
                </div>
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 border border-[#525252]/20 text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {searchTerm || statusFilter !== 'all'
                  ? 'Không tìm thấy đơn hàng'
                  : 'Chưa có đơn hàng nào'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all'
                  ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                  : 'Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusDisplay = getStatusDisplay(order.orderStatus);

              return (
                <div
                  key={order.comboId}
                  className="bg-white rounded-xl shadow-md border border-[#525252]/20 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <h3 className="text-lg font-bold text-gray-800">
                            #{order.comboId.slice(0, 8)}...
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>Bán bởi: {order.sellerName}</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${statusDisplay.color}`}
                        >
                          {statusDisplay.icon}
                          <span>{statusDisplay.label}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">
                          {formatPrice(order.grandPrice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.itemId}
                          className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {item.itemThumbnail ? (
                              <Image
                                src={item.itemThumbnail}
                                alt={item.itemName}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-full h-full flex items-center justify-center ${item.itemThumbnail ? 'hidden' : ''}`}
                            >
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{item.itemName}</h4>
                            <p className="text-sm text-gray-600">
                              Mã sản phẩm: {item.productId.slice(0, 8)}...
                            </p>
                            {item.discount > 0 && (
                              <p className="text-sm text-green-600">
                                Giảm giá: {formatPrice(item.discount)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">{formatPrice(item.basePrice)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-2">Địa chỉ giao hàng</h5>
                      <div className="text-sm text-blue-700">
                        <p className="font-medium">{order.destination.customerName}</p>
                        <p>{order.destination.phone}</p>
                        <p>
                          {order.destination.addressLine}, {order.destination.ward},{' '}
                          {order.destination.district}, {order.destination.state}
                        </p>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href={`/user/purchase/${order.comboId}`}>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>Xem chi tiết</span>
                        </button>
                      </Link>

                      {order.orderStatus === 'Delivered' && (
                        <>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                            <Star className="w-4 h-4" />
                            <span>Đánh giá</span>
                          </button>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span>Mua lại</span>
                          </button>
                        </>
                      )}

                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>Liên hệ người bán</span>
                      </button>
                    </div>
                  </div>
                </div>
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
