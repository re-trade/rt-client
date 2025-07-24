'use client';

import AuthWrapper from '@/components/auth/AuthWrapper';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  AlertCircle,
  Banknote,
  FileText,
  Flag,
  LayoutDashboard,
  Package,
  Settings,
  Store,
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
      { title: 'Quản lý Category', icon: FileText, href: '/dashboard/category' },

    ],
  },
  {
    group: 'Tài chính',
    items: [
      //{ title: 'Doanh thu hệ thống', icon: DollarSign, href: '/dashboard/revenue' },
      { title: 'Báo cáo tài chính', icon: FileText, href: '/dashboard/financial' },
      { title: 'Yêu cầu rút tiền', icon: Banknote, href: '/dashboard/withdraw' },
    ],
  },
  {
    group: 'Hệ thống',
    items: [
      { title: 'Cài đặt hệ thống', icon: Settings, href: '/dashboard/settings' },
      { title: 'Quản lý cảnh báo', icon: AlertCircle, href: '/dashboard/alerts' },
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

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {state === 'expanded' && (
        <div className="w-64 shrink-0 transition-all duration-300">
          <Sidebar>
            <SidebarContent>
              <div className="px-4 py-6">
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Quản lý hệ thống</p>
              </div>

              {menuItems.map((group, index) => (
                <SidebarGroup key={index}>
                  <SidebarGroupLabel className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {group.group}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            isActive={pathname === item.href}
                            className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                          >
                            <Link href={item.href} className="flex items-center gap-3">
                              <item.icon className="h-5 w-5 text-gray-500" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </div>
      )}

      <main className="flex-grow p-8 transition-all duration-300">
        <div className="flex items-center gap-4 mb-8">
          <SidebarTrigger className="bg-white shadow-sm hover:bg-gray-50" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {menuItems.flatMap((g) => g.items).find((item) => item.href === pathname)?.title ||
                'Dashboard'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {pathname === '/dashboard' ? 'Tổng quan hệ thống' : 'Quản lý và giám sát'}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">{children}</div>
      </main>
    </div>
  );
}
