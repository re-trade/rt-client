'use client';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';

export default function CartProductRecommend() {
  const { products } = useCart();

  return (
    <div className="mt-6 grid grid-cols-3 gap-4 sm:mt-8">
      {products.map((item) => (
        <div
          key={item.id}
          className="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <a href="#" className="overflow-hidden rounded">
            <Image
              width={176}
              height={176}
              className="mx-auto h-44 w-44"
              src={item.productImages[0] ?? ''}
              alt={`${item.name} hình ảnh`}
            />
          </a>
          <div>
            <a
              href="#"
              className="text-lg font-semibold leading-tight text-gray-900 hover:underline"
            >
              {item.name}
            </a>
            <p className="mt-2 text-base font-normal text-gray-500">{item.description}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">
              <span className="line-through">{item.currentPrice.toLocaleString('vi-VN')}₫</span>
            </p>
            <p className="text-lg font-bold leading-tight text-red-600">
              {item.currentPrice.toLocaleString('vi-VN')}₫
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2.5">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100"
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
            >
              <svg
                className="-ms-2 me-2 h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                />
              </svg>
              Thêm vào giỏ
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
