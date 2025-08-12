'use client';

import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  ChevronDown,
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
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';

const menuItems = [
  {
    group: 'Tổng quan',
    items: [
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
    ],
  },
  {
    group: 'Thông tin người bán',
    items: [
      {
        title: 'Thông tin người bán',
        icon: Store,
        href: '/dashboard/seller-info',
      },
      {
        title: 'Quản lý đánh giá',
        icon: Star,
        href: '/dashboard/review',
      },
    ],
  },
  {
    group: 'Sản phẩm & Đơn hàng',
    items: [
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
        title: 'Đơn hàng của tôi',
        icon: ShoppingCart,
        href: '/dashboard/my-order',
      },
    ],
  },
  {
    group: 'Liên hệ & Hỗ trợ',
    items: [
      {
        title: 'Chat với khách hàng',
        icon: MessageCircle,
        href: '/dashboard/chat',
      },
      {
        title: 'Báo cáo',
        icon: AlertCircle,
        href: '/dashboard/report',
      },
    ],
  },
  // {
  //   group: 'Cấu hình thêm',
  //   items: [
  //     {
  //       title: 'Quản lý voucher',
  //       icon: Ticket,
  //       href: '/dashboard/voucher-management',
  //     },
  //     {
  //       title: 'Phương thức vận chuyển',
  //       icon: Truck,
  //       href: '/dashboard/shipping-management',
  //     },
  //     {
  //       title: 'Quản lý địa chỉ',
  //       icon: MapPin,
  //       href: '/dashboard/address-management',
  //     },
  //     {
  //       title: 'Bảo mật',
  //       icon: ShieldEllipsis,
  //       href: '/dashboard/security',
  //     },
  //   ],
  // },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sellerStatus } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (
    (sellerStatus?.banned || sellerStatus?.registerFailed) &&
    pathname !== '/dashboard/seller-info'
  ) {
    router.push('/dashboard/seller-info');
    return null;
  }

  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { handleLogout, sellerStatus } = useAuth();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (index: number) => {
    setOpenGroups((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    const activeGroup = menuItems.findIndex((group) =>
      group.items.some((item) => item.href === pathname),
    );
    if (activeGroup !== -1) {
      setOpenGroups((prev) => ({
        ...prev,
        [activeGroup]: true,
      }));
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {state === 'expanded' && (
        <div className="w-64 shrink-0 transition-all duration-300 hidden md:block">
          <div className="h-full bg-gradient-to-r from-white to-orange-50 border-r border-orange-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
                Dashboard Người Bán
              </h2>
              <div className="space-y-4 mt-6">
                {menuItems.map((group, groupIndex) => {
                  if (
                    (sellerStatus?.banned || sellerStatus?.registerFailed) &&
                    group.group !== 'Thông tin người bán'
                  ) {
                    return null;
                  }

                  const filteredItems =
                    (sellerStatus?.banned || sellerStatus?.registerFailed) &&
                    group.group === 'Thông tin người bán'
                      ? group.items.filter((item) => item.href === '/dashboard/seller-info')
                      : group.items;

                  if (filteredItems.length === 0) {
                    return null;
                  }

                  return (
                    <div key={groupIndex} className="space-y-1">
                      <button
                        onClick={() => toggleGroup(groupIndex)}
                        className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-orange-50 rounded-lg"
                      >
                        <span>{group.group}</span>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform duration-200',
                            openGroups[groupIndex] ? 'transform rotate-180' : '',
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          'space-y-1 overflow-hidden transition-all duration-200',
                          openGroups[groupIndex] ? 'max-h-96' : 'max-h-0',
                        )}
                      >
                        {filteredItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                              pathname === item.href
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600',
                            )}
                          >
                            <item.icon
                              className={cn('h-5 w-5', pathname === item.href ? 'text-white' : '')}
                            />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 hover:shadow-sm w-full text-left mt-6 border border-red-100"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow p-6 transition-all duration-300 pb-24 md:pb-6 overflow-auto bg-gray-50">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger className="md:flex hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md border-none" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            {menuItems.flatMap((group) => group.items).find((item) => item.href === pathname)
              ?.title || 'Dashboard'}
          </h1>
        </div>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-30">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-t border-orange-200 shadow-lg">
          <nav className="flex justify-around items-center h-16 px-2">
            {menuItems
              .flatMap((group) => {
                // Filter out non-seller-info items if banned or registration failed
                if (sellerStatus?.banned || sellerStatus?.registerFailed) {
                  if (group.group === 'Thông tin người bán') {
                    return group.items.filter((item) => item.href === '/dashboard/seller-info');
                  }
                  return [];
                }
                return group.items;
              })
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

            <button
              className="flex flex-col items-center justify-center px-2 py-2 text-gray-700 hover:bg-white hover:shadow-sm hover:text-orange-600 rounded-lg transition-all duration-200"
              onClick={() => {
                document.body.classList.add('overflow-hidden');
                document.getElementById('mobile-menu-drawer')?.classList.remove('translate-x-full');
              }}
            >
              <Package className="h-5 w-5 text-gray-600" />
              <span className="text-xs mt-1 font-medium">Khác</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-menu-drawer"
        className="fixed inset-0 bg-black/50 z-50 transform translate-x-full transition-transform duration-300 md:hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            document.body.classList.remove('overflow-hidden');
            document.getElementById('mobile-menu-drawer')?.classList.add('translate-x-full');
          }
        }}
      >
        <div className="absolute right-0 top-0 bottom-0 w-3/4 max-w-xs bg-gradient-to-r from-white to-orange-50 shadow-xl p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Menu
            </h3>
            <button
              className="p-2 rounded-full hover:bg-orange-100 text-orange-600"
              onClick={() => {
                document.body.classList.remove('overflow-hidden');
                document.getElementById('mobile-menu-drawer')?.classList.add('translate-x-full');
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {menuItems.map((group, groupIndex) => {
              if (
                (sellerStatus?.banned || sellerStatus?.registerFailed) &&
                group.group !== 'Thông tin người bán'
              ) {
                return null;
              }

              const filteredItems =
                (sellerStatus?.banned || sellerStatus?.registerFailed) &&
                group.group === 'Thông tin người bán'
                  ? group.items.filter((item) => item.href === '/dashboard/seller-info')
                  : group.items;

              if (filteredItems.length === 0) {
                return null;
              }

              return (
                <div key={groupIndex} className="space-y-1">
                  <button
                    onClick={() => toggleGroup(groupIndex)}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-orange-50 rounded-lg"
                  >
                    <span>{group.group}</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        openGroups[groupIndex] ? 'transform rotate-180' : '',
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'space-y-1 overflow-hidden transition-all duration-200',
                      openGroups[groupIndex] ? 'max-h-96' : 'max-h-0',
                    )}
                  >
                    {filteredItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                          pathname === item.href
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                            : 'text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600',
                        )}
                        onClick={() => {
                          document.body.classList.remove('overflow-hidden');
                          document
                            .getElementById('mobile-menu-drawer')
                            ?.classList.add('translate-x-full');
                        }}
                      >
                        <item.icon
                          className={cn('h-5 w-5', pathname === item.href ? 'text-white' : '')}
                        />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => {
                handleLogout();
                document.body.classList.remove('overflow-hidden');
                document.getElementById('mobile-menu-drawer')?.classList.add('translate-x-full');
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 hover:shadow-sm w-full text-left mt-4 border border-red-100"
            >
              <LogOut className="h-5 w-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
