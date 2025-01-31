'use client';

import { useState } from 'react';
import { FaSearch, FaUser, FaGlobe } from 'react-icons/fa';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <a href="/" className="text-2xl font-bold text-blue-600">
          VNS
        </a>
        
        <div className="relative w-1/3 hidden md:flex">
          <input
            type="text"
            placeholder="Search destinations, flights, hotels..."
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <ul className="hidden md:flex space-x-6 font-medium text-gray-700">
          <li><a href="#" className="hover:text-blue-600">Hotels</a></li>
          <li><a href="#" className="hover:text-blue-600">Flights</a></li>
          <li><a href="#" className="hover:text-blue-600">Car Rentals</a></li>
          <li><a href="#" className="hover:text-blue-600">Attractions</a></li>
        </ul>
        
        <div className="flex items-center space-x-4">
          <button className="hidden md:flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            <FaGlobe className="mr-2" /> EN/USD
          </button>
          <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FaUser className="mr-2" /> Login
          </button>
        </div>
        
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-16 6h16" />
          </svg>
        </button>
      </nav>
      
      {menuOpen && (
        <div className="md:hidden bg-white p-4 border-t shadow-md">
          <ul className="space-y-3 text-gray-700">
            <li><a href="#" className="block hover:text-blue-600">Hotels</a></li>
            <li><a href="#" className="block hover:text-blue-600">Flights</a></li>
            <li><a href="#" className="block hover:text-blue-600">Car Rentals</a></li>
            <li><a href="#" className="block hover:text-blue-600">Attractions</a></li>
            <li><button className="w-full text-left flex items-center py-2 border-t pt-3">
              <FaGlobe className="mr-2" /> EN/USD
            </button></li>
            <li><button className="w-full text-left flex items-center py-2">
              <FaUser className="mr-2" /> Login
            </button></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;