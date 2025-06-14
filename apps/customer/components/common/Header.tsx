'use client';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FaCartPlus, FaUserCircle } from 'react-icons/fa';

const Header: React.FC = () => {
  const { auth, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="bg-gray-50 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between md:justify-end items-center">
          <div className="flex items-center space-x-4">
            <button className="hover:text-blue-600 flex items-center">🔔 Thông Báo</button>
          </div>
          {!auth && (
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/login" className="hover:text-orange-500 flex items-center">
                <FaUserCircle className="mr-1" /> Đăng Nhập
              </Link>
              <span>|</span>
              <Link href="/register" className="hover:text-orange-500">
                Đăng Kí
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-bold text-orange-500">
          ReTrade
        </Link>

        <div className="flex-grow w-full md:w-auto">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full text-gray-600 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="flex items-center space-x-4 relative">
          <Link href="/cart" className="relative hover:bg-gray-200 p-2 rounded-full">
            <FaCartPlus size={24} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              3
            </span>
          </Link>

          {auth ? (
            <div ref={dropdownRef} className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <FaUserCircle size={28} className="text-gray-700" />
              </button>
              {dropdownOpen && (
                <div className="absolute text-gray-600 right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50 py-2 text-sm">
                  <Link href="/user" className="block px-4 py-2 hover:bg-gray-100">
                    Hồ sơ
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100">
                    Đơn hàng
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">
                    Cài đặt
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : null}

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-4 border-t shadow-md">
          <ul className="space-y-3 text-gray-700 text-sm">
            {!auth ? (
              <>
                <li>
                  <Link href="/login" className="block hover:text-orange-500">
                    Đăng Nhập
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="block hover:text-orange-500">
                    Đăng Kí
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/user" className="block hover:text-orange-500">
                    Hồ sơ
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="block hover:text-orange-500">
                    Đơn hàng
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="block hover:text-orange-500">
                    Cài đặt
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="block text-left text-red-500 hover:text-red-700"
                  >
                    Đăng xuất
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
