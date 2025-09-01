'use client';

import { paymentApi } from '@/services/payment.api';
import { useCallback, useState } from 'react';

export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  type: string;
  description: string;
  imgUrl: string;
}

export interface OrderPaymentMethodsState {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: string | null;
  isLoadingMethods: boolean;
  isInitializingPayment: boolean;
  error: string | null;
}

export function useOrderPaymentMethods() {
  const [state, setState] = useState<OrderPaymentMethodsState>({
    paymentMethods: [],
    selectedPaymentMethodId: null,
    isLoadingMethods: false,
    isInitializingPayment: false,
    error: null,
  });

  const getPaymentMethods = useCallback(async (): Promise<PaymentMethod[]> => {
    setState((prev) => ({
      ...prev,
      isLoadingMethods: true,
      error: null,
    }));

    try {
      const response = await paymentApi.getPaymentMethods();

      setState((prev) => ({
        ...prev,
        paymentMethods: response,
        isLoadingMethods: false,
        error: null,
      }));

      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Không thể tải phương thức thanh toán';

      setState((prev) => ({
        ...prev,
        isLoadingMethods: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, []);

  const selectPaymentMethod = useCallback((paymentMethodId: string) => {
    setState((prev) => ({
      ...prev,
      selectedPaymentMethodId: paymentMethodId,
      error: null,
    }));
  }, []);

  const initPayment = useCallback(
    async (payload: {
      paymentMethodId: string;
      paymentContent: string;
      orderId: string;
    }): Promise<string> => {
      if (!payload.paymentMethodId || !payload.orderId) {
        const error = new Error('Thông tin thanh toán không đầy đủ');
        setState((prev) => ({
          ...prev,
          error: error.message,
        }));
        throw error;
      }

      setState((prev) => ({
        ...prev,
        isInitializingPayment: true,
        error: null,
      }));

      try {
        const paymentUrl = await paymentApi.initPayment(payload);

        setState((prev) => ({
          ...prev,
          isInitializingPayment: false,
          error: null,
        }));

        return paymentUrl;
      } catch (error: any) {
        const errorMessage = error.message || 'Không thể khởi tạo thanh toán';

        setState((prev) => ({
          ...prev,
          isInitializingPayment: false,
          error: errorMessage,
        }));

        throw new Error(errorMessage);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      paymentMethods: [],
      selectedPaymentMethodId: null,
      isLoadingMethods: false,
      isInitializingPayment: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    getPaymentMethods,
    selectPaymentMethod,
    initPayment,
    clearError,
    resetState,
  };
}
