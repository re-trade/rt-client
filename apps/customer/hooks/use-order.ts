'use client';

import { CreateOrderRequest, orderApi, OrderResponse } from '@/services/order.api';
import { useCallback, useState } from 'react';

export interface OrderState {
  currentOrder: OrderResponse | null;
  isCreating: boolean;
  error: string | null;
  success: boolean;
}

export function useOrder() {
  const [orderState, setOrderState] = useState<OrderState>({
    currentOrder: null,
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
          currentOrder: response,
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

  const getOrderById = useCallback(async (orderId: string): Promise<OrderResponse | null> => {
    setOrderState((prev) => ({
      ...prev,
      isCreating: true,
      error: null,
    }));

    try {
      const response = await orderApi.getOrderById(orderId);

      setOrderState((prev) => ({
        ...prev,
        currentOrder: response,
        isCreating: false,
        error: null,
      }));

      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Không thể tải đơn hàng';

      setOrderState((prev) => ({
        ...prev,
        isCreating: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, []);

  const getMyOrders = useCallback(async (): Promise<OrderResponse[]> => {
    setOrderState((prev) => ({
      ...prev,
      isCreating: true,
      error: null,
    }));

    try {
      const response = await orderApi.getMyOrders();

      setOrderState((prev) => ({
        ...prev,
        isCreating: false,
        error: null,
      }));

      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Không thể tải danh sách đơn hàng';

      setOrderState((prev) => ({
        ...prev,
        isCreating: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, []);

  const resetOrderState = useCallback(() => {
    setOrderState({
      currentOrder: null,
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

  return {
    ...orderState,
    createOrder,
    getOrderById,
    getMyOrders,
    resetOrderState,
    clearError,
  };
}
