'use client';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import {
  Activity,
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
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <div className="flex items-center gap-1 text-sm">
        {trend === 'up' ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
        <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>{change}</span>
      </div>
    </div>
    <div className="text-center">
      <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  </div>
);

export default function AdminPage() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-blue-500 text-white rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Tổng quan hệ thống</h1>
          <p className="text-lg opacity-90">Đang tải dữ liệu...</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">!</span>
            </div>
            <div>
              <h3 className="font-semibold text-red-800">Lỗi!</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="bg-blue-500 text-white rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Tổng quan hệ thống</h1>
          <p className="text-lg">Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-blue-500 text-white rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Tổng quan hệ thống</h1>
        <p className="text-lg opacity-90">Xem tổng quan về hoạt động của hệ thống admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Tổng số người dùng"
          value={stats.totalCustomers.toLocaleString()}
          change="+5% so với tháng trước"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Shop đang hoạt động"
          value={stats.totalSellers.toLocaleString()}
          change="+8% so với tháng trước"
          icon={Store}
          trend="up"
        />
        <StatCard
          title="Sản phẩm đang bán"
          value={stats.totalProducts.toLocaleString()}
          change="+12% so với tháng trước"
          icon={Package}
          trend="up"
        />
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders.toLocaleString()}
          change="+15% so với tháng trước"
          icon={ShoppingCart}
          trend="up"
        />
        <StatCard
          title="Danh mục sản phẩm"
          value={stats.totalCategories.toLocaleString()}
          change="+3% so với tháng trước"
          icon={Tag}
          trend="up"
        />
      </div>

      {/* Activity Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Hoạt động gần đây</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 rounded-full mt-2 bg-green-500"></div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">Hệ thống hoạt động bình thường</p>
              <p className="text-xs text-gray-500">Tất cả các dịch vụ đang hoạt động ổn định</p>
              <p className="text-xs text-gray-400">2 phút trước</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 rounded-full mt-2 bg-green-500"></div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">Cập nhật dữ liệu thành công</p>
              <p className="text-xs text-gray-500">Đã cập nhật thống kê dashboard từ API</p>
              <p className="text-xs text-gray-400">5 phút trước</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 rounded-full mt-2 bg-blue-500"></div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">Hệ thống admin online</p>
              <p className="text-xs text-gray-500">Admin dashboard đang hoạt động bình thường</p>
              <p className="text-xs text-gray-400">10 phút trước</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-6 w-6 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Người dùng</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Store className="h-6 w-6 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Shop</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Package className="h-6 w-6 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Sản phẩm</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingCart className="h-6 w-6 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Đơn hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
