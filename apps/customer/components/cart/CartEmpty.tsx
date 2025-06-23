'use client';

import { useRouter } from 'next/navigation';

const CartEmpty = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 px-4">
      <div className="text-center space-y-6">
        {/* Empty Cart Icon */}
        <div className="mx-auto w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
          <svg
            className="w-12 h-12 md:w-16 md:h-16 text-orange-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L17 18"
            />
          </svg>
        </div>

        {/* Title and Description */}
        <div className="space-y-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Giỏ hàng trống</h2>
          <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng
            tôi!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm md:text-base font-semibold text-white hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            Tiếp tục mua sắm
          </button>
        </div>

        {/* Suggested Categories */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Danh mục phổ biến:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Điện thoại', 'Laptop', 'Thời trang', 'Gia dụng', 'Sách'].map((category) => (
              <button
                key={category}
                onClick={() => router.push(`/category/${category.toLowerCase()}`)}
                className="px-3 py-1 text-xs md:text-sm bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartEmpty;
