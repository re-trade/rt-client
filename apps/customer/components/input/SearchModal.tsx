// components/modal/SearchModal.tsx
import React from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 pt-20">
      <div className="m-4 w-full max-w-screen-md rounded-xl bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-6 top-4 text-gray-500 hover:text-red-600 text-xl"
        >
          ✕
        </button>

        <form>
          <div className="relative mb-10">
            <svg
              className="absolute left-3 top-3 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, type, manufacturer, etc"
              className="h-12 w-full rounded-md bg-gray-100 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input className="mt-1 rounded-md bg-gray-100 px-2 py-2 outline-none" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Manufacturer</label>
              <select className="mt-1 rounded-md bg-gray-100 px-2 py-2 outline-none">
                <option>Cadberry</option>
                <option>Starbucks</option>
                <option>Hilti</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Date of Entry</label>
              <input type="date" className="mt-1 rounded-md bg-gray-100 px-2 py-2 outline-none" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select className="mt-1 rounded-md bg-gray-100 px-2 py-2 outline-none">
                <option>Dispatched Out</option>
                <option>In Warehouse</option>
                <option>Being Brought In</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button type="reset" className="bg-gray-200 px-6 py-2 rounded-lg">
              Reset
            </button>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchModal;
