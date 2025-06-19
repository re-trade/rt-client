'use client';
import { useCustomerProfile } from '@/hooks/use-customer-profile';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Edit3,
  Eye,
  MapPin,
  Menu,
  Settings,
  Shield,
  ShoppingBag,
  Ticket,
  User,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { profile } = useCustomerProfile();

  const toggleMenu = (path: string) => {
    setExpandedMenus((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  };

  const handleNavigation = (path: string) => {
    router.push(`/user/${path}`);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
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
        {
          name: 'Phương Thức Thanh Toán',
          icon: <Eye className="w-4 h-4" />,
          path: 'payment-methods',
        },
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

  const Sidebar = () => (
    <aside className="w-full lg:w-80 bg-white shadow-md border-r border-[#525252]/20">
      <div className="p-4 sm:p-6 bg-[#FFD2B2] text-[#121212]">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center text-[#121212] text-lg sm:text-xl font-bold shadow-md">
              {profile?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold truncate">
              {profile?.username ?? 'N/A'}
            </h2>
            <button
              onClick={() => {
                router.push('/user/profile');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center text-[#121212] hover:underline transition-colors text-xs sm:text-sm mt-1 group"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              <span>Sửa Hồ Sơ</span>
              <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      <nav className="p-3 sm:p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {menuItems.map((item) => {
          const isExpanded = expandedMenus.includes(item.path);
          const isItemActive = isActive(item);

          return (
            <div key={item.path} className="space-y-1">
              <div
                onClick={() => (item.subMenu ? toggleMenu(item.path) : handleNavigation(item.path))}
                className={`group flex items-center justify-between p-2 sm:p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  isItemActive
                    ? 'bg-[#FFD2B2] text-[#121212] shadow-sm border border-[#525252]/20'
                    : 'hover:bg-[#FDFEF9] text-[#525252] hover:text-[#121212]'
                }`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <div
                    className={`transition-colors flex-shrink-0 ${isItemActive ? 'text-[#121212]' : 'text-[#525252] group-hover:text-[#121212]'}`}
                  >
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm sm:text-base truncate">{item.name}</span>
                </div>
                {item.subMenu && (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                      isExpanded ? 'rotate-90' : ''
                    } ${isItemActive ? 'text-[#121212]' : 'text-[#525252]'}`}
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
                  <div className="ml-4 sm:ml-6 space-y-1 border-l-2 border-[#525252]/20 pl-3 sm:pl-4">
                    {item.subMenu.map((subItem) => (
                      <div
                        key={subItem.path}
                        onClick={() => handleNavigation(subItem.path)}
                        className={`flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          activeTab === subItem.path
                            ? 'bg-[#FFD2B2]/30 text-[#121212] border-l-2 border-[#FFD2B2]'
                            : 'hover:bg-[#FDFEF9] text-[#525252] hover:text-[#121212]'
                        }`}
                      >
                        <div className="flex-shrink-0">{subItem.icon}</div>
                        <span className="text-xs sm:text-sm font-medium truncate">
                          {subItem.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#FDFEF9]">
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden bg-white border-b border-[#525252]/20 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#FFD2B2] rounded-xl flex items-center justify-center text-[#121212] text-lg font-bold">
              {profile?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#121212]">
                {profile?.username ?? 'Tài khoản'}
              </h2>
              <p className="text-xs text-[#525252]">Quản lý tài khoản</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-[#FDFEF9] transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#121212]" />
            ) : (
              <Menu className="w-6 h-6 text-[#121212]" />
            )}
          </button>
        </div>

        {/* Expanded Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <div className="border-t border-[#525252]/20 bg-[#FDFEF9]">
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
                          ? 'bg-[#FFD2B2] text-[#121212] shadow-sm'
                          : 'hover:bg-white text-[#525252] hover:text-[#121212]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`transition-colors flex-shrink-0 ${
                            isItemActive
                              ? 'text-[#121212]'
                              : 'text-[#525252] group-hover:text-[#121212]'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <span className="font-medium text-sm truncate">{item.name}</span>
                      </div>
                      {item.subMenu && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                            isExpanded ? 'rotate-180' : ''
                          } ${isItemActive ? 'text-[#121212]' : 'text-[#525252]'}`}
                        />
                      )}
                    </div>

                    {/* Mobile Submenu */}
                    {item.subMenu && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="ml-6 space-y-1 border-l-2 border-[#FFD2B2]/30 pl-4">
                          {item.subMenu.map((subItem) => (
                            <div
                              key={subItem.path}
                              onClick={() => handleNavigation(subItem.path)}
                              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                activeTab === subItem.path
                                  ? 'bg-[#FFD2B2]/30 text-[#121212]'
                                  : 'hover:bg-white text-[#525252] hover:text-[#121212]'
                              }`}
                            >
                              <div className="flex-shrink-0">{subItem.icon}</div>
                              <span className="text-sm font-medium truncate">{subItem.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-screen w-full lg:w-auto">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
