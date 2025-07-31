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
} from 'lucide-react';
import React from 'react';

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  trend = 'up',
  color = 'primary',
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}) => (
  <div className={`stat bg-base-100 shadow-lg rounded-xl border border-base-300 hover:shadow-xl transition-all duration-300 hover:scale-105`}>
    <div className="stat-figure text-primary">
      <div className={`avatar placeholder bg-${color} bg-opacity-10 p-3 rounded-full`}>
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
    <div className="stat-title text-base-content/70">{title}</div>
    <div className={`stat-value text-${color}`}>{value}</div>
    <div className="stat-desc flex items-center gap-1">
      {trend === 'up' ? (
        <TrendingUp className="h-4 w-4 text-success" />
      ) : (
        <TrendingDown className="h-4 w-4 text-error" />
      )}
      <span className={trend === 'up' ? 'text-success' : 'text-error'}>{change}</span>
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
  <div className="card bg-base-100 shadow-lg border border-base-300">
    <div className="card-body">
      <h2 className="card-title text-lg font-semibold">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-base-200 transition-colors">
            <div className={`avatar placeholder ${getStatusColor(item.status)}`}>
              <div className="bg-opacity-10 rounded-full w-10 h-10 flex items-center justify-center">
                <Activity className={`h-5 w-5 ${getStatusTextColor(item.status)}`} />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium text-base-content">{item.title}</p>
              <p className="text-sm text-base-content/70">{item.description}</p>
              <p className="text-xs text-base-content/50">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'bg-success';
    case 'warning': return 'bg-warning';
    case 'error': return 'bg-error';
    case 'info': return 'bg-info';
    default: return 'bg-primary';
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'success': return 'text-success';
    case 'warning': return 'text-warning';
    case 'error': return 'text-error';
    case 'info': return 'text-info';
    default: return 'text-primary';
  }
};

export default function AdminPage() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="hero bg-base-200 rounded-lg p-8">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold">Tổng quan hệ thống</h1>
              <p className="py-6">Đang tải dữ liệu...</p>
              <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="stat bg-base-100 shadow-lg rounded-xl border border-base-300">
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
        <div className="alert alert-error shadow-lg">
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
        <div className="hero bg-base-200 rounded-lg p-8">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold">Tổng quan hệ thống</h1>
              <p className="py-6">Không có dữ liệu</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg p-8">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold">Tổng quan hệ thống</h1>
            <p className="py-6">Xem tổng quan về hoạt động của hệ thống admin</p>
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
          color="primary"
        />
        <StatCard
          title="Shop đang hoạt động"
          value={stats.totalSellers.toLocaleString()}
          change="+8% so với tháng trước"
          icon={Store}
          trend="up"
          color="secondary"
        />
        <StatCard
          title="Sản phẩm đang bán"
          value={stats.totalProducts.toLocaleString()}
          change="+12% so với tháng trước"
          icon={Package}
          trend="up"
          color="accent"
        />
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders.toLocaleString()}
          change="+15% so với tháng trước"
          icon={ShoppingCart}
          trend="up"
          color="success"
        />
        <StatCard
          title="Danh mục sản phẩm"
          value={stats.totalCategories.toLocaleString()}
          change="+3% so với tháng trước"
          icon={Tag}
          trend="up"
          color="warning"
        />
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-lg font-semibold">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="btn btn-primary btn-outline">
              <Users className="h-4 w-4" />
              Quản lý người dùng
            </button>
            <button className="btn btn-secondary btn-outline">
              <Store className="h-4 w-4" />
              Quản lý shop
            </button>
            <button className="btn btn-accent btn-outline">
              <Package className="h-4 w-4" />
              Quản lý sản phẩm
            </button>
            <button className="btn btn-success btn-outline">
              <ShoppingCart className="h-4 w-4" />
              Quản lý đơn hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
