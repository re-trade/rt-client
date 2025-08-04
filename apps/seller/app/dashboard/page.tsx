'use client';
import BestProductsChart from '@/components/dashboard/BestProductsChart';
import MetricCard from '@/components/dashboard/MetricCard';
import OrderStatusChart from '@/components/dashboard/OrderStatusChart';
import RecentOrdersWidget from '@/components/dashboard/RecentOrdersWidget';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { useDashboard } from '@/hooks/use-dashboard';
import type { DashboardMetricCode } from '@/service/dashboard.api';
import {
  Activity,
  DollarSign,
  Eye,
  Package,
  RefreshCw,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useCallback, useState } from 'react';

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { dashboardMetric, timeRange, updateTimeRange, refreshDashboard, isLoading } =
    useDashboard();

  const getMetricValue = (code: DashboardMetricCode) => {
    const metric = dashboardMetric.find((m) => m.code === code);
    return metric?.value || 0;
  };

  const getMetricChange = (code: DashboardMetricCode) => {
    const metric = dashboardMetric.find((m) => m.code === code);
    return metric?.change || 0;
  };

  const formatMetricChange = (code: DashboardMetricCode) => {
    const change = getMetricChange(code);
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}% so với tháng trước`;
  };

  const getMetricTrend = (code: DashboardMetricCode) => {
    const change = getMetricChange(code);
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const handleRefresh = useCallback(async () => {
    if (!isLoading) {
      setIsRefreshing(true);
      await refreshDashboard();
      setTimeout(() => setIsRefreshing(false), 1500);
    }
  }, [isLoading, refreshDashboard]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tổng quan Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Xem tổng quan về hoạt động kinh doanh của bạn</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => {
                const newTimeRange = e.target.value as '7d' | '30d' | '90d' | '1y';
                updateTimeRange(newTimeRange);
                handleRefresh();
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="7d">7 ngày qua</option>
              <option value="30d">30 ngày qua</option>
              <option value="90d">90 ngày qua</option>
              <option value="1y">1 năm qua</option>
            </select>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <>
              <MetricCard
                title="Tổng sản phẩm"
                value={formatNumber(getMetricValue('TOTAL_PRODUCTS'))}
                change={formatMetricChange('TOTAL_PRODUCTS')}
                icon={Package}
                color="from-blue-500 to-blue-600"
                trend={getMetricTrend('TOTAL_PRODUCTS')}
              />
              <MetricCard
                title="Doanh thu"
                value={`${formatNumber(getMetricValue('REVENUE'))}đ`}
                change={formatMetricChange('REVENUE')}
                icon={DollarSign}
                color="from-green-500 to-green-600"
                trend={getMetricTrend('REVENUE')}
              />
              <MetricCard
                title="Đơn hàng"
                value={formatNumber(getMetricValue('TOTAL_ORDERS'))}
                change={formatMetricChange('TOTAL_ORDERS')}
                icon={ShoppingCart}
                color="from-purple-500 to-purple-600"
                trend={getMetricTrend('TOTAL_ORDERS')}
              />
              <MetricCard
                title="Tỷ lệ hoàn hàng"
                value={`${getMetricValue('RETURN_RATE').toFixed(2)}%`}
                change={formatMetricChange('RETURN_RATE')}
                icon={TrendingUp}
                color="from-orange-500 to-orange-600"
                trend={getMetricTrend('RETURN_RATE')}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <>
              <MetricCard
                title="Sản phẩm đang bán"
                value={formatNumber(getMetricValue('ACTIVE_PRODUCTS'))}
                change={formatMetricChange('ACTIVE_PRODUCTS')}
                icon={Users}
                color="from-teal-500 to-teal-600"
                trend={getMetricTrend('ACTIVE_PRODUCTS')}
              />
              <MetricCard
                title="Tỷ lệ bán hàng"
                value={`${getMetricValue('SOLD_RATE').toFixed(2)}%`}
                change={formatMetricChange('SOLD_RATE')}
                icon={Eye}
                color="from-indigo-500 to-indigo-600"
                trend={getMetricTrend('SOLD_RATE')}
              />
              <MetricCard
                title="Đánh giá trung bình"
                value={`${getMetricValue('AVERAGE_VOTE').toFixed(2)}/5.0`}
                change={formatMetricChange('AVERAGE_VOTE')}
                icon={Star}
                color="from-yellow-500 to-yellow-600"
                trend={getMetricTrend('AVERAGE_VOTE')}
              />
              <MetricCard
                title="Tỷ lệ xác minh"
                value={`${getMetricValue('VERIFIED_RATE').toFixed(2)}%`}
                change={formatMetricChange('VERIFIED_RATE')}
                icon={Activity}
                color="from-red-500 to-red-600"
                trend={getMetricTrend('VERIFIED_RATE')}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <OrderStatusChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BestProductsChart />
          <RecentOrdersWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
