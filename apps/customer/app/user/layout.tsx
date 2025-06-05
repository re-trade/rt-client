'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
type UserLayoutProps = {
  children: React.ReactNode;
};

type TRouterItem = {
  name: string;
  icon?: string;
  path: string;
  subMenu?: TRouterItem[];
};

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

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
    { name: 'Thông Báo', icon: 'bell', path: 'notification' },
    {
      name: 'Tài Khoản Của Tôi',
      icon: 'user',
      path: 'profile',
      subMenu: [
        { name: 'Hồ Sơ', path: 'profile' },
        { name: 'Địa Chỉ', path: 'address' },
        { name: 'Bảo Mật', path: 'security' },
        { name: 'Cài Đặt Thông Báo', path: 'notification-settings' },
        { name: 'Những Thiết Lập Riêng Tư', path: 'privacy-settings' },
      ],
    },
    { name: 'Đơn Mua', icon: 'shopping-cart', path: 'purchase' },
    { name: 'Kho Voucher', icon: 'ticket', path: 'vouchers' },
  ];

  const activeTab = pathname.split('/user/')[1] || 'profile';

  return (
    <div className="min-h-screen h-auto bg-gray-100 flex pl-1">
      <aside className="w-64 bg-white shadow-md p-4">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
            Vu
          </div>
          <div>
            <h2 className="text-gray-700 font-semibold">vominhvu2002</h2>
            <p className="text-gray-500 text-sm flex items-center">
              Sửa Hồ Sơ
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
                />
              </svg>
            </p>
          </div>
        </div>
        <nav>
          {menuItems.map((item) => {
            const isExpanded = expandedMenus.includes(item.path);
            return (
              <div key={item.path}>
                <div
                  onClick={() =>
                    item.subMenu ? toggleMenu(item.path) : handleNavigation(item.path)
                  }
                  className={`flex items-center justify-between p-2 mb-2 cursor-pointer rounded-lg ${
                    isActive(item)
                      ? 'bg-orange-100 text-orange-500'
                      : 'hover:bg-gray-100 text-black'
                  }`}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {item.icon === 'bell' && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        ></path>
                      )}
                      {item.icon === 'user' && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      )}
                      {item.icon === 'shopping-cart' && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      )}
                      {item.icon === 'ticket' && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a1 1 0 110 2v3a2 2 0 002 2h14a2 2 0 002-2v-3a1 1 0 110-2V7a2 2 0 00-2-2H5z"
                        ></path>
                      )}
                    </svg>
                    <span>{item.name}</span>
                  </div>
                  {item.subMenu && (
                    <svg
                      className="w-4 h-4 transform transition-transform duration-200"
                      style={{
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </div>
                {item.subMenu && isExpanded && (
                  <div className="pl-6">
                    {item.subMenu.map((subItem) => (
                      <div
                        key={subItem.path}
                        onClick={() => handleNavigation(subItem.path)}
                        className={`p-2 mb-2 cursor-pointer rounded-lg ${activeTab === subItem.path ? 'bg-orange-100 text-orange-500' : 'hover:bg-gray-100 text-black'}`}
                      >
                        {subItem.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
