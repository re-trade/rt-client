'use client';

import CartProductRecommend from '@/components/cart/CartProductRecommend';
import CartSection from '@/components/cart/CartSection';
import CartSummary from '@/components/cart/CartSummary';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import React from 'react';

const ShoppingCart: React.FC = () => {
  const router = useRouter();
  const cartHook = useCart();
  const navigateHome = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/');
  };

  const shouldShowCartSummary = () => {
    if (cartHook.loading || cartHook.error) {
      return false;
    }
    if (!cartHook.cartGroups || Object.keys(cartHook.cartGroups).length === 0) {
      return false;
    }
    return Object.values(cartHook.cartGroups).some((shop) => shop.items && shop.items.length > 0);
  };

  const showSummary = shouldShowCartSummary();

  return (
    <section className="bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25 py-6 md:py-12 lg:py-20 min-h-screen">
      <div className="mx-auto max-w-screen-xl px-3 md:px-6 2xl:px-0">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <button
              onClick={navigateHome}
              className="hover:text-orange-600 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              Trang chủ
            </button>
            <span>/</span>
            <span className="font-medium text-orange-600">Giỏ hàng</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Giỏ hàng
          </h1>
          <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
        </div>
        <div className={`flex flex-col gap-6 lg:gap-8 ${showSummary ? 'xl:flex-row' : ''}`}>
          <div className={`space-y-6 md:space-y-8 ${showSummary ? 'w-full xl:w-2/3' : 'w-full'}`}>
            <CartSection {...cartHook} />

            <div className="hidden lg:block bg-white rounded-xl p-6 md:p-8 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  {showSummary ? 'Sản phẩm tương tự' : 'Sản phẩm đề xuất'}
                </h3>
              </div>
              <CartProductRecommend {...cartHook} />
            </div>
          </div>

          {showSummary && (
            <div className="w-full xl:w-1/3">
              <div className="xl:sticky xl:top-6">
                <CartSummary
                  cartSummary={cartHook.cartSummary}
                  selectedItems={cartHook.selectedItems}
                  createOrder={cartHook.createOrder}
                  isCreateOrder={cartHook.isCreateOrder}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <button
            onClick={navigateHome}
            className="group inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors bg-transparent border-none p-2 cursor-pointer rounded-lg hover:bg-orange-50"
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
            <span className="font-medium">Tiếp tục mua sắm</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
