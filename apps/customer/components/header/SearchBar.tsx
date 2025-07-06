'use client';

import { unAuthApi } from '@retrade/util';
import { IconClock, IconPhoto, IconSearch, IconUpload, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [imageSearchOpen, setImageSearchOpen] = useState(false);
  const [imageSearchLoading, setImageSearchLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) setSearchHistory(JSON.parse(history));
  }, []);

  const saveSearchAndRedirect = (term: string) => {
    const newHistory = [term, ...searchHistory.filter((h) => h !== term)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    router.push(`/product?keyword=${encodeURIComponent(term)}`);
  };

  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    saveSearchAndRedirect(trimmed);
  };

  const handleImageUpload = async (file: File) => {
    setImageSearchLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await unAuthApi.imageSearch.post<{ analysis: string }>(
        '/analyze-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status !== 200) throw new Error('Failed to analyze image');

      const { analysis } = response.data;
      if (analysis) {
        setKeyword(analysis);
        setImageSearchOpen(false);
        saveSearchAndRedirect(analysis);
      }
    } catch {
    } finally {
      setImageSearchLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  return (
    <>
      <div className="hidden lg:flex flex-1 max-w-2xl mx-4 relative">
        <div className="relative w-full">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Tìm kiếm sản phẩm, thương hiệu, danh mục..."
            className="w-full pl-12 pr-20 py-3 border-2 border-orange-200 rounded-xl bg-orange-25
              focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
              transition-all duration-200 text-gray-700 placeholder-gray-500 hover:border-orange-300"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setTimeout(() => setSearchFocus(false), 200)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <IconSearch
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
          />
          <button
            onClick={() => setImageSearchOpen(true)}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-orange-100 rounded-lg transition-colors duration-200"
            title="Tìm kiếm bằng hình ảnh"
          >
            <IconPhoto size={18} className="text-orange-500" />
          </button>
        </div>

        {searchFocus && searchHistory.length > 0 && (
          <div className="absolute z-20 mt-2 w-full bg-white border border-orange-200 rounded-xl shadow-xl overflow-hidden top-full">
            <div className="p-3 bg-orange-50 border-b border-orange-100">
              <div className="flex items-center gap-2 text-orange-700 font-medium">
                <IconClock size={16} />
                <span className="text-sm">Tìm kiếm gần đây</span>
              </div>
            </div>
            <ul className="max-h-60 overflow-y-auto">
              {searchHistory.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-3 hover:bg-orange-50 cursor-pointer text-gray-700 border-b border-orange-50 last:border-0 transition-colors duration-150"
                  onClick={() => {
                    setKeyword(item);
                    handleSearch();
                    searchInputRef.current?.blur();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <IconSearch size={14} className="text-orange-400" />
                    <span>{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {imageSearchOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50 p-4"
          onClick={() => setImageSearchOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Tìm kiếm bằng hình ảnh</h3>
                <button
                  onClick={() => setImageSearchOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  disabled={imageSearchLoading}
                >
                  <IconX size={20} className="text-gray-500" />
                </button>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-orange-200 hover:border-orange-300 hover:bg-orange-25'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {imageSearchLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:0s]"></span>
                      <span className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <p className="text-gray-600 text-sm">Đang phân tích hình ảnh...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <IconUpload size={32} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium mb-1">Kéo và thả hình ảnh vào đây</p>
                      <p className="text-gray-500 text-sm">hoặc</p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
                    >
                      Chọn hình ảnh
                    </button>
                    <p className="text-xs text-gray-400">Hỗ trợ: JPG, PNG, GIF (tối đa 10MB)</p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
