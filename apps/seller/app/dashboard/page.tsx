'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  DollarSign,
  Eye,
  Minus,
  Package,
  PieChart,
  RefreshCw,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';
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
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const Dashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sample data
  const revenueData = [
    { month: 'T1', revenue: 25000000, orders: 180, customers: 150 },
    { month: 'T2', revenue: 28000000, orders: 210, customers: 180 },
    { month: 'T3', revenue: 32000000, orders: 245, customers: 220 },
    { month: 'T4', revenue: 29000000, orders: 220, customers: 200 },
    { month: 'T5', revenue: 35000000, orders: 280, customers: 250 },
    { month: 'T6', revenue: 38000000, orders: 310, customers: 280 },
    { month: 'T7', revenue: 42000000, orders: 350, customers: 320 },
    { month: 'T8', revenue: 39000000, orders: 320, customers: 290 },
    { month: 'T9', revenue: 45000000, orders: 380, customers: 340 },
    { month: 'T10', revenue: 48000000, orders: 410, customers: 370 },
    { month: 'T11', revenue: 52000000, orders: 450, customers: 410 },
    { month: 'T12', revenue: 55000000, orders: 480, customers: 440 },
  ];

  const orderStatusData = [
    { name: 'Đã giao hàng', value: 450, color: '#10b981' },
    { name: 'Đang giao', value: 120, color: '#3b82f6' },
    { name: 'Đang chuẩn bị', value: 80, color: '#f59e0b' },
    { name: 'Chờ xác nhận', value: 45, color: '#ef4444' },
    { name: 'Đã hủy', value: 25, color: '#6b7280' },
  ];

  const topProductsData = [
    { name: 'Áo thun nam', sales: 145, revenue: 43500000 },
    { name: 'Quần jeans', sales: 132, revenue: 79200000 },
    { name: 'Giày sneaker', sales: 98, revenue: 88200000 },
    { name: 'Váy maxi', sales: 87, revenue: 39150000 },
    { name: 'Áo khoác', sales: 76, revenue: 45600000 },
    { name: 'Túi xách', sales: 65, revenue: 32500000 },
  ];

  const dailyTrafficData = [
    { day: 'CN', visitors: 3200, pageviews: 8900 },
    { day: 'T2', visitors: 4100, pageviews: 12400 },
    { day: 'T3', visitors: 3800, pageviews: 11200 },
    { day: 'T4', visitors: 4500, pageviews: 13800 },
    { day: 'T5', visitors: 5200, pageviews: 15600 },
    { day: 'T6', visitors: 4800, pageviews: 14200 },
    { day: 'T7', visitors: 3600, pageviews: 9800 },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`}></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div
          className={`p-2 rounded-full bg-gradient-to-r ${color} opacity-20 group-hover:opacity-30 transition-opacity`}
        >
          <Icon className="h-4 w-4 text-gray-700" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="flex items-center gap-1 text-xs">
          {trend === 'up' ? (
            <ArrowUp className="h-3 w-3 text-green-500" />
          ) : trend === 'down' ? (
            <ArrowDown className="h-3 w-3 text-red-500" />
          ) : (
            <Minus className="h-3 w-3 text-gray-400" />
          )}
          <span
            className={`${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}
          >
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tổng quan Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Xem tổng quan về hoạt động kinh doanh của bạn</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">7 ngày qua</option>
              <option value="30d">30 ngày qua</option>
              <option value="90d">90 ngày qua</option>
              <option value="1y">1 năm qua</option>
            </select>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng sản phẩm"
            value="150"
            change="+12% so với tháng trước"
            icon={Package}
            color="from-blue-500 to-blue-600"
            trend="up"
          />
          <StatCard
            title="Doanh thu tháng"
            value="45,231,000đ"
            change="+20.1% so với tháng trước"
            icon={DollarSign}
            color="from-green-500 to-green-600"
            trend="up"
          />
          <StatCard
            title="Đơn hàng"
            value="1,250"
            change="+15% so với tháng trước"
            icon={ShoppingCart}
            color="from-purple-500 to-purple-600"
            trend="up"
          />
          <StatCard
            title="Tỷ lệ chuyển đổi"
            value="3.2%"
            change="+0.5% so với tháng trước"
            icon={TrendingUp}
            color="from-orange-500 to-orange-600"
            trend="up"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Khách hàng mới"
            value="+89"
            change="+25% so với tuần trước"
            icon={Users}
            color="from-teal-500 to-teal-600"
            trend="up"
          />
          <StatCard
            title="Lượt xem shop"
            value="12,543"
            change="+18% so với tuần trước"
            icon={Eye}
            color="from-indigo-500 to-indigo-600"
            trend="up"
          />
          <StatCard
            title="Đánh giá trung bình"
            value="4.8/5.0"
            change="+0.2 so với tháng trước"
            icon={Star}
            color="from-yellow-500 to-yellow-600"
            trend="up"
          />
          <StatCard
            title="Tỷ lệ hoàn hàng"
            value="2.1%"
            change="-0.3% so với tháng trước"
            icon={Activity}
            color="from-red-500 to-red-600"
            trend="down"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card className="bg-white shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Doanh thu theo tháng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis
                    stroke="#6b7280"
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Order Status Chart */}
          <Card className="bg-white shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Trạng thái đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="w-full lg:w-1/2">
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full lg:w-1/2 space-y-3">
                  {orderStatusData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products Chart */}
          <Card className="bg-white shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              <CardTitle>Top sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProductsData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#6b7280"
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Traffic Chart */}
          <Card className="bg-white shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
              <CardTitle>Lưu lượng truy cập theo ngày</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyTrafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pageviews"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Best Selling Products */}
          <Card className="bg-white shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
              <CardTitle>Sản phẩm bán chạy nhất</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  {
                    name: 'Áo thun nam',
                    sales: 45,
                    revenue: '13,455,000đ',
                    trend: '+12%',
                    image: '👕',
                  },
                  {
                    name: 'Quần jeans nữ',
                    sales: 32,
                    revenue: '19,168,000đ',
                    trend: '+8%',
                    image: '👖',
                  },
                  {
                    name: 'Giày sneaker',
                    sales: 28,
                    revenue: '16,800,000đ',
                    trend: '+15%',
                    image: '👟',
                  },
                  {
                    name: 'Váy maxi',
                    sales: 24,
                    revenue: '10,800,000đ',
                    trend: '+5%',
                    image: '👗',
                  },
                ].map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {product.image}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} đã bán</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{product.revenue}</p>
                      <p className="text-sm text-green-600 font-medium">{product.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="bg-white shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <CardTitle>Đơn hàng gần đây</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  {
                    id: 'ORD-001',
                    customer: 'Nguyễn Văn A',
                    amount: '299,000đ',
                    status: 'Đã giao',
                    time: '2 giờ trước',
                    color: 'bg-green-500',
                  },
                  {
                    id: 'ORD-002',
                    customer: 'Trần Thị B',
                    amount: '599,000đ',
                    status: 'Đang giao',
                    time: '4 giờ trước',
                    color: 'bg-blue-500',
                  },
                  {
                    id: 'ORD-003',
                    customer: 'Lê Văn C',
                    amount: '199,000đ',
                    status: 'Đang xử lý',
                    time: '6 giờ trước',
                    color: 'bg-yellow-500',
                  },
                  {
                    id: 'ORD-004',
                    customer: 'Phạm Thị D',
                    amount: '450,000đ',
                    status: 'Đã xác nhận',
                    time: '8 giờ trước',
                    color: 'bg-purple-500',
                  },
                ].map((order, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 ${order.color} rounded-full flex items-center justify-center`}
                      >
                        <ShoppingCart className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{order.amount}</p>
                      <p className="text-sm text-gray-500">{order.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
