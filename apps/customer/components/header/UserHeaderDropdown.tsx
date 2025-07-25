'use client';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { IconLogout, IconPackage, IconShoppingCart, IconUser } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const UserHeaderDropdown = () => {
  const { logout, account } = useAuth();
  const { cartGroups } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalCartItems = Object.values(cartGroups || {}).reduce(
    (total, shop) => total + (shop.items?.length || 0),
    0,
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative hidden lg:block">
      <button
        className="p-3 rounded-xl hover:bg-orange-50 transition-colors duration-200 group"
        onClick={() => setDropdownOpen((prev) => !prev)}
        title="Tài khoản"
      >
        <IconUser size={24} className="text-gray-600 group-hover:text-orange-600" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-orange-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <IconUser size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Xin chào!</p>
                <p className="text-sm text-gray-600">{account?.username}</p>
              </div>
            </div>
          </div>
          <div className="py-2">
            <Link
              href="/user"
              className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 text-gray-700"
            >
              <IconUser size={18} className="text-orange-500" />
              Hồ sơ cá nhân
            </Link>
            <Link
              href="/user/purchase"
              className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 text-gray-700"
            >
              <IconPackage size={18} className="text-orange-500" />
              Đơn hàng của tôi
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 text-gray-700"
            >
              <IconShoppingCart size={18} className="text-orange-500" />
              <span className="flex-1">Giỏ hàng</span>
              {totalCartItems > 0 && (
                <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                  {totalCartItems}
                </span>
              )}
            </Link>
            <div className="border-t border-orange-100 mt-2"></div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors duration-150"
            >
              <IconLogout size={18} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHeaderDropdown;
