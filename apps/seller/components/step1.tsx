import React, { useState } from "react";
import { IconType } from "react-icons";

interface SearchProps {
  placeholder: string;
  onSearch: (query: string) => void;
  icon?: IconType;
}

const Search: React.FC<SearchProps> = ({ placeholder, onSearch }) => {
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="relative">
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setShowModal(true)}
          placeholder={placeholder}
          className="border px-4 py-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="m-4 w-full max-w-screen-md rounded-xl bg-white p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Advanced Search</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-black">✖</button>
            </div>

            {/* Advanced Form */}
            <form>
              <div className="relative mb-10 w-full flex items-center rounded-md">
                <svg
                  className="absolute left-2 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  name="search"
                  className="h-12 w-full rounded-md border border-gray-100 bg-gray-100 py-4 pr-40 pl-12 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Search by name, type, manufacturer, etc"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-sm font-medium text-stone-600">Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Raspberry juice"
                    className="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm focus:border-blue-500 focus:ring"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="manufacturer" className="text-sm font-medium text-stone-600">Manufacturer</label>
                  <select
                    id="manufacturer"
                    className="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm focus:border-blue-500 focus:ring"
                  >
                    <option>Cadberry</option>
                    <option>Starbucks</option>
                    <option>Hilti</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="date" className="text-sm font-medium text-stone-600">Date of Entry</label>
                  <input
                    type="date"
                    id="date"
                    className="mt-2 block w-full cursor-pointer rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm focus:border-blue-500 focus:ring"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="status" className="text-sm font-medium text-stone-600">Status</label>
                  <select
                    id="status"
                    className="mt-2 block w-full cursor-pointer rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm focus:border-blue-500 focus:ring"
                  >
                    <option>Dispached Out</option>
                    <option>In Warehouse</option>
                    <option>Being Brought In</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg bg-gray-200 px-8 py-2 font-medium text-gray-700 hover:opacity-80"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-8 py-2 font-medium text-white hover:opacity-80"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
