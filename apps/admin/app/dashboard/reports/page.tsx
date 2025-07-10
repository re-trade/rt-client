'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Dữ liệu mẫu cho biểu đồ doanh thu
const revenueData = [
  { name: 'T1', value: 4000 },
  { name: 'T2', value: 3000 },
  { name: 'T3', value: 2000 },
  { name: 'T4', value: 2780 },
  { name: 'T5', value: 1890 },
  { name: 'T6', value: 2390 },
  { name: 'T7', value: 3490 },
  { name: 'T8', value: 4000 },
  { name: 'T9', value: 3200 },
  { name: 'T10', value: 2800 },
  { name: 'T11', value: 3200 },
  { name: 'T12', value: 3800 },
];

// Dữ liệu mẫu cho biểu đồ đơn hàng
const orderData = [
  { name: 'T1', orders: 2400, revenue: 4000 },
  { name: 'T2', orders: 1398, revenue: 3000 },
  { name: 'T3', orders: 9800, revenue: 2000 },
  { name: 'T4', orders: 3908, revenue: 2780 },
  { name: 'T5', orders: 4800, revenue: 1890 },
  { name: 'T6', orders: 3800, revenue: 2390 },
];

// Dữ liệu mẫu cho biểu đồ phân bố người dùng
const userDistributionData = [
  { name: 'Người mua', value: 400 },
  { name: 'Người bán', value: 300 },
  { name: 'Admin', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

// Dữ liệu mẫu cho biểu đồ xu hướng
const trendData = [
  { name: 'T1', users: 4000, products: 2400, shops: 1800 },
  { name: 'T2', users: 3000, products: 1398, shops: 2210 },
  { name: 'T3', users: 2000, products: 9800, shops: 2290 },
  { name: 'T4', users: 2780, products: 3908, shops: 2000 },
  { name: 'T5', users: 1890, products: 4800, shops: 2181 },
  { name: 'T6', users: 2390, products: 3800, shops: 2500 },
];

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

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Báo cáo & Thống kê</h2>
        <p className="text-muted-foreground">Phân tích và theo dõi hiệu suất hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Doanh thu tháng này"
          value="1.2 tỷ"
          change="+15% so với tháng trước"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Tổng đơn hàng"
          value="2,450"
          change="+8% so với tháng trước"
          icon={ShoppingCart}
          trend="up"
        />
        <StatCard
          title="Người dùng mới"
          value="1,250"
          change="+12% so với tháng trước"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Tỷ lệ tăng trưởng"
          value="18.5%"
          change="+3% so với tháng trước"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng & Doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="orders" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Phân bố người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Xu hướng phát triển</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" />
                  <Line type="monotone" dataKey="products" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="shops" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
