'use client';
/*

const Dashboard = () => {
    return (
        <>
        </>
    );
}

export default Dashboard;*/
// app/admin/page.tsx
import React, { useState } from 'react';

// Định nghĩa kiểu cho Product
interface Product {
  sellerId: number;
  name: string;
  description: string;
  brand: string;
  tags: string[];
}

// Định nghĩa kiểu cho User
interface User {
  name: string;
  email: string;
  date: string;
  phone: string;
}

// Dữ liệu mẫu cho products
const sampleProducts: Product[] = [
  {
    sellerId: 1,
    name: 'Sample Product 1',
    description: 'This is a description of product 1',
    brand: 'Brand A',
    tags: ['tag1', 'tag2'],
  },
  {
    sellerId: 2,
    name: 'Sample Product 2',
    description: 'This is a description of product 2',
    brand: 'Brand B',
    tags: ['tag3', 'tag4'],
  },
];

// Dữ liệu mẫu cho users
const sampleUsers: User[] = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    date: '2025-01-15',
    phone: '+1234567890',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    date: '2024-11-30',
    phone: '+0987654321',
  },
];

// Component chính cho trang Admin
const AdminPage: React.FC = () => {
  // State để lưu view hiện tại: 'products' hoặc 'users'
  const [activeView, setActiveView] = useState<'products' | 'users'>('products');

  return (
    // Container: flex layout, trên màn rộng flex-row, trên mobile flex-col
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar bên trái: trên desktop width 1/4, trên mobile full width */}
      <nav className="bg-[#FFD2B2] text-black md:w-1/4 w-full">
        <ul>
          {/* Link Products: click để chuyển activeView thành 'products' */}
          <li
            className={`p-4 cursor-pointer hover:bg-gray-700 ${
              activeView === 'products' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setActiveView('products')}
          >
            Products
          </li>

          {/* Link Users: click để chuyển activeView thành 'users' */}
          <li
            className={`p-4 cursor-pointer hover:bg-gray-700 ${
              activeView === 'users' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setActiveView('users')}
          >
            Users
          </li>
        </ul>
      </nav>

      {/* Main content bên phải: flex-1 để chiếm phần còn lại */}
      <main className="flex-1 p-6 bg-[#fff4eb]">
        {activeView === 'products' ? (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Product List</h2>
            {/* Container table có thể cuộn ngang trên mobile */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">SellerId</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Description</th>
                    <th className="py-2 px-4 border-b">Brand</th>
                    <th className="py-2 px-4 border-b">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Lặp qua sampleProducts để tạo các dòng */}
                  {sampleProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">{product.sellerId}</td>
                      <td className="py-2 px-4 border-b">{product.name}</td>
                      <td className="py-2 px-4 border-b">{product.description}</td>
                      <td className="py-2 px-4 border-b">{product.brand}</td>
                      <td className="py-2 px-4 border-b">
                        {/* Nối mảng tags thành chuỗi ngăn cách ', ' */}
                        {product.tags.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section>
            <h2 className="text-2xl font-semibold mb-4">User List</h2>
            {/* Container table có thể cuộn ngang trên mobile */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Lặp qua sampleUsers để tạo các dòng */}
                  {sampleUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">{user.name}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">{user.date}</td>
                      <td className="py-2 px-4 border-b">{user.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
