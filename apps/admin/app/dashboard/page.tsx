'use client';

import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { Package, ShoppingCart, Store, Tag, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-center mb-4">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
    <div className="text-center">
      <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  </div>
);

const quickActions = [
  { href: '/dashboard/customer', label: 'Người dùng', icon: Users },
  { href: '/dashboard/seller', label: 'Người bán', icon: Store },
  { href: '/dashboard/product', label: 'Sản phẩm', icon: Package },
  { href: '/dashboard/order', label: 'Đơn hàng', icon: ShoppingCart },
];

function QuickActions() {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Thao tác nhanh</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              prefetch
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

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
      <div className="bg-blue-500 text-white rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Tổng quan hệ thống</h1>
        <p className="text-lg opacity-90">Xem tổng quan về hoạt động của hệ thống admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Tổng số người dùng"
          value={stats.totalCustomers.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="Người bán đang hoạt động"
          value={stats.totalSellers.toLocaleString()}
          icon={Store}
        />
        <StatCard
          title="Sản phẩm đang bán"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
        />
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
        />
        <StatCard
          title="Danh mục sản phẩm"
          value={stats.totalCategories.toLocaleString()}
          icon={Tag}
        />
      </div>

      {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Hoạt động gần đây
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 rounded-full mt-2 bg-green-500"></div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">
                Hệ thống hoạt động bình thường
              </p>
              <p className="text-xs text-gray-500">
                Tất cả các dịch vụ đang hoạt động ổn định
              </p>
              <p className="text-xs text-gray-400">2 phút trước</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 rounded-full mt-2 bg-green-500"></div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">
                Cập nhật dữ liệu thành công
              </p>
              <p className="text-xs text-gray-500">
                Đã cập nhật thống kê dashboard từ API
              </p>
              <p className="text-xs text-gray-400">5 phút trước</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 rounded-full mt-2 bg-blue-500"></div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">
                Hệ thống admin online
              </p>
              <p className="text-xs text-gray-500">
                Admin dashboard đang hoạt động bình thường
              </p>
              <p className="text-xs text-gray-400">10 phút trước</p>
            </div>
          </div>
        </div>
      </div> */}

      <QuickActions />
    </div>
  );
}
