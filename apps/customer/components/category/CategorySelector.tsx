'use client';

import { useEffect, useRef } from 'react';

interface CategorySelectorProps {
  categories: Array<{ id: string; name: string }>;
  selectedCategoryId: string | null;
  onSelectCategoryAction: (categoryId: string | null) => void;
}

export function CategorySelector({
  categories,
  selectedCategoryId,
  onSelectCategoryAction,
}: CategorySelectorProps) {
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const element = categoryScrollRef.current;
      if (element && element.contains(event.target as Node)) {
        event.preventDefault();
        const speedFactor = 1.2;

        // Apply smooth scrolling with requestAnimationFrame
        const targetScrollLeft = element.scrollLeft + event.deltaY * speedFactor;
        element.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth',
        });
      }
    };

    // Use capture phase to handle the wheel event before it bubbles
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, []);

  return (
    <div className="bg-white py-6 px-6 sm:px-8 rounded-xl shadow-md border border-orange-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-orange-600"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Danh mục sản phẩm</h2>
            <p className="text-sm text-gray-600">Khám phá theo từng danh mục</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center text-orange-500 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="text-sm font-medium hidden sm:inline">Cuộn để xem thêm</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex gap-4 overflow-x-auto pb-4 px-4 -mx-2 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100 snap-x scroll-smooth rounded-lg py-2 my-1"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#fb923c #fed7aa',
            scrollbarGutter: 'stable both-edges',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'scrollbar',
          }}
          id="categoryScroll"
          ref={categoryScrollRef}
          onClick={(e) => {
            // Prevent click event from bubbling when interacting with scrollbar
            if (e.target === e.currentTarget) e.stopPropagation();
          }}
        >
          <div className="pl-2 flex-shrink-0 w-1"></div>
          <button
            onClick={() => onSelectCategoryAction(null)}
            className={`whitespace-nowrap px-5 py-3 rounded-full transition-all duration-200 text-sm font-medium flex-shrink-0 snap-start ${
              selectedCategoryId === null
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-orange-300 text-gray-800 hover:bg-orange-400'
            }`}
          >
            Tất cả
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategoryAction(category.id)}
              className={`whitespace-nowrap px-5 py-3 rounded-full transition-all duration-200 text-sm font-medium flex-shrink-0 snap-start ${
                selectedCategoryId === category.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-800 hover:bg-orange-200'
              }`}
            >
              {category.name}
            </button>
          ))}
          <div className="pr-2 flex-shrink-0 w-1"></div>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          #categoryScroll::-webkit-scrollbar {
            height: 4px;
            display: block !important;
          }
          #categoryScroll:hover::-webkit-scrollbar {
            height: 10px;
          }
          #categoryScroll::-webkit-scrollbar-thumb {
            background-color: #fb923c;
            border-radius: 20px;
            min-height: 30px;
          }
          #categoryScroll:hover::-webkit-scrollbar-thumb {
            background-color: #f97316;
          }
          #categoryScroll::-webkit-scrollbar-track {
            background-color: #fed7aa;
            border-radius: 20px;
          }
          /* Firefox specific */
          #categoryScroll {
            scrollbar-color: #fb923c #fed7aa;
            scrollbar-width: thin;
            -ms-overflow-style: auto;
            scroll-behavior: smooth;
          }
          #categoryScroll:hover {
            scrollbar-color: #f97316 #fed7aa;
          }
          #categoryScroll:focus {
            outline: none;
          }
        `,
          }}
        />
      </div>
    </div>
  );
}
