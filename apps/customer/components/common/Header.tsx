'use client';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FaCartPlus, FaSearch, FaUserCircle } from 'react-icons/fa';

const Header: React.FC = () => {
  const { auth, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-slate-50 border-b border-slate-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-4">
            <button className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
              🔔 Thông Báo
            </button>
          </div>
          {!auth && (
            <div className="flex items-center space-x-3 text-slate-600">
              <Link
                href="/login"
                className="hover:text-orange-500 transition-colors duration-200 flex items-center"
              >
                <FaUserCircle className="mr-1.5" /> Đăng Nhập
              </Link>
              <span className="text-slate-300">|</span>
              <Link
                href="/register"
                className="hover:text-orange-500 transition-colors duration-200"
              >
                Đăng Kí
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-3 py-3 md:px-4 md:py-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link
              href="/"
              className="text-xl md:text-2xl font-bold text-orange-500 hover:text-orange-600 transition-colors duration-200"
            >
              ReTrade
            </Link>
            <button
              className="md:hidden p-2 -mr-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              <svg
                className="w-6 h-6 text-slate-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <div className="flex-grow w-full md:w-auto relative order-3 md:order-2 mt-3 md:mt-0">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full text-slate-600 pl-4 pr-10 py-2 md:py-2.5 border border-slate-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                transition-all duration-200 text-sm md:text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors duration-200"
              >
                <FaSearch />
              </button>
            </div>
            {searchFocus && searchHistory.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg">
                <ul className="py-1">
                  {searchHistory.map((item, index) => (
                    <li
                      key={index}
                      className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-slate-600 text-sm md:text-base border-b last:border-0 border-slate-50"
                      onClick={() => {
                        setSearch(item);
                        handleSearch();
                        searchInputRef.current?.blur();
                      }}
                    >
                      <div className="flex items-center">
                        <FaSearch className="mr-2 text-slate-400" size={12} />
                        {item}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4 md:space-x-5 relative order-2 md:order-3">
            <Link
              href="/cart"
              className="relative hover:bg-slate-100 p-2 md:p-2.5 rounded-full transition-colors duration-200"
            >
              <FaCartPlus size={20} className="text-slate-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                3
              </span>
            </Link>
            {auth ? (
              <div ref={dropdownRef} className="relative hidden md:block">
                <button
                  className="p-2 rounded-full hover:bg-slate-100 focus:outline-none transition-colors duration-200"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <FaUserCircle size={24} className="text-slate-600" />
                </button>
                {dropdownOpen && (
                  <div className="absolute text-slate-600 right-0 mt-2 w-48 bg-white border border-slate-100 rounded-lg shadow-lg z-50 py-1 text-sm overflow-hidden">
                    <Link
                      href="/user"
                      className="block px-4 py-2.5 hover:bg-slate-50 transition-colors duration-150"
                    >
                      Hồ sơ
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2.5 hover:bg-slate-50 transition-colors duration-150"
                    >
                      Đơn hàng
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2.5 hover:bg-slate-50 transition-colors duration-150"
                    >
                      Cài đặt
                    </Link>
                    <div className="border-t border-slate-100 mt-1"></div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-red-500 transition-colors duration-150"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : null}
            {auth ? (
              <Link href="/user" className="md:hidden p-2 rounded-full">
                <FaUserCircle size={20} className="text-slate-600" />
              </Link>
            ) : (
              <Link href="/login" className="md:hidden p-2 rounded-full">
                <FaUserCircle size={20} className="text-slate-600" />
              </Link>
            )}
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-4 border-t border-slate-100 shadow-sm">
          <ul className="grid grid-cols-2 gap-2 text-slate-600 text-base">
            <li className="col-span-2 mb-2 border-b border-slate-100 pb-2">
              <Link
                href="/notifications"
                className="flex items-center py-2 hover:text-orange-500 transition-colors duration-200"
              >
                <span className="mr-2">🔔</span> Thông Báo
              </Link>
            </li>

            {!auth ? (
              <>
                <li>
                  <Link
                    href="/login"
                    className="flex justify-center items-center py-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                  >
                    <FaUserCircle className="mr-2" /> Đăng Nhập
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="flex justify-center items-center py-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                  >
                    Đăng Kí
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/user"
                    className="flex justify-center items-center py-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                  >
                    Hồ sơ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/orders"
                    className="flex justify-center items-center py-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                  >
                    Đơn hàng
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="flex justify-center items-center py-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                  >
                    Cài đặt
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="w-full flex justify-center items-center py-2.5 bg-red-50 rounded-lg text-red-500 hover:bg-red-100 transition-colors duration-200"
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
