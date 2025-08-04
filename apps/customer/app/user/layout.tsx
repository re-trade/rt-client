'use client';
import { useCustomerProfile } from '@/hooks/use-customer-profile';
import {
  Bell,
  ChevronRight,
  Edit3,
  Eye,
  MapPin,
  Menu,
  Settings,
  Shield,
  ShoppingBag,
  User,
  Wallet,
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
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
      subMenu: [
        {name : 'Đơn Mua Của Tôi', icon: <ShoppingBag className="w-4 h-4" />, path: 'purchase'},
        {name: 'Đánh giá Sản Phẩm', icon: <Eye className="w-4 h-4" />, path: 'review'},
      ]
    },
    {
      name: 'Ví của tôi',
      icon: <Wallet className="w-5 h-5" />,
      path: 'wallet',
    },
  ];

  const activeTab = pathname.split('/user/')[1] || 'profile';

  const getInitials = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
    }
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    if (profile?.email) {
      return profile.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const renderAvatar = (size: string) => {
    if (
      profile?.avatarUrl &&
      typeof profile.avatarUrl === 'string' &&
      (profile.avatarUrl.startsWith('http') || profile.avatarUrl.startsWith('/'))
    ) {
      return (
        <img
          src={profile.avatarUrl}
          alt="User avatar"
          className={`${size} object-cover rounded-xl`}
        />
      );
    }
    return (
      <div
        className={`${size} bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md`}
      >
        {getInitials()}
      </div>
    );
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative">
            {renderAvatar('w-12 h-12 sm:w-16 sm:h-16 text-lg sm:text-xl')}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              {profile?.username ?? 'N/A'}
            </h2>
            <button
              onClick={() => router.push('/user/profile')}
              className="flex items-center text-gray-600 hover:text-orange-600 transition-colors text-xs sm:text-sm mt-1 group"
            >
              <Edit3 className="w-3 h-3 mr-1 flex-shrink-0 text-orange-500" />
              <span className="truncate">Sửa Hồ Sơ</span>
              <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform flex-shrink-0 text-orange-400" />
            </button>
          </div>
        </div>
      </div>
      <nav className="p-3 sm:p-4 space-y-2">
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
                    className={`transition-colors flex-shrink-0 ${
                      isItemActive ? 'text-[#121212]' : 'text-[#525252] group-hover:text-[#121212]'
                    }`}
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
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-orange-50">
      <div className="lg:hidden bg-white shadow-md border-b border-orange-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {renderAvatar('w-8 h-8 text-sm')}
            <div>
              <h2 className="text-sm font-semibold text-gray-800 truncate">
                {profile?.username ?? 'N/A'}
              </h2>
            </div>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-orange-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        <aside className="hidden lg:block w-80 bg-white shadow-md border-r border-orange-200">
          <SidebarContent />
        </aside>

        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <aside className="relative w-80 max-w-[85vw] bg-white shadow-xl">
              <SidebarContent />
            </aside>
          </div>
        )}
        <main className="flex-1 min-h-screen">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
