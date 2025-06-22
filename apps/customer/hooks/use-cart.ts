'use client';
import { cartApi, CartGroupResponse, CartResponse } from '@/services/cart.api';
import { contactApi, TAddress } from '@/services/contact.api';
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
  const [contacts, setContacts] = useState<TAddress[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
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
  const selectAddress = useCallback((addressId: string) => {
    setSelectedAddressId(addressId);
  }, []);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactApi.getContacts();
      setContacts(data);
    } catch {
      setError('Không thể tải địa chỉ');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecommendProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productApi.getProducts(0, 3);
      setProducts(data);
    } catch {
      setError('Không thể tải sản phẩm');
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

  const toggleItemSelection = useCallback((productId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  }, []);

  const removeCartItem = useCallback((productId: string) => {
    const result = cartApi.removeFromCart(productId);
    if (result != null) {
      setSelectedItems((prev) => {
        if (prev.includes(productId)) {
          return prev.filter((id) => id !== productId);
        } else {
          return [...prev, productId];
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!cart || !selectedItems.length) {
      setCartSummary({
        originalPrice: 0,
        savings: 0,
        tax: 0,
        total: 0,
      });
      return;
    }

    let originalPrice = 0;
    let total = 0;

    cart.cartGroupResponses.forEach((group) => {
      group.items.forEach((item) => {
        if (selectedItems.includes(item.productId)) {
          originalPrice += item.totalPrice;
          total += item.totalPrice;
        }
      });
    });
    const savings = originalPrice - total;
    const tax = Math.round(total * 0.05);

    setCartSummary({
      originalPrice,
      savings,
      tax,
      total: total + tax,
    });
  }, [selectedItems, cart]);

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, [fetchCart, fetchAddresses]);

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
    toggleItemSelection,
    selectedItems,
    products,
    cartSummary,
    contacts,
    selectedAddressId,
    selectAddress,
    removeCartItem,
  };
}
export { useCart };
