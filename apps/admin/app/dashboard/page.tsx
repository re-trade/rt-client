'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Package,
  Store,
  Users,
  ShoppingCart,
  AlertTriangle,
  Tag,
} from 'lucide-react';
import React from 'react';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';

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
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      <Icon className="h-4 w-4 text-gray-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center text-xs mt-1">
        {trend === 'up' ? (
          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>{change}</span>
      </div>
    </CardContent>
  </Card>
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
    status: 'success' | 'warning' | 'error';
  }>;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div
              className={`p-2 rounded-full ${
                item.status === 'success'
                  ? 'bg-green-100'
                  : item.status === 'warning'
                    ? 'bg-yellow-100'
                    : 'bg-red-100'
              }`}
            >
              <Activity
                className={`h-4 w-4 ${
                  item.status === 'success'
                    ? 'text-green-600'
                    : item.status === 'warning'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{item.title}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
              <p className="text-xs text-gray-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function AdminPage() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Tổng quan hệ thống</h2>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Tổng quan hệ thống</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Tổng quan hệ thống</h2>
          <p className="text-muted-foreground">Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Tổng quan hệ thống</h2>
        <p className="text-muted-foreground">Xem tổng quan về hoạt động của hệ thống admin</p>
      </div>

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
              status: 'success',
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
    </div>
  );
}
