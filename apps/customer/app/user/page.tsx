'use client';

import {
  Activity,
  ArrowRight,
  Award,
  Bell,
  Calendar,
  Gift,
  Heart,
  MapPin,
  Package,
  ShoppingBag,
  Star,
  TrendingUp,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const UserDashboard = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Chào buổi sáng');
    else if (hour < 18) setGreeting('Chào buổi chiều');
    else setGreeting('Chào buổi tối');
  }, []);

  const stats = [
    {
      label: 'Sản phẩm đã mua',
      value: '24',
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Sản phẩm yêu thích',
      value: '12',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
    },
    {
      label: 'Điểm tích lũy',
      value: '1,847',
      icon: <Star className="w-6 h-6" />,
      color: 'from-amber-500 to-yellow-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
    {
      label: 'Sản phẩm đã trao đổi',
      value: '8',
      icon: <Gift className="w-6 h-6" />,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      subtitle: 'món đồ',
    },
  ];

  const recentActivities = [
    {
      title: 'Đơn hàng #RT2024001 đã được giao',
      time: '2 giờ trước',
      icon: <Package className="w-5 h-5 text-amber-600" />,
      status: 'success',
    },
    {
      title: 'Bạn có 1 thông báo mới',
      time: '5 giờ trước',
      icon: <Bell className="w-5 h-5 text-blue-600" />,
      status: 'info',
    },
    {
      title: 'Voucher giảm 20% sắp hết hạn',
      time: '1 ngày trước',
      icon: <Gift className="w-5 h-5 text-orange-600" />,
      status: 'warning',
    },
  ];

  const quickActions = [
    {
      title: 'Quản lý hồ sơ',
      description: 'Cập nhật thông tin cá nhân',
      icon: <User className="w-6 h-6" />,
      href: '/user/profile',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      title: 'Đơn hàng của tôi',
      description: 'Theo dõi đơn hàng',
      icon: <ShoppingBag className="w-6 h-6" />,
      href: '/user/purchase',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Địa chỉ giao hàng',
      description: 'Quản lý địa chỉ',
      icon: <MapPin className="w-6 h-6" />,
      href: '/user/address',
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Kho voucher',
      description: 'Xem ưu đãi hiện có',
      icon: <Gift className="w-6 h-6" />,
      href: '/user/vouchers',
      color: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                {greeting}, Vu! 👋
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Chào mừng bạn quay trở lại với cộng đồng trao đổi đồ cũ
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                Vu
              </div>
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <div className={stat.textColor}>{stat.icon}</div>
                </div>
                <TrendingUp className="w-5 h-5 text-amber-500 opacity-60" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              {stat.subtitle && <p className="text-xs text-amber-600 mt-1">{stat.subtitle}</p>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Activity className="w-6 h-6 mr-2 text-amber-600" />
                  Thao tác nhanh
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-r ${action.color} text-white shadow-lg`}
                      >
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 group-hover:text-amber-700 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                        <div className="flex items-center mt-2 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm font-medium">Xem chi tiết</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities & Achievements */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-amber-600" />
                Hoạt động gần đây
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="mt-1">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Card */}
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-lg p-6 border border-amber-200">
              <div className="flex items-center mb-4">
                <Award className="w-6 h-6 text-amber-700 mr-2" />
                <h2 className="text-lg font-bold text-amber-800">Thành tích</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">Đồ đã trao đổi</span>
                  <span className="font-bold text-amber-800">24 món</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">Người bạn trao đổi</span>
                  <span className="font-bold text-amber-800">15 người</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">Xếp hạng</span>
                  <span className="font-bold text-amber-800">🌟 Trader Pro</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/60 rounded-lg">
                <p className="text-xs text-amber-700 text-center">
                  "Mỗi lần trao đổi là một cơ hội kết nối và chia sẻ"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
