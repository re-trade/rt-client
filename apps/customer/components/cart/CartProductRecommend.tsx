'use client';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';

export default function CartProductRecommend({ products }: ReturnType<typeof useCart>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {products.slice(0, 6).map((item) => (
        <div
          key={item.id}
          className="group bg-white rounded-xl border border-orange-100 shadow-lg overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300"
        >
          <div className="relative overflow-hidden bg-orange-25 p-3 md:p-4">
            <Image
              width={150}
              height={150}
              className="mx-auto h-32 w-32 md:h-40 md:w-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              src={item.productImages[0] ?? ''}
              alt={`${item.name} hình ảnh`}
            />
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -
              {Math.round(
                ((item.currentPrice * 1.2 - item.currentPrice) / (item.currentPrice * 1.2)) * 100,
              )}
              %
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-3 md:space-y-4">
            <div>
              <a
                href="#"
                className="text-sm md:text-base font-bold leading-tight text-gray-800 hover:text-orange-600 transition-colors line-clamp-2"
              >
                {item.name}
              </a>
              <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-600 line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs md:text-sm text-gray-400">
                <span className="line-through">
                  {(item.currentPrice * 1.2).toLocaleString('vi-VN')}₫
                </span>
              </p>
              <p className="text-base md:text-xl font-bold text-orange-600">
                {item.currentPrice.toLocaleString('vi-VN')}₫
              </p>
            </div>

            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 md:py-3 text-xs md:text-sm font-bold text-white hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="h-3 h-3 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Thêm vào giỏ
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
