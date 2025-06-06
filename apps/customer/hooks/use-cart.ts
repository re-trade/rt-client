'use client';

import { cartApi, CartGroupResponse, CartResponse } from '@/services/cart.api';
import { useCallback, useEffect, useState } from 'react';

function useCart() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [cartGroups, setCartGroups] = useState<
    Record<string, CartGroupResponse & { isOpen: boolean }>
  >({});
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

  return {
    cart,
    cartGroups,
    loading,
    error,
    refresh: fetchCart,
    toggleShopSection,
  };
}

export { useCart };
