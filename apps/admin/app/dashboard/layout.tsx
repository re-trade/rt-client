'use client';

import AuthWrapper from '@/components/auth/AuthWrapper';
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  Banknote,
  FileText,
  Flag,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Tag,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';

const menuItems = [
  {
    group: 'Tổng quan',
    items: [{ title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' }],
  },
  {
    group: 'Quản lý',
    items: [
      { title: 'Quản lý sản phẩm', icon: Package, href: '/dashboard/product' },
      { title: 'Quản lý người dùng', icon: Users, href: '/dashboard/user' },
      { title: 'Quản lý khách hàng', icon: User, href: '/dashboard/customer' },
      { title: 'Quản lý người bán', icon: Store, href: '/dashboard/seller' },
      { title: 'Quản lý tố cáo', icon: Flag, href: '/dashboard/report-seller' },
      { title: 'Quản lý đơn hàng', icon: ShoppingCart, href: '/dashboard/order' },

      { title: 'Quản lý Danh Mục', icon: FileText, href: '/dashboard/category' },
      { title: 'Quản lý nhãn hàng', icon: Tag, href: '/dashboard/brand' },
    ],
  },
  {
    group: 'Tài chính',
    items: [
      // { title: 'Báo cáo tài chính', icon: FileText, href: '/dashboard/financial' },
      { title: 'Yêu cầu rút tiền', icon: Banknote, href: '/dashboard/withdraw' },
    ],
  },
  {
    group: 'Hệ thống',
    items: [
      { title: 'Cài đặt phí nền tảng', icon: Settings, href: '/dashboard/platform-fee' },
      //{ title: 'Quản lý cảnh báo', icon: AlertCircle, href: '/dashboard/alerts' },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthWrapper>
      <SidebarProvider>
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </AuthWrapper>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {state === 'expanded' && (
        <div className="w-56 shrink-0 transition-all duration-300 hidden md:block">
          <div className="h-full bg-gradient-to-b from-white to-orange-50 border-r border-orange-200 shadow-sm flex flex-col">
            <div className="p-4">
              <h2 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2">
                ReTrade Admin
              </h2>
              <p className="text-xs text-gray-600">Quản lý hệ thống</p>
            </div>

            <div className="flex-1 px-4 space-y-3 overflow-y-auto">
              {menuItems.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-1">
                  <h3 className="text-xs font-semibold text-orange-600 uppercase tracking-wider px-2 py-1">
                    {group.group}
                  </h3>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                          pathname === item.href
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-white hover:shadow-sm hover:text-orange-600',
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-4 w-4 flex-shrink-0',
                            pathname === item.href ? 'text-white' : 'text-gray-600',
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Logout Button at Bottom */}
            <div className="p-4 border-t border-orange-200">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow p-6 transition-all duration-300 pb-24 md:pb-6 overflow-auto bg-gray-50">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger className="md:flex hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md border-none" />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {menuItems.flatMap((g) => g.items).find((item) => item.href === pathname)?.title ||
                'Dashboard'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {pathname === '/dashboard' ? 'Tổng quan hệ thống' : 'Quản lý và giám sát'}
            </p>
          </div>
        </div>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-30">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-t border-orange-200 shadow-lg">
          <nav className="flex justify-around items-center h-16 px-2">
            {menuItems
              .flatMap((group) => group.items)
              .slice(0, 4)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-all duration-200',
                    pathname === item.href
                      ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md'
                      : 'text-gray-700 hover:bg-white hover:shadow-sm hover:text-orange-600',
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5',
                      pathname === item.href ? 'text-white' : 'text-gray-600',
                    )}
                  />
                  <span className="text-xs mt-1 font-medium">{item.title.split(' ')[0]}</span>
                </Link>
              ))}
            {/* Mobile Logout Button */}
            <button
              onClick={logout}
              className="flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">Thoát</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
