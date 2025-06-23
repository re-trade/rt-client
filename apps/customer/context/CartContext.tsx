'use client';

import { useCart as useCartHook } from '@/hooks/use-cart';
import { createContext, ReactNode, useContext } from 'react';

type CartContextType = ReturnType<typeof useCartHook>;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const cartData = useCartHook();

  return <CartContext.Provider value={cartData}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
