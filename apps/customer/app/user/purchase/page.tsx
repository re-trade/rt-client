'use client';

import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Heart,
  MessageCircle,
  Package,
  Search,
  ShoppingBag,
  Star,
  Truck,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    seller: string;
  }[];
  tracking?: string;
  estimatedDelivery?: string;
  tradingPoints: {
    pointsEarned: number;
    itemsTraded: number;
  };
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'RT2024001',
    date: '2024-12-15',
    status: 'delivered',
    total: 450000,
    items: [
      {
        id: '1',
        name: 'iPhone 12 Pro Max 256GB - Đã qua sử dụng',
        image: '/placeholder-phone.jpg',
        price: 350000,
        quantity: 1,
        seller: 'TechStore VN',
      },
      {
        id: '2',
        name: 'Ốp lưng iPhone Silicon - Như mới',
        image: '/placeholder-case.jpg',
        price: 100000,
        quantity: 1,
        seller: 'Accessories Hub',
      },
    ],
    tracking: 'VN789012345',
    tradingPoints: {
      pointsEarned: 25,
      itemsTraded: 2,
    },
  },
  {
    id: '2',
    orderNumber: 'RT2024002',
    date: '2024-12-18',
    status: 'shipped',
    total: 280000,
    items: [
      {
        id: '3',
        name: 'MacBook Air M1 - Tình trạng tốt',
        image: '/placeholder-laptop.jpg',
        price: 280000,
        quantity: 1,
        seller: 'Apple Store Second',
      },
    ],
    tracking: 'VN789012346',
    estimatedDelivery: '2024-12-20',
    tradingPoints: {
      pointsEarned: 52,
      itemsTraded: 1,
    },
  },
  {
    id: '3',
    orderNumber: 'RT2024003',
    date: '2024-12-19',
    status: 'processing',
    total: 150000,
    items: [
      {
        id: '4',
        name: 'Tai nghe AirPods Pro - Đã qua sử dụng',
        image: '/placeholder-airpods.jpg',
        price: 150000,
        quantity: 1,
        seller: 'Audio World',
      },
    ],
    tradingPoints: {
      pointsEarned: 18,
      itemsTraded: 1,
    },
  },
];

const statusConfig = {
  pending: {
    label: 'Chờ xác nhận',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Clock className="w-4 h-4" />,
  },
  processing: {
    label: 'Đang xử lý',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <Package className="w-4 h-4" />,
  },
  shipped: {
    label: 'Đang giao',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Truck className="w-4 h-4" />,
  },
  delivered: {
    label: 'Đã giao',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <XCircle className="w-4 h-4" />,
  },
};

export default function PurchasePage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const totalTradingImpact = orders.reduce(
    (acc, order) => ({
      pointsEarned: acc.pointsEarned + order.tradingPoints.pointsEarned,
      itemsTraded: acc.itemsTraded + order.tradingPoints.itemsTraded,
    }),
    { pointsEarned: 0, itemsTraded: 0 },
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
                  <p className="text-orange-100 mt-1">
                    Theo dõi và quản lý tất cả đơn hàng của bạn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-gray-800">
                  {orders.filter((o) => o.status === 'delivered').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-lg p-6 border border-amber-200">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-500 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-amber-700">Điểm tích lũy</p>
                <p className="text-xl font-bold text-amber-800">
                  {totalTradingImpact.pointsEarned} điểm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-amber-100 text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy đơn hàng</h3>
              <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-gray-800">#{order.orderNumber}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Đặt ngày {formatDate(order.date)}</span>
                        </div>
                      </div>
                      <div
                        className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig[order.status].color}`}
                      >
                        {statusConfig[order.status].icon}
                        <span>{statusConfig[order.status].label}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">{formatPrice(order.total)}</p>
                      {order.tracking && (
                        <p className="text-sm text-gray-600">Mã vận đơn: {order.tracking}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-600">Bán bởi: {item.seller}</p>
                          <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trading Points */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">Điểm thưởng</p>
                          <p className="text-xs text-amber-600">
                            Nhận {order.tradingPoints.pointsEarned} điểm • Trao đổi{' '}
                            {order.tradingPoints.itemsTraded} sản phẩm
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    {order.status === 'delivered' && (
                      <>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                          <Star className="w-4 h-4" />
                          <span>Đánh giá</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span>Mua lại</span>
                        </button>
                      </>
                    )}

                    {order.status === 'shipped' && order.tracking && (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                        <Truck className="w-4 h-4" />
                        <span>Theo dõi đơn hàng</span>
                      </button>
                    )}

                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>Liên hệ người bán</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                      <span>Xem chi tiết</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredOrders.length > 0 && (
          <div className="text-center">
            <button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-8 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
              Tải thêm đơn hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
