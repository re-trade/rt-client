'use client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/use-auth';
import {
  IconBell,
  IconClock,
  IconLogout,
  IconMenu2,
  IconPackage,
  IconSearch,
  IconShoppingCart,
  IconUser,
  IconX,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const Header: React.FC = () => {
  const { auth, logout } = useAuth();
  const { cartGroups, loading: cartLoading } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Calculate total cart items count
  const getTotalCartItems = () => {
    if (!cartGroups || Object.keys(cartGroups).length === 0) {
      return 0;
    }

    return Object.values(cartGroups).reduce((total, shop) => {
      return total + (shop.items?.length || 0);
    }, 0);
  };

  const totalCartItems = getTotalCartItems();

  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!search.trim()) return;
    const newHistory = [search, ...searchHistory.filter((h) => h !== search)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setSearch('');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-orange-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <button className="text-orange-700 hover:text-orange-800 transition-colors duration-200 flex items-center gap-2 font-medium">
                <IconBell size={16} />
                Thông báo khuyến mãi
              </button>
              <span className="text-orange-600">|</span>
              <Link
                href="/help"
                className="text-orange-700 hover:text-orange-800 transition-colors duration-200 font-medium"
              >
                Hỗ trợ khách hàng
              </Link>
            </div>
            {!auth && (
              <div className="flex items-center space-x-4 text-orange-700">
                <Link
                  href="/login"
                  className="hover:text-orange-800 transition-colors duration-200 flex items-center gap-2 font-medium"
                >
                  <IconUser size={16} />
                  Đăng nhập
                </Link>
                <span className="text-orange-400">|</span>
                <Link
                  href="/register"
                  className="hover:text-orange-800 transition-colors duration-200 font-medium"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
              ReTrade
            </Link>
          </div>

          {/* Desktop Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-4 relative">
            <div className="relative w-full">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu, danh mục..."
                className="w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-xl bg-orange-25
                  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                  transition-all duration-200 text-gray-700 placeholder-gray-500
                  hover:border-orange-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setTimeout(() => setSearchFocus(false), 200)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <IconSearch
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
              >
                Tìm
              </button>
            </div>

            {/* Search History Dropdown */}
            {searchFocus && searchHistory.length > 0 && (
              <div className="absolute z-20 mt-2 w-full bg-white border border-orange-200 rounded-xl shadow-xl overflow-hidden top-full">
                <div className="p-3 bg-orange-50 border-b border-orange-100">
                  <div className="flex items-center gap-2 text-orange-700 font-medium">
                    <IconClock size={16} />
                    <span className="text-sm">Tìm kiếm gần đây</span>
                  </div>
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  {searchHistory.map((item, index) => (
                    <li
                      key={index}
                      className="px-4 py-3 hover:bg-orange-50 cursor-pointer text-gray-700 border-b border-orange-50 last:border-0 transition-colors duration-150"
                      onClick={() => {
                        setSearch(item);
                        handleSearch();
                        searchInputRef.current?.blur();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <IconSearch size={14} className="text-orange-400" />
                        <span>{item}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Cart with Badge */}
            <Link
              href="/cart"
              className="relative p-3 hover:bg-orange-50 rounded-xl transition-all duration-200 group"
              title={`Giỏ hàng ${totalCartItems > 0 ? `(${totalCartItems} sản phẩm)` : ''}`}
            >
              <IconShoppingCart
                size={24}
                className={`transition-colors duration-200 ${
                  totalCartItems > 0
                    ? 'text-orange-600 group-hover:text-orange-700'
                    : 'text-gray-600 group-hover:text-orange-600'
                }`}
              />

              {/* Cart Badge */}
              {totalCartItems > 0 && !cartLoading && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold shadow-lg transform scale-100 animate-pulse">
                  {totalCartItems > 99 ? '99+' : totalCartItems}
                </span>
              )}

              {/* Loading indicator for cart */}
              {cartLoading && (
                <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </span>
              )}
            </Link>

            {/* User Menu */}
            {auth ? (
              <div ref={dropdownRef} className="relative hidden lg:block">
                <button
                  className="p-3 rounded-xl hover:bg-orange-50 focus:outline-none transition-colors duration-200 group"
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
                          <p className="text-sm text-gray-600">{auth.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/user"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors duration-150 text-gray-700"
                      >
                        <IconUser size={18} className="text-orange-500" />
                        Hồ sơ cá nhân
                      </Link>
                      <Link
                        href="/user/orders"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors duration-150 text-gray-700"
                      >
                        <IconPackage size={18} className="text-orange-500" />
                        Đơn hàng của tôi
                      </Link>

                      {/* Cart shortcut in dropdown */}
                      <Link
                        href="/cart"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors duration-150 text-gray-700"
                        onClick={() => setDropdownOpen(false)}
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
            ) : (
              <Link
                href="/login"
                className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <IconUser size={18} />
                Đăng nhập
              </Link>
            )}

            {/* Mobile User Icon */}
            {auth && (
              <Link
                href="/user"
                className="lg:hidden p-3 hover:bg-orange-50 rounded-xl transition-colors duration-200 group"
                title="Tài khoản"
              >
                <IconUser size={24} className="text-gray-600 group-hover:text-orange-600" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-3 hover:bg-orange-50 rounded-xl transition-colors duration-200"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              {menuOpen ? (
                <IconX size={24} className="text-gray-600" />
              ) : (
                <IconMenu2 size={24} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-orange-200 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 rounded-xl bg-orange-25 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-gray-700 placeholder-gray-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <IconSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500"
              />
            </div>

            {/* Mobile Cart Link */}
            <Link
              href="/cart"
              className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex items-center gap-3 text-orange-700">
                <IconShoppingCart size={20} />
                <span className="font-medium">Giỏ hàng</span>
              </div>
              {totalCartItems > 0 && (
                <span className="bg-orange-500 text-white text-sm rounded-full px-3 py-1 font-bold">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Mobile Navigation */}
            <div className="space-y-2">
              {!auth ? (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <IconUser size={20} />
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center p-3 border-2 border-orange-500 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/user"
                    className="flex items-center gap-3 p-3 hover:bg-orange-50 rounded-xl text-gray-700 transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <IconUser size={20} className="text-orange-500" />
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    href="/user/orders"
                    className="flex items-center gap-3 p-3 hover:bg-orange-50 rounded-xl text-gray-700 transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <IconPackage size={20} className="text-orange-500" />
                    Đơn hàng của tôi
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                  >
                    <IconLogout size={20} />
                    Đăng xuất
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
