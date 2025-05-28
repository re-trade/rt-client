"use client";

import Link from "next/link";
import SearchBox from "@/components/input/Search";
import { useState } from "react";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="bg-gray-50 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end items-center space-x-4">
          <button className="hover:text-blue-600 flex items-center">
            🔔 Thông Báo
          </button>
          <details className="dropdown">
            <summary className="btn hover:text-blue-600 text-black flex items-center bg-transparent border-none shadow-none">
              🌐 English
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
              <li><a>English</a></li>
              <li><a>Tiếng Việt</a></li>
            </ul>
          </details>
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login" className="hover:text-orange-500 flex items-center">
              👤 Login
            </Link>
            <span>|</span>
            <Link href="/register" className="hover:text-orange-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-bold text-orange-500">
          ReTrade
        </Link>

        <div className="w-full md:max-w-2xl flex flex-col">
          <SearchBox />
        </div>

        <div className="flex items-center space-x-5 text-sm text-gray-700">
          <Link href="/cart" className="relative hover:bg-gray-300">
            🛒
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              3
            </span>
          </Link>
          <button
            className="md:hidden ml-2 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-16 6h16" />
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-4 border-t shadow-md">
          <ul className="space-y-3 text-gray-700 text-sm">
            <li>
              <Link href="/login" className="block hover:text-orange-500">Login</Link>
            </li>
            <li>
              <Link href="/register" className="block hover:text-orange-500">Sign Up</Link>
            </li>
            <li>
              <a href="#" className="block hover:text-orange-500">English</a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
