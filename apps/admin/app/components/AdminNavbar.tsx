'use client';

import Link from 'next/link';
import { useState } from 'react';

// Component Navbar cho Admin
export default function AdminNavbar() {
  // State để kiểm soát trạng thái mở/đóng menu trên mobile
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/*hamburger mở menu trên mobile */}
      <button
        className="md:hidden p-4 text-gray-700 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Icon hamburger */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Navbar bên trái */}
      <nav
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:block w-64 bg-[#F5E8C7] text-[#4A4039] min-h-screen p-6 fixed md:static top-0 left-0 z-10 transition-transform duration-300 rounded-r-lg shadow-md`}
      >
        {/* Tiêu đề Navbar */}
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        {/* Danh sách các mục điều hướng */}
        <ul className="space-y-4">
          <li>
            <Link href="/admin/products" className="block p-3 hover:bg-[#E8D9B0] rounded-lg">
              Products
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="block p-3 hover:bg-[#E8D9B0] rounded-lg">
              Users
            </Link>
          </li>
        </ul>
      </nav>

      {/* Overlay khi mở menu trên mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
