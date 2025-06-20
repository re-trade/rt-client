'use client';

import CartProductRecommend from '@/components/cart/CartProductRecommend';
import CartSection from '@/components/cart/CartSection';
import CartSummary from '@/components/cart/CartSummary';
import { useCart } from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import React from 'react';

const ShoppingCart: React.FC = () => {
  const router = useRouter();
  const cartHook = useCart();

  const navigateHome = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <section className="bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25 py-12 md:py-20 min-h-screen">
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 2xl:px-0">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <button
              onClick={navigateHome}
              className="hover:text-orange-600 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              Trang chủ
            </button>
            <span>/</span>
            <span className="font-medium text-orange-600">Giỏ Hàng</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Giỏ Hàng</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
        </div>

        <div className="flex flex-col-reverse gap-8 lg:flex-row">
          <div className="w-full lg:w-2/3 space-y-8">
            <CartSection {...cartHook} />
            <div className="hidden xl:block bg-white rounded-xl p-8 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Người khác cũng mua</h3>
              </div>
              <CartProductRecommend {...cartHook} />
            </div>
          </div>
          <div className="w-full lg:w-1/3">
            <CartSummary {...cartHook} />
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center">
            <button
              onClick={navigateHome}
              className="group flex items-center text-gray-600 hover:text-orange-600 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              <svg
                className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
