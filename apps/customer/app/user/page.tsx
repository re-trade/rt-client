'use client';

import { useCustomerProfile } from '@/hooks/use-customer-profile';
import {
  Activity,
  ArrowRight,
  Bell,
  Calendar,
  Gift,
  Heart,
  MapPin,
  Package,
  ShoppingBag,
  TrendingUp,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const UserDashboard = () => {
  const [greeting, setGreeting] = useState('');
  const { profile } = useCustomerProfile();

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
      icon: <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Sản phẩm yêu thích',
      value: '12',
      icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Đơn hàng đã đặt',
      value: '5',
      icon: <Package className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Sản phẩm đã trao đổi',
      value: '8',
      icon: <Gift className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      subtitle: 'món đồ',
    },
  ];

  const recentActivities = [
    {
      title: 'Đơn hàng #RT2024001 đã được giao',
      time: '2 giờ trước',
      icon: <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#121212]" />,
      status: 'success',
    },
    {
      title: 'Bạn có 1 thông báo mới',
      time: '5 giờ trước',
      icon: <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#121212]" />,
      status: 'info',
    },
    {
      title: 'Voucher giảm 20% sắp hết hạn',
      time: '1 ngày trước',
      icon: <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-[#121212]" />,
      status: 'warning',
    },
  ];

  const quickActions = [
    {
      title: 'Quản lý hồ sơ',
      description: 'Cập nhật thông tin cá nhân',
      icon: <User className="w-5 h-5 sm:w-6 sm:h-6" />,
      href: '/user/profile',
    },
    {
      title: 'Đơn hàng của tôi',
      description: 'Theo dõi đơn hàng',
      icon: <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />,
      href: '/user/purchase',
    },
    {
      title: 'Địa chỉ giao hàng',
      description: 'Quản lý địa chỉ',
      icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />,
      href: '/user/address',
    },
    {
      title: 'Kho voucher',
      description: 'Xem ưu đâi hiện có',
      icon: <Gift className="w-5 h-5 sm:w-6 sm:h-6" />,
      href: '/user/vouchers',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-orange-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8 border border-orange-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                {greeting}, {profile?.firstName + ' ' + profile?.lastName} 👋
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
                Chào mừng bạn quay trở lại với nền tảng buôn bán đồ cũ
              </p>
            </div>
            <div className="flex-shrink-0 self-center sm:self-auto">
              <div className="avatar">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl">
                  {profile?.avatarUrl &&
                  typeof profile.avatarUrl === 'string' &&
                  (profile.avatarUrl.startsWith('http') || profile.avatarUrl.startsWith('/')) ? (
                    <img
                      src={profile.avatarUrl}
                      alt="User avatar"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white text-lg sm:text-xl font-bold rounded-xl">
                      {profile?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-3 sm:p-4 lg:p-6 border border-orange-200 hover:shadow-lg hover:border-orange-300 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <div
                  className={`p-2 sm:p-2.5 lg:p-3 rounded-lg ${stat.bgColor} border border-orange-200`}
                >
                  <div className={stat.color}>{stat.icon}</div>
                </div>
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 opacity-60" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm font-medium leading-tight">
                {stat.label}
              </p>
              {stat.subtitle && <p className="text-xs text-gray-800 mt-1">{stat.subtitle}</p>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 lg:p-6 border border-orange-200">
              <div className="flex items-center justify-between mb-4 sm:mb-5 lg:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-500" />
                  Thao tác nhanh
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer p-3 sm:p-4 rounded-lg border border-orange-200 hover:border-orange-400 hover:shadow-md transition-all duration-300 bg-white"
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-2.5 lg:p-3 rounded-lg bg-orange-100 text-orange-600 shadow-md flex-shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        {action.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors text-sm sm:text-base">
                          {action.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-tight">
                          {action.description}
                        </p>
                        <div className="flex items-center mt-2 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs sm:text-sm font-medium">Xem chi tiết</span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 lg:p-6 border border-orange-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-500" />
                Hoạt động gần đây
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <div className="mt-0.5 sm:mt-1 flex-shrink-0">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-800 leading-tight">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl shadow-md p-4 sm:p-5 lg:p-6 border border-orange-200">
              <div className="flex items-center mb-3 sm:mb-4">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mr-2" />
                <h2 className="text-base sm:text-lg font-bold text-gray-800">Thông báo gần đây</h2>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="p-2 sm:p-3 bg-white rounded-lg border border-orange-100">
                  <p className="text-xs sm:text-sm text-gray-800 font-medium">
                    Cập nhật đơn hàng #RT20240415
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Đơn hàng đã được xác nhận</p>
                </div>
                <div className="p-2 sm:p-3 bg-white rounded-lg border border-orange-100">
                  <p className="text-xs sm:text-sm text-gray-800 font-medium">Khuyến mãi mới</p>
                  <p className="text-xs text-gray-600 mt-1">Giảm 15% cho đơn hàng trên 500k</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 text-center">
                <a
                  href="#"
                  className="text-xs text-orange-600 font-medium hover:text-orange-700 hover:underline transition-colors"
                >
                  Xem tất cả thông báo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
