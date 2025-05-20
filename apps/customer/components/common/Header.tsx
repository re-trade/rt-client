"use client";
import { useEffect, useState } from "react";
import {
  FaBell,
  FaGlobe,
  FaSearch,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);
  useEffect(() => {}, []);

  const handleSearch = () => {
    if (!search.trim()) return;

    const newHistory = [
      search,
      ...searchHistory.filter((h) => h !== search),
    ].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    setSearch("");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="bg-gray-50 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end items-center space-x-4">
          <button className="hover:text-blue-600 flex items-center">
            <FaBell className="mr-1" /> Thông Báo
          </button>
          <details className="dropdown">
            <summary className="btn hover:text-blue-600 text-black flex items-center bg-transparent border-none shadow-none">
              <FaGlobe className="mr-1" /> English
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
              <li>
                <a>English</a>
              </li>
              <li>
                <a>Tiếng Việt</a>
              </li>
            </ul>
          </details>
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="/login"
              className="hover:text-orange-500 flex items-center"
            >
              <FaUser className="mr-1" /> Login
            </a>
            <span>|</span>
            <a href="/register" className="hover:text-orange-500">
              Sign Up
            </a>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <a href="/" className="text-2xl font-bold text-orange-500">
          ReTrade
        </a>

        <div className="w-full md:max-w-2xl flex flex-col">
          <div className="w-full flex border border-orange-400 rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Search for products, brands and more"
              className="flex-grow px-5 py-2 text-sm focus:outline-none text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setTimeout(() => setSearchFocus(false), 200)}
            />
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 text-sm"
              onClick={handleSearch}
            >
              <FaSearch />
            </button>
          </div>

          {searchFocus && searchHistory.length > 0 && (
            <ul className="bg-white shadow-lg border rounded mt-1 z-10 text-sm w-full">
              {searchHistory.map((item, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 hover:bg-orange-100 cursor-pointer text-black"
                  onClick={() => setSearch(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center space-x-5 text-sm text-gray-700">
          <div className="relative hover:bg-gray-300">
            <FaShoppingCart className="text-xl cursor-pointer" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              3
            </span>
          </div>
          <button
            className="md:hidden ml-2 p-2"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-16 6h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-4 border-t shadow-md">
          <ul className="space-y-3 text-gray-700 text-sm">
            <li>
              <a href="#" className="block hover:text-orange-500">
                Login
              </a>
            </li>
            <li>
              <a href="#" className="block hover:text-orange-500">
                Sign Up
              </a>
            </li>
            <li>
              <a href="#" className="block hover:text-orange-500">
                English
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
