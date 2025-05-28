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
import { DollarSign, LayoutDashboard, MapPin, Package, Store, Ticket, Truck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';

const menuItems = [
  { title: 'Tổng quan', icon: LayoutDashboard, href: '/dashboard' },
  { title: 'Quản lý sản phẩm', icon: Package, href: '/dashboard/product-management' },
  { title: 'Quản lý doanh thu', icon: DollarSign, href: '/dashboard/revenue-management' },
  { title: 'Quản lý voucher', icon: Ticket, href: '/dashboard/voucher-management' },
  { title: 'Phương thức vận chuyển', icon: Truck, href: '/dashboard/shipping-management' },
  { title: 'Quản lý địa chỉ', icon: MapPin, href: '/dashboard/address-management' },
  { title: 'Thông tin shop', icon: Store, href: '/dashboard/shop-info-management' },
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
