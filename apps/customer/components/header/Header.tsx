'use client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/use-auth';
import MobileMenu from '@components/header/MobileHeaderMenu';
import SearchBar from '@components/header/SearchBar';
import UserDropdown from '@components/header/UserHeaderDropdown';
import { IconBell, IconMenu2, IconShoppingCart, IconUser, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const { auth } = useAuth();
  const { cartGroups, loading } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const totalCartItems = Object.values(cartGroups || {}).reduce(
    (total, shop) => total + (shop.items?.length || 0),
    0,
  );

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-orange-100">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-2 text-sm flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <button className="text-orange-700 hover:text-orange-800 flex items-center gap-2 font-medium">
              <IconBell size={16} />
              Thông báo khuyến mãi
            </button>
            <span className="text-orange-600">|</span>
            <Link href="/help" className="text-orange-700 hover:text-orange-800 font-medium">
              Hỗ trợ khách hàng
            </Link>
          </div>
          {!auth && (
            <div className="flex items-center space-x-4 text-orange-700">
              <Link
                href="/login"
                className="hover:text-orange-800 flex items-center gap-2 font-medium"
              >
                <IconUser size={16} />
                Đăng nhập
              </Link>
              <span className="text-orange-400">|</span>
              <Link href="/register" className="hover:text-orange-800 font-medium">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
        >
          ReTrade
        </Link>

        <SearchBar />

        <div className="flex items-center space-x-2">
          {auth && (
            <Link
              href="/cart"
              className="relative p-3 hover:bg-orange-50 rounded-xl group"
              title="Giỏ hàng"
            >
              <IconShoppingCart
                size={24}
                className={`${
                  totalCartItems > 0
                    ? 'text-orange-600 group-hover:text-orange-700'
                    : 'text-gray-600 group-hover:text-orange-600'
                }`}
              />
              {totalCartItems > 0 && !loading && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {totalCartItems > 99 ? '99+' : totalCartItems}
                </span>
              )}
            </Link>
          )}

          {auth ? (
            <>
              <UserDropdown />
              <Link href="/user" className="lg:hidden p-3 hover:bg-orange-50 rounded-xl">
                <IconUser size={24} className="text-gray-600" />
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 font-medium shadow-lg"
            >
              <IconUser size={18} />
              Đăng nhập
            </Link>
          )}
          <button
            className="lg:hidden p-3 hover:bg-orange-50 rounded-xl"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <IconX size={24} className="text-gray-600" />
            ) : (
              <IconMenu2 size={24} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} setOpen={setMenuOpen} />
    </header>
  );
};

export default Header;
