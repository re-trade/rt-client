'use client';
import { cartApi, CartGroupResponse, CartResponse } from '@/services/cart.api';
import { contactApi, TAddress } from '@/services/contact.api';
import { productApi, TProduct } from '@/services/product.api';
import { useCallback, useEffect, useState } from 'react';

type TCartSummary = {
  originalPrice: number;
  tax: number;
  total: number;
};

function useCart() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [cartGroups, setCartGroups] = useState<
    Record<string, CartGroupResponse & { isOpen: boolean }>
  >({});
  const [contacts, setContacts] = useState<TAddress[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [cartSummary, setCartSummary] = useState<TCartSummary>({
    originalPrice: 0,
    tax: 0,
    total: 0,
  });
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchCart = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
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
      setRefreshing(false);
    }
  }, []);

  const selectAddress = useCallback((addressId: string) => {
    setSelectedAddressId(addressId);
  }, []);

  const fetchAddresses = useCallback(async () => {
    try {
      const data = await contactApi.getContacts();
      setContacts(data);
    } catch {
      setError('Không thể tải địa chỉ');
    }
  }, []);

  const fetchRecommendProduct = useCallback(async () => {
    try {
      const data = await productApi.getProducts(0, 3);
      setProducts(data);
    } catch {
      setError('Không thể tải sản phẩm');
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

  const toggleItemSelection = useCallback((productId: string, quantity: number) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.filter((item) => item.productId !== productId);
      } else {
        return [...prev, { productId, quantity }];
      }
    });
  }, []);

  const addToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      try {
        await cartApi.addToCart(productId, quantity);
        await fetchCart(true);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra khi thêm vào giỏ hàng';
        setError(errorMessage);
        throw err;
      }
    },
    [fetchCart],
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      try {
        await cartApi.removeFromCart(productId);
        setSelectedItems((prev) => prev.filter((item) => item.productId !== productId));
        await fetchCart(true);
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa sản phẩm';
        setError(errorMessage);
        throw err;
      }
    },
    [fetchCart],
  );

  const updateCartItemQuantity = useCallback(
    async (productId: string, quantity: number) => {
      try {
        await cartApi.updateCartItemQuantity(productId, quantity);
        await fetchCart(true);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật số lượng';
        setError(errorMessage);
        throw err;
      }
    },
    [fetchCart],
  );

  const clearCart = useCallback(async () => {
    try {
      await cartApi.clearCart();
      setSelectedItems([]);
      await fetchCart(true);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa giỏ hàng';
      setError(errorMessage);
      throw err;
    }
  }, [fetchCart]);

  useEffect(() => {
    if (!cart || !selectedItems.length) {
      setCartSummary({
        originalPrice: 0,
        tax: 0,
        total: 0,
      });
      return;
    }

    let originalPrice = 0;
    let total = 0;

    cart.cartGroupResponses.forEach((group) => {
      group.items.forEach((item) => {
        if (selectedItems.find((selected) => selected.productId === item.productId)) {
          originalPrice += item.totalPrice;
          total += item.totalPrice;
        }
      });
    });
    const tax = Math.round(total * 0.05);

    setCartSummary({
      originalPrice,
      tax,
      total: total + tax,
    });
  }, [selectedItems, cart]);

  useEffect(() => {
    fetchCart();
    fetchAddresses();
    fetchRecommendProduct();
  }, [fetchCart, fetchAddresses, fetchRecommendProduct]);

  return {
    cart,
    cartGroups,
    loading,
    error,
    refreshing,
    refresh: fetchCart,
    toggleShopSection,
    toggleItemSelection,
    selectedItems,
    products,
    cartSummary,
    contacts,
    selectedAddressId,
    selectAddress,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  };
}

export { useCart };
