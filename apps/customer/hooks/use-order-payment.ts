'use client';

import { PaymentHistoryItem, paymentApi } from '@/services/payment.api';
import { useCallback, useState } from 'react';

export interface OrderPaymentState {
  paymentStatus: { paid: boolean; orderId: string } | null;
  paymentHistory: PaymentHistoryItem[];
  isLoadingStatus: boolean;
  isLoadingHistory: boolean;
  error: string | null;
}

export function useOrderPayment() {
  const [state, setState] = useState<OrderPaymentState>({
    paymentStatus: null,
    paymentHistory: [],
    isLoadingStatus: false,
    isLoadingHistory: false,
    error: null,
  });

  const fetchPaymentStatus = useCallback(async (orderId: string) => {
    setState((prev) => ({
      ...prev,
      isLoadingStatus: true,
      error: null,
    }));

    try {
      const response = await paymentApi.getOrderPaymentStatus(orderId);

      setState((prev) => ({
        ...prev,
        paymentStatus: response,
        isLoadingStatus: false,
        error: null,
      }));

      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Không thể tải trạng thái thanh toán';

      setState((prev) => ({
        ...prev,
        isLoadingStatus: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, []);

  const fetchPaymentHistory = useCallback(async (orderId: string) => {
    setState((prev) => ({
      ...prev,
      isLoadingHistory: true,
      error: null,
    }));

    try {
      const response = await paymentApi.getPaymentHistory(orderId);

      setState((prev) => ({
        ...prev,
        paymentHistory: response,
        isLoadingHistory: false,
        error: null,
      }));

      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Không thể tải lịch sử thanh toán';

      setState((prev) => ({
        ...prev,
        isLoadingHistory: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, []);

  const refreshPaymentData = useCallback(
    async (orderId: string) => {
      try {
        await Promise.all([fetchPaymentStatus(orderId), fetchPaymentHistory(orderId)]);
      } catch (error) {
        console.error('Failed to refresh payment data:', error);
      }
    },
    [fetchPaymentStatus, fetchPaymentHistory],
  );

  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      paymentStatus: null,
      paymentHistory: [],
      isLoadingStatus: false,
      isLoadingHistory: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    fetchPaymentStatus,
    fetchPaymentHistory,
    refreshPaymentData,
    clearError,
    resetState,
  };
}
