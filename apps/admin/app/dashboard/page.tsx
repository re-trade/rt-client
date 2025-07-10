'use client';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Package,
  Store,
  Users,
} from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

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
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Tổng quan hệ thống</h2>
        <p className="text-muted-foreground">Xem tổng quan về hoạt động của hệ thống admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng số shop"
          value="150"
          change="+5% so với tháng trước"
          icon={Store}
          trend="up"
        />
        <StatCard
          title="Tổng số người dùng"
          value="12,500"
          change="+8% so với tháng trước"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Tổng số sản phẩm"
          value="45,231"
          change="+12% so với tháng trước"
          icon={Package}
          trend="up"
        />
        <StatCard
          title="Doanh thu hệ thống"
          value="1.2 tỷ"
          change="+15% so với tháng trước"
          icon={DollarSign}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityCard
          title="Hoạt động gần đây"
          items={[
            {
              title: 'Shop mới đăng ký',
              description: 'Shop Thời Trang ABC đã đăng ký thành công',
              time: '2 phút trước',
              status: 'success',
            },
            {
              title: 'Cảnh báo hệ thống',
              description: 'Phát hiện hoạt động bất thường từ IP 192.168.1.1',
              time: '15 phút trước',
              status: 'warning',
            },
            {
              title: 'Lỗi thanh toán',
              description: 'Giao dịch #12345 thất bại do lỗi kết nối',
              time: '1 giờ trước',
              status: 'error',
            },
          ]}
        />

        <ActivityCard
          title="Đơn hàng cần xử lý"
          items={[
            {
              title: 'Đơn hàng #ORD1001',
              description: 'Shop Thời Trang ABC - 2,990,000đ',
              time: 'Cần xác nhận',
              status: 'warning',
            },
            {
              title: 'Đơn hàng #ORD1002',
              description: 'Shop Mỹ Phẩm XYZ - 5,990,000đ',
              time: 'Cần xử lý khiếu nại',
              status: 'error',
            },
            {
              title: 'Đơn hàng #ORD1003',
              description: 'Shop Điện Tử 123 - 1,990,000đ',
              time: 'Cần xác nhận',
              status: 'warning',
            },
          ]}
        />
      </div>
    </div>
  );
}
