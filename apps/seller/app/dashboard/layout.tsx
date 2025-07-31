'use client';

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
import { useAuth } from '@/context/AuthContext';
import {
  DollarSign,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Package,
  ShoppingCart,
  Star,
  Store,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';

const menuItems = [
  {
    title: 'Tổng quan',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Quản lý doanh thu',
    icon: DollarSign,
    href: '/dashboard/revenue',
  },
  {
    title: 'Thông tin seller',
    icon: Store,
    href: '/dashboard/seller-info',
  },
  {
    title: 'Quản lý đánh giá',
    icon: Star,
    href: '/dashboard/review',
  },
  {
    title: 'Quản lý sản phẩm',
    icon: Package,
    href: '/dashboard/product',
  },
  {
    title: 'Quản lý đơn hàng',
    icon: ShoppingCart,
    href: '/dashboard/orders',
  },
  {
    title: 'Chat với khách hàng',
    icon: MessageCircle,
    href: '/dashboard/chat',
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { handleLogout } = useAuth();

  return (
    <div className="flex min-h-screen w-full">
      {state === 'expanded' && (
        <div className="w-64 shrink-0 transition-all duration-300">
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Dashboard Người Bán</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={pathname === item.href}>
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Đăng xuất</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </div>
      )}

      <main className="flex-grow p-6 transition-all duration-300">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">
            {menuItems.find((item) => item.href === pathname)?.title || 'Dashboard'}
          </h1>
        </div>
        {children}
      </main>
    </div>
  );
}
