'use client';
import CartProductRecommend from '@/components/cart/CartProductRecommend';
import CartSection from '@/components/cart/CartSection';
import CartSummary from '@/components/cart/CartSummary';
import React from 'react';

const ShoppingCart: React.FC = () => {
  return (
    <section className="bg-[#FDFEF9] py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Giỏ Hàng</h2>
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              <CartSection />
              <div className="hidden xl:mt-8 xl:block">
                <h3 className="text-2xl font-semibold text-gray-900">Người khác cũng mua</h3>
                <CartProductRecommend />
              </div>
            </div>
          </div>
          <CartSummary />
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
