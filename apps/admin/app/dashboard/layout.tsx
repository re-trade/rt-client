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
  /* {
    group: 'Hệ thống',
    items: [
      //{ title: 'Cài đặt hệ thống', icon: Settings, href: '/dashboard/settings' },
      //{ title: 'Quản lý cảnh báo', icon: AlertCircle, href: '/dashboard/alerts' },
    ],
  }, */
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
        <div className="w-64 shrink-0 transition-all duration-300 hidden md:block">
          <div className="h-full bg-gradient-to-r from-white to-orange-50 border-r border-orange-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
                Admin Dashboard
              </h2>
              <p className="text-sm text-gray-600 mt-1">Quản lý hệ thống</p>

              <div className="space-y-4 mt-6">
                {menuItems.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-2">
                    <h3 className="text-xs font-semibold text-orange-600 uppercase tracking-wider px-2">
                      {group.group}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                            pathname === item.href
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                              : 'text-gray-700 hover:bg-white hover:shadow-sm hover:text-orange-600',
                          )}
                        >
                          <item.icon
                            className={cn(
                              'h-4 w-4',
                              pathname === item.href ? 'text-white' : 'text-gray-600',
                            )}
                          />
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow p-6 transition-all duration-300 pb-24 md:pb-6 overflow-auto bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:flex hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md border-none" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {menuItems.flatMap((g) => g.items).find((item) => item.href === pathname)?.title ||
                'Dashboard'}
            </h1>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-30">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-t border-orange-200 shadow-lg">
          <nav className="flex justify-around items-center h-16 px-2">
            {menuItems
              .flatMap((group) => group.items)
              .slice(0, 5)
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
          </nav>
        </div>
      </div>
    </div>
  );
}
