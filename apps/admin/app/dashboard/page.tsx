'use client';

import { AdminProductChart, AdminRevenueChart } from '@/components/dashboard/AdminChart';
import MetricCard from '@/components/dashboard/MetricCard';
import { useDashboardMetric } from '@/hooks/use-dashboard-stats';
import {
  DollarSign,
  Flag,
  Package,
  RefreshCw,
  ShoppingCart,
  Store,
  Tag,
  Users,
} from 'lucide-react';
import { useCallback, useState } from 'react';

const AdminDashboard = () => {
  const { stats, loading, error } = useDashboardMetric();
  const [selectedPeriod, setSelectedPeriod] = useState('30 ngày qua');

  const formatNumber = useCallback((num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }, []);

  const formatMetricChange = useCallback((value: number) => {
    return `+${value.toFixed(2)}% so với tháng trước`;
  }, []);

  const getMetricTrend = useCallback((value: number) => {
    return value > 0 ? 'up' : value < 0 ? 'down' : 'neutral';
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tổng quan Dashboard</h1>
            <p className="text-gray-600 mt-1">Xem tổng quan về hoạt động kinh doanh của bạn</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              </div>
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
          <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu: {error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-8 text-center shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Tổng quan hệ thống</h1>
          <p className="text-lg opacity-90">Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan Dashboard</h1>
          <p className="text-gray-600 mt-1">Xem tổng quan về hoạt động của hệ thống ReTrade</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="30 ngày qua">30 ngày qua</option>
            <option value="7 ngày qua">7 ngày qua</option>
            <option value="90 ngày qua">90 ngày qua</option>
          </select>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Làm mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <MetricCard
          title="Tổng sản phẩm"
          value={formatNumber(stats.totalProducts)}
          change={formatMetricChange(0.0)}
          icon={Package}
          color="from-blue-500 to-blue-600"
          trend={getMetricTrend(0)}
        />
        <MetricCard
          title="Tổng người dùng"
          value={formatNumber(stats.totalUsers)}
          change={formatMetricChange(0.0)}
          icon={Users}
          color="from-green-500 to-green-600"
          trend={getMetricTrend(0)}
        />
        <MetricCard
          title="Người dùng mới trong tháng"
          value={formatNumber(stats.newUsersThisMonth)}
          change={formatMetricChange(0.0)}
          icon={Users}
          color="from-teal-500 to-teal-600"
          trend={getMetricTrend(0)}
        />
        <MetricCard
          title="Tổng đơn hàng"
          value={formatNumber(stats.totalOrders)}
          change={formatMetricChange(0.0)}
          icon={ShoppingCart}
          color="from-purple-500 to-purple-600"
          trend={getMetricTrend(0)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <MetricCard
          title="Doanh thu tháng này"
          value={`${formatNumber(stats.revenueThisMonth)}đ`}
          change={formatMetricChange(0.0)}
          icon={DollarSign}
          color="from-green-500 to-green-600"
          trend={getMetricTrend(0)}
        />
        <MetricCard
          title="Tổng danh mục"
          value={formatNumber(stats.totalCategories)}
          change={formatMetricChange(0.0)}
          icon={Tag}
          color="from-orange-500 to-orange-600"
          trend={getMetricTrend(0)}
        />
        <MetricCard
          title="Tổng người bán"
          value={formatNumber(stats.totalSellers)}
          change={formatMetricChange(0.0)}
          icon={Store}
          color="from-indigo-500 to-indigo-600"
          trend={getMetricTrend(0)}
        />
        <MetricCard
          title="Báo cáo"
          value={formatNumber(stats.totalReport)}
          change={formatMetricChange(0.0)}
          icon={Flag}
          color="from-red-500 to-red-600"
          trend={getMetricTrend(0)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <AdminRevenueChart />
        <AdminProductChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
