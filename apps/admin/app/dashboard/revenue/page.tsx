'use client';

import { Card } from '@/app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Sample data - replace with actual API call
const revenueData = {
  daily: [
    { date: '01/03', revenue: 15000000, orders: 150, customers: 120 },
    { date: '02/03', revenue: 18000000, orders: 180, customers: 150 },
    { date: '03/03', revenue: 22000000, orders: 220, customers: 180 },
    { date: '04/03', revenue: 25000000, orders: 250, customers: 200 },
    { date: '05/03', revenue: 28000000, orders: 280, customers: 220 },
    { date: '06/03', revenue: 30000000, orders: 300, customers: 250 },
    { date: '07/03', revenue: 32000000, orders: 320, customers: 270 },
  ],
  weekly: [
    { week: 'Tuần 1', revenue: 100000000, orders: 1000, customers: 800 },
    { week: 'Tuần 2', revenue: 120000000, orders: 1200, customers: 1000 },
    { week: 'Tuần 3', revenue: 150000000, orders: 1500, customers: 1200 },
    { week: 'Tuần 4', revenue: 180000000, orders: 1800, customers: 1500 },
  ],
  monthly: [
    { month: 'T1', revenue: 400000000, orders: 4000, customers: 3200 },
    { month: 'T2', revenue: 450000000, orders: 4500, customers: 3600 },
    { month: 'T3', revenue: 500000000, orders: 5000, customers: 4000 },
  ],
};

const categoryRevenue = [
  { name: 'Thời trang', value: 35 },
  { name: 'Điện tử', value: 25 },
  { name: 'Mỹ phẩm', value: 20 },
  { name: 'Nhà cửa', value: 15 },
  { name: 'Khác', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const timeRanges = ['Hôm nay', 'Tuần này', 'Tháng này', 'Năm nay'];
const viewTypes = ['Ngày', 'Tuần', 'Tháng'];

export default function RevenueManagementPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('Hôm nay');
  const [selectedViewType, setSelectedViewType] = useState('Ngày');

  // Calculate statistics
  const currentData = revenueData[selectedViewType.toLowerCase() as keyof typeof revenueData] || [];
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = currentData.reduce((sum, item) => sum + item.orders, 0);
  const totalCustomers = currentData.reduce((sum, item) => sum + item.customers, 0);
  const averageOrderValue = totalRevenue / totalOrders;

  // Calculate growth rates
  const previousData = currentData.slice(-2);
  const revenueGrowth =
    previousData.length >= 2 && previousData[0] && previousData[1]
      ? ((previousData[1].revenue - previousData[0].revenue) / previousData[0].revenue) * 100
      : 0;
  const ordersGrowth =
    previousData.length >= 2 && previousData[0] && previousData[1]
      ? ((previousData[1].orders - previousData[0].orders) / previousData[0].orders) * 100
      : 0;
  const customersGrowth =
    previousData.length >= 2 && previousData[0] && previousData[1]
      ? ((previousData[1].customers - previousData[0].customers) / previousData[0].customers) * 100
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý doanh thu</h1>
        <div className="flex items-center space-x-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedViewType} onValueChange={setSelectedViewType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Kiểu xem" />
            </SelectTrigger>
            <SelectContent>
              {viewTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng doanh thu</p>
              <h2 className="text-2xl font-bold">{totalRevenue.toLocaleString('vi-VN')}đ</h2>
              <div className="mt-2 flex items-center text-sm">
                {revenueGrowth >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(revenueGrowth).toFixed(1)}%
                </span>
                <span className="ml-2 text-muted-foreground">so với kỳ trước</span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</p>
              <h2 className="text-2xl font-bold">{totalOrders.toLocaleString('vi-VN')}</h2>
              <div className="mt-2 flex items-center text-sm">
                {ordersGrowth >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={ordersGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(ordersGrowth).toFixed(1)}%
                </span>
                <span className="ml-2 text-muted-foreground">so với kỳ trước</span>
              </div>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Khách hàng mới</p>
              <h2 className="text-2xl font-bold">{totalCustomers.toLocaleString('vi-VN')}</h2>
              <div className="mt-2 flex items-center text-sm">
                {customersGrowth >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={customersGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(customersGrowth).toFixed(1)}%
                </span>
                <span className="ml-2 text-muted-foreground">so với kỳ trước</span>
              </div>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Giá trị đơn hàng trung bình
              </p>
              <h2 className="text-2xl font-bold">{averageOrderValue.toLocaleString('vi-VN')}đ</h2>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Xu hướng doanh thu</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={
                    selectedViewType === 'Ngày'
                      ? 'date'
                      : selectedViewType === 'Tuần'
                        ? 'week'
                        : 'month'
                  }
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'revenue')
                      return [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu'];
                    if (name === 'orders') return [value.toLocaleString('vi-VN'), 'Đơn hàng'];
                    if (name === 'customers') return [value.toLocaleString('vi-VN'), 'Khách hàng'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Doanh thu" />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Đơn hàng" />
                <Line type="monotone" dataKey="customers" stroke="#ffc658" name="Khách hàng" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Doanh thu theo danh mục</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Performing Shops */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Top cửa hàng doanh thu cao</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Shop A', revenue: 50000000 },
                { name: 'Shop B', revenue: 45000000 },
                { name: 'Shop C', revenue: 40000000 },
                { name: 'Shop D', revenue: 35000000 },
                { name: 'Shop E', revenue: 30000000 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']} />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
