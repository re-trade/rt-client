'use client';
import { cartApi, CartGroupResponse, CartResponse } from '@/services/cart.api';
import { contactApi, TAddress } from '@/services/contact.api';
import { productApi, TProduct } from '@/services/product.api';
import { CreateOrderRequest, orderApi, OrderResponse } from '@services/order.api';
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
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isCreateOrder, setIsCreateOrder] = useState<boolean>(false);

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

  const createOrder = useCallback(
    async (payload: CreateOrderRequest): Promise<OrderResponse | null> => {
      try {
        setIsCreateOrder(true);
        return await orderApi.createOrder(payload);
        setIsCreateOrder(false);
      } catch {
        setIsCreateOrder(false);
        return null;
      }
    },
    [],
  );

  const fetchAddresses = useCallback(async () => {
    try {
      const data = await contactApi.getContacts();
      setContacts(data);
    } catch {
      setError('Không thể tải địa chỉ');
    }
  }, []);

  const fetchRecommendProduct = useCallback(async (silent = false) => {
    if (!silent) {
      setProductsLoading(true);
    }
    try {
      const data = await productApi.getProducts(0, 6);
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
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
        const response = await cartApi.addToCart(productId, quantity);
        if (response.success) {
          await fetchCart(true);
          return {
            success: response.success,
            message: response.messages,
          };
        }
        return {
          success: response.success,
          message: response.messages,
        };
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
        const response = await cartApi.removeFromCart(productId);
        if (!response.success) {
          return {
            success: response.success,
            message: response.messages,
          };
        }
        setSelectedItems((prev) => prev.filter((item) => item.productId !== productId));
        await fetchCart(true);
        return {
          success: response.success,
          message: response.messages,
        };
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
        const response = await cartApi.updateCartItemQuantity(productId, quantity);
        if (!response.success) {
          return {
            success: response.success,
            message: response.messages,
          };
        }

        setSelectedItems((prev) =>
          prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
        );

        await fetchCart(true);
        return {
          success: response.success,
          message: response.messages,
        };
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
        const selectedItem = selectedItems.find(
          (selected) => selected.productId === item.productId,
        );
        if (selectedItem) {
          // Use the current quantity from selectedItems, which should be updated when quantity changes
          const itemTotal = item.totalPrice * selectedItem.quantity;
          originalPrice += itemTotal;
          total += itemTotal;
        }
      });
    });

    setCartSummary({
      originalPrice,
      tax: 0, // Tax removed as requested
      total: total, // Total without tax
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
    productsLoading,
    error,
    refreshing,
    refresh: fetchCart,
    refreshProducts: fetchRecommendProduct,
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
    createOrder,
    isCreateOrder,
    refreshAddresses: fetchAddresses,
  };
}

export { useCart };
