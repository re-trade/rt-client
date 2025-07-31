'use client';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Package,
  ShoppingCart,
  Store,
  Tag,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  ShoppingBag,
} from 'lucide-react';
import React from 'react';

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  trend = 'up',
  color = 'primary',
  gradient = 'from-primary to-secondary',
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  gradient?: string;
}) => (
  <div className={`stat bg-gradient-to-br ${gradient} text-white shadow-xl rounded-2xl border-0 hover:scale-105 transition-all duration-300`}>
    <div className="stat-figure text-white">
      <div className="avatar placeholder bg-white bg-opacity-20 p-4 rounded-full">
        <Icon className="h-8 w-8 text-white" />
      </div>
    </div>
    <div className="stat-title text-white/90">{title}</div>
    <div className="stat-value text-white">{value}</div>
    <div className="stat-desc flex items-center gap-1 text-white/80">
      {trend === 'up' ? (
        <TrendingUp className="h-4 w-4 text-green-300" />
      ) : (
        <TrendingDown className="h-4 w-4 text-red-300" />
      )}
      <span className={trend === 'up' ? 'text-green-300' : 'text-red-300'}>{change}</span>
    </div>
  </div>
);

const ActivityCard = ({
  title,
  items,
}: {
  title: string;
  items: Array<{
    title: string;
    description: string;
    time: string;
    status: 'success' | 'warning' | 'error' | 'info';
  }>;
}) => (
  <div className="card bg-white shadow-xl border-0 rounded-2xl">
    <div className="card-body">
      <h2 className="card-title text-xl font-bold text-gray-800">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className={`avatar placeholder ${getStatusColor(item.status)}`}>
              <div className="bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center">
                <Activity className={`h-6 w-6 ${getStatusTextColor(item.status)}`} />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-gray-800">{item.title}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-xs text-gray-500">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'bg-emerald-500';
    case 'warning': return 'bg-amber-500';
    case 'error': return 'bg-red-500';
    case 'info': return 'bg-blue-500';
    default: return 'bg-indigo-500';
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'success': return 'text-emerald-600';
    case 'warning': return 'text-amber-600';
    case 'error': return 'text-red-600';
    case 'info': return 'text-blue-600';
    default: return 'text-indigo-600';
  }
};

export default function AdminPage() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="hero bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white rounded-3xl p-12">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold mb-6">Tổng quan hệ thống</h1>
              <p className="text-xl mb-8">Đang tải dữ liệu...</p>
              <div className="loading loading-spinner loading-lg text-white"></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="stat bg-white shadow-xl rounded-2xl border-0">
              <div className="skeleton h-4 w-20 mb-2"></div>
              <div className="skeleton h-8 w-16 mb-2"></div>
              <div className="skeleton h-3 w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="alert alert-error shadow-lg rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Lỗi!</h3>
            <div className="text-xs">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="hero bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white rounded-3xl p-12">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold mb-6">Tổng quan hệ thống</h1>
              <p className="text-xl">Không có dữ liệu</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="hero bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white rounded-3xl p-12">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">Tổng quan hệ thống</h1>
            <p className="text-xl opacity-90">Xem tổng quan về hoạt động của hệ thống admin</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Tổng số người dùng"
          value={stats.totalCustomers.toLocaleString()}
          change="+5% so với tháng trước"
          icon={Users}
          trend="up"
          gradient="from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Shop đang hoạt động"
          value={stats.totalSellers.toLocaleString()}
          change="+8% so với tháng trước"
          icon={Store}
          trend="up"
          gradient="from-purple-500 to-pink-600"
        />
        <StatCard
          title="Sản phẩm đang bán"
          value={stats.totalProducts.toLocaleString()}
          change="+12% so với tháng trước"
          icon={Package}
          trend="up"
          gradient="from-cyan-500 to-blue-600"
        />
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders.toLocaleString()}
          change="+15% so với tháng trước"
          icon={ShoppingCart}
          trend="up"
          gradient="from-emerald-500 to-green-600"
        />
        <StatCard
          title="Danh mục sản phẩm"
          value={stats.totalCategories.toLocaleString()}
          change="+3% so với tháng trước"
          icon={Tag}
          trend="up"
          gradient="from-amber-500 to-orange-600"
        />
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActivityCard
          title="Hoạt động gần đây"
          items={[
            {
              title: 'Hệ thống hoạt động bình thường',
              description: 'Tất cả các dịch vụ đang hoạt động ổn định',
              time: '2 phút trước',
              status: 'success',
            },
            {
              title: 'Cập nhật dữ liệu thành công',
              description: 'Đã cập nhật thống kê dashboard từ API',
              time: '5 phút trước',
              status: 'success',
            },
            {
              title: 'Hệ thống admin online',
              description: 'Admin dashboard đang hoạt động bình thường',
              time: '10 phút trước',
              status: 'info',
            },
          ]}
        />

        <ActivityCard
          title="Thống kê hệ thống"
          items={[
            {
              title: `Tổng ${stats.totalCustomers.toLocaleString()} người dùng`,
              description: 'Khách hàng đã đăng ký trên hệ thống',
              time: 'Cập nhật mới nhất',
              status: 'success',
            },
            {
              title: `${stats.totalSellers.toLocaleString()} shop đang hoạt động`,
              description: 'Các shop đang kinh doanh trên nền tảng',
              time: 'Cập nhật mới nhất',
              status: 'success',
            },
            {
              title: `${stats.totalProducts.toLocaleString()} sản phẩm đang bán`,
              description: 'Sản phẩm đang được đăng bán trên hệ thống',
              time: 'Cập nhật mới nhất',
              status: 'success',
            },
          ]}
        />
      </div>

      {/* Quick Actions */}
      <div className="card bg-white shadow-xl border-0 rounded-2xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-gray-800 mb-6">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="btn btn-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:scale-105 transition-all duration-300">
              <Users className="h-5 w-5" />
              Quản lý người dùng
            </button>
            <button className="btn btn-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 hover:scale-105 transition-all duration-300">
              <Store className="h-5 w-5" />
              Quản lý shop
            </button>
            <button className="btn btn-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 hover:scale-105 transition-all duration-300">
              <Package className="h-5 w-5" />
              Quản lý sản phẩm
            </button>
            <button className="btn btn-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 hover:scale-105 transition-all duration-300">
              <ShoppingCart className="h-5 w-5" />
              Quản lý đơn hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
