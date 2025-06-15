'use client';
import {
  Bell,
  ChevronRight,
  Edit3,
  Eye,
  MapPin,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  Ticket,
  User,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

type UserLayoutProps = {
  children: React.ReactNode;
};

type TRouterItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
  subMenu?: TRouterItem[];
};

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['profile']);

  const toggleMenu = (path: string) => {
    setExpandedMenus((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  };

  const handleNavigation = (path: string) => {
    router.push(`/user/${path}`);
  };

  const isActive = (item: TRouterItem) => {
    if (item.path === activeTab) return true;
    if (item.subMenu) {
      return item.subMenu.some((sub) => sub.path === activeTab);
    }
    return false;
  };

  const menuItems: TRouterItem[] = [
    {
      name: 'Thông Báo',
      icon: <Bell className="w-5 h-5" />,
      path: 'notification',
    },
    {
      name: 'Tài Khoản Của Tôi',
      icon: <User className="w-5 h-5" />,
      path: 'profile',
      subMenu: [
        { name: 'Hồ Sơ', icon: <User className="w-4 h-4" />, path: 'profile' },
        { name: 'Địa Chỉ', icon: <MapPin className="w-4 h-4" />, path: 'address' },
        { name: 'Bảo Mật', icon: <Shield className="w-4 h-4" />, path: 'security' },
        {
          name: 'Cài Đặt Thông Báo',
          icon: <Settings className="w-4 h-4" />,
          path: 'notification-settings',
        },
        { name: 'Payment Methods', icon: <Eye className="w-4 h-4" />, path: 'payment-methods' },
      ],
    },
    {
      name: 'Đơn Mua',
      icon: <ShoppingBag className="w-5 h-5" />,
      path: 'purchase',
    },
    {
      name: 'Kho Voucher',
      icon: <Ticket className="w-5 h-5" />,
      path: 'vouchers',
    },
  ];

  const activeTab = pathname.split('/user/')[1] || 'profile';

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex max-w-7xl mx-auto">
        {/* Enhanced Sidebar */}
        <aside className="w-80 bg-white shadow-xl border-r border-amber-100">
          {/* User Profile Header */}
          <div className="p-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  Vu
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-300 rounded-full border-2 border-white flex items-center justify-center">
                  <Star className="w-3 h-3" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">vominhvu2002</h2>
                <button className="flex items-center text-orange-100 hover:text-white transition-colors text-sm mt-1 group">
                  <Edit3 className="w-3 h-3 mr-1" />
                  <span>Sửa Hồ Sơ</span>
                  <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const isExpanded = expandedMenus.includes(item.path);
              const isItemActive = isActive(item);

              return (
                <div key={item.path} className="space-y-1">
                  <div
                    onClick={() =>
                      item.subMenu ? toggleMenu(item.path) : handleNavigation(item.path)
                    }
                    className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      isItemActive
                        ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 shadow-md border border-amber-200'
                        : 'hover:bg-gray-50 text-gray-700 hover:text-amber-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`transition-colors ${isItemActive ? 'text-amber-600' : 'text-gray-500 group-hover:text-amber-500'}`}
                      >
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.subMenu && (
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90' : ''
                        } ${isItemActive ? 'text-amber-600' : 'text-gray-400'}`}
                      />
                    )}
                  </div>

                  {/* Submenu */}
                  {item.subMenu && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="ml-6 space-y-1 border-l-2 border-amber-100 pl-4">
                        {item.subMenu.map((subItem) => (
                          <div
                            key={subItem.path}
                            onClick={() => handleNavigation(subItem.path)}
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              activeTab === subItem.path
                                ? 'bg-amber-50 text-amber-700 border-l-2 border-amber-500'
                                : 'hover:bg-gray-50 text-gray-600 hover:text-amber-600'
                            }`}
                          >
                            {subItem.icon}
                            <span className="text-sm font-medium">{subItem.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Feature Badge */}
          <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl border border-amber-200">
            <div className="flex items-center space-x-2 text-amber-700">
              <Star className="w-5 h-5" />
              <div>
                <p className="text-sm font-semibold">Thành viên VIP</p>
                <p className="text-xs text-amber-600">Chia sẻ và trao đổi thông minh</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="h-full bg-white">{children}</div>
        </main>
      </div>
    </div>
  );
}
