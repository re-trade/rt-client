"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
} from "@/components/ui/sidebar"
import { Package, DollarSign, Ticket, Truck, MapPin, Store, LayoutDashboard } from "lucide-react"

const menuItems = [
    {
    title: "Tổng quan",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Quản lý doanh thu",
    icon: DollarSign,
    href: "/dashboard/revenue-management",
  },
   {
    title: "Thông tin shop",
    icon: Store,
    href: "/dashboard/shop-info-management",
  },

  {
    title: "Quản lý sản phẩm",
    icon: Package,
    href: "/dashboard/product-management",
  },
  
  {
    title: "Quản lý voucher",
    icon: Ticket,
    href: "/dashboard/voucher-management",
  },
  {
    title: "Phương thức vận chuyển",
    icon: Truck,
    href: "/dashboard/shipping-management",
  },
  {
    title: "Quản lý địa chỉ",
    icon: MapPin,
    href: "/dashboard/address-management",
  },
 
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
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

        <main className="flex-1 p-6">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">
              {menuItems.find((item) => item.href === pathname)?.title || "Dashboard"}
            </h1>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
