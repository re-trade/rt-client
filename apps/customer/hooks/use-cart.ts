'use client';

import { cartApi, CartGroupResponse, CartResponse } from '@/services/cart.api';
import { productApi, TProduct } from '@/services/product.api';
import { useCallback, useEffect, useState } from 'react';
type TCartSummary = {
  originalPrice: number;
  savings: number;
  tax: number;
  total: number;
};
function useCart() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [cartGroups, setCartGroups] = useState<
    Record<string, CartGroupResponse & { isOpen: boolean }>
  >({});
  const [cartSummary, setCartSummary] = useState<TCartSummary>({
    originalPrice: 0,
    savings: 0,
    tax: 0,
    total: 0,
  });
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartApi.getCart();
      setCart(data);
      const groupsMap: Record<string, CartGroupResponse & { isOpen: boolean }> = {};
      data?.cartGroupResponses.forEach((group) => {
        groupsMap[group.sellerId] = {
          ...group,
          isOpen: true,
        };
      });
      setCartGroups(groupsMap);
    } catch {
      setError('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecommendProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productApi.getProducts();
      setProducts(data);
    } catch {
      setError('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleShopSection = useCallback((shopId: string) => {
    setCartGroups((prev) => {
      if (!prev || !prev[shopId]) return prev;

      return {
        ...prev,
        [shopId]: {
          ...prev[shopId],
          isOpen: !prev[shopId].isOpen,
        },
      };
    });
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    fetchRecommendProduct();
  }, [fetchRecommendProduct]);

  return {
    cart,
    cartGroups,
    loading,
    error,
    refresh: fetchCart,
    toggleShopSection,
    products,
    cartSummary,
  };
}

export { useCart };
