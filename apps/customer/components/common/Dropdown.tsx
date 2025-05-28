'use client';

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const Dropdown: React.FC<{ title: string; items: string[] }> = ({ title, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600"
        onClick={() => setOpen(!open)}
      >
        {title} <FaChevronDown className="ml-2" />
      </button>
      {open && (
        <ul className="absolute left-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
          {items.map((item, index) => (
            <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
