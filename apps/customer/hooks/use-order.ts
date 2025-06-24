'use client';

import {
  CreateOrderRequest,
  GetOrdersParams,
  orderApi,
  OrderCombo,
  OrderResponse,
  OrdersResponse,
} from '@/services/order.api';
import { useCallback, useState } from 'react';

export interface OrderState {
  currentOrder: OrderCombo | null; // Changed from OrderResponse to OrderCombo
  orders: OrderCombo[];
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  } | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  success: boolean;
}

export function useOrder() {
  const [orderState, setOrderState] = useState<OrderState>({
    currentOrder: null,
    orders: [],
    pagination: null,
    isLoading: false,
    isCreating: false,
    error: null,
    success: false,
  });

  const createOrder = useCallback(
    async (payload: CreateOrderRequest): Promise<OrderResponse | null> => {
      setOrderState((prev) => ({
        ...prev,
        isCreating: true,
        error: null,
        success: false,
      }));

      try {
        const response = await orderApi.createOrder(payload);

        setOrderState((prev) => ({
          ...prev,
          isCreating: false,
          success: true,
          error: null,
        }));

        return response;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Không thể tạo đơn hàng';

        setOrderState((prev) => ({
          ...prev,
          isCreating: false,
          error: errorMessage,
          success: false,
        }));

        throw error;
      }
    },
    [],
  );

  const getOrderById = useCallback(async (orderId: string): Promise<OrderCombo | null> => {
    setOrderState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await orderApi.getOrderById(orderId);

      setOrderState((prev) => ({
        ...prev,
        currentOrder: response,
        isLoading: false,
        error: null,
      }));

      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Không thể tải đơn hàng';

      setOrderState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, []);

  const getMyOrders = useCallback(
    async (params: GetOrdersParams = {}): Promise<OrdersResponse | null> => {
      setOrderState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await orderApi.getMyOrders(params);

        setOrderState((prev) => ({
          ...prev,
          orders: response.content,
          pagination: response.pagination,
          isLoading: false,
          error: null,
        }));

        return response;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Không thể tải danh sách đơn hàng';

        setOrderState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [],
  );

  const loadMoreOrders = useCallback(
    async (params: GetOrdersParams = {}): Promise<void> => {
      if (!orderState.pagination || orderState.isLoading) return;

      const nextPage = orderState.pagination.page + 1;
      if (nextPage >= orderState.pagination.totalPages) return;

      setOrderState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await orderApi.getMyOrders({
          ...params,
          page: nextPage,
        });

        setOrderState((prev) => ({
          ...prev,
          orders: [...prev.orders, ...response.content],
          pagination: response.pagination,
          isLoading: false,
          error: null,
        }));
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Không thể tải thêm đơn hàng';

        setOrderState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    },
    [orderState.pagination, orderState.isLoading],
  );

  const resetOrderState = useCallback(() => {
    setOrderState({
      currentOrder: null,
      orders: [],
      pagination: null,
      isLoading: false,
      isCreating: false,
      error: null,
      success: false,
    });
  }, []);

  const clearError = useCallback(() => {
    setOrderState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  const clearCurrentOrder = useCallback(() => {
    setOrderState((prev) => ({
      ...prev,
      currentOrder: null,
      error: null,
    }));
  }, []);

  return {
    ...orderState,
    createOrder,
    getOrderById,
    getMyOrders,
    loadMoreOrders,
    resetOrderState,
    clearError,
    clearCurrentOrder,
  };
}
