'use client';

import { PaymentInitRequest, PaymentStatusResponse, paymentApi } from '@/services/payment.api';
import { useCallback, useState } from 'react';

export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  type: string;
  description: string;
  imgUrl: string;
}

export interface PaymentState {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: string | null;
  isLoadingMethods: boolean;
  isInitializingPayment: boolean;
  isLoadingStatus: boolean;
  error: string | null;
}

export function usePayment() {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    paymentMethods: [],
    selectedPaymentMethodId: null,
    isLoadingMethods: false,
    isInitializingPayment: false,
    isLoadingStatus: false,
    error: null,
  });

  const getPaymentMethods = useCallback(async (): Promise<PaymentMethod[]> => {
    setPaymentState((prev) => ({
      ...prev,
      isLoadingMethods: true,
      error: null,
    }));

    try {
      const response = await paymentApi.getPaymentMethods();

      setPaymentState((prev) => ({
        ...prev,
        paymentMethods: response,
        isLoadingMethods: false,
        error: null,
      }));

      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Không thể tải phương thức thanh toán';

      setPaymentState((prev) => ({
        ...prev,
        isLoadingMethods: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, []);

  const selectPaymentMethod = useCallback((paymentMethodId: string) => {
    setPaymentState((prev) => ({
      ...prev,
      selectedPaymentMethodId: paymentMethodId,
    }));
  }, []);

  const initPayment = useCallback(async (payload: PaymentInitRequest): Promise<string | null> => {
    setPaymentState((prev) => ({
      ...prev,
      isInitializingPayment: true,
      error: null,
    }));

    try {
      const response = await paymentApi.initPayment(payload);

      setPaymentState((prev) => ({
        ...prev,
        isInitializingPayment: false,
        error: null,
      }));

      // Return the payment URL from the response content
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Không thể khởi tạo thanh toán';

      setPaymentState((prev) => ({
        ...prev,
        isInitializingPayment: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, []);

  const getPaymentStatus = useCallback(async (orderId: string): Promise<PaymentStatusResponse> => {
    setPaymentState((prev) => ({
      ...prev,
      isLoadingStatus: true,
      error: null,
    }));

    try {
      const response = await paymentApi.getPaymentStatus(orderId);

      setPaymentState((prev) => ({
        ...prev,
        isLoadingStatus: false,
        error: null,
      }));

      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Không thể tải trạng thái thanh toán';

      setPaymentState((prev) => ({
        ...prev,
        isLoadingStatus: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, []);

  const resetPaymentState = useCallback(() => {
    setPaymentState({
      paymentMethods: [],
      selectedPaymentMethodId: null,
      isLoadingMethods: false,
      isInitializingPayment: false,
      isLoadingStatus: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setPaymentState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    ...paymentState,
    getPaymentMethods,
    selectPaymentMethod,
    initPayment,
    getPaymentStatus,
    resetPaymentState,
    clearError,
  };
}
