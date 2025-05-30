// components/input/Search.tsx
import SearchModal from '@components/input/SearchModal';
import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { IoSearch } from 'react-icons/io5';

interface SearchProps {
  placeholder: string;
  onSearch: (query: string) => void;
  icon?: IconType;
}

const Search: React.FC<SearchProps> = ({ placeholder, onSearch, icon: Icon }) => {
  const [query, setQuery] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query);
    }
  };

  return (
    <>
      <div className="flex items-center w-full max-w-md bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
        {Icon && <Icon className="text-gray-400 text-xl mr-2" />}
        <input
          type="text"
          value={query}
          onFocus={() => setModalOpen(true)}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="flex-grow outline-none bg-transparent text-sm placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          className="ml-2  text-white text-sm px-4 py-1.5 rounded-full hover:bg-blue-600 transition"
        >
          <IoSearch size={16} />{' '}
        </button>
      </div>

      <SearchModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Search;
