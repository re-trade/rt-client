/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi, IResponseObject } from '@retrade/util';

export interface PaymentInitRequest {
  paymentMethodId: string;
  paymentContent: string;
  orderId: string;
}

export const paymentApi = {
  async initPayment(payload: PaymentInitRequest): Promise<any> {
    try {
      const response = await authApi.default.post<IResponseObject<any>>('/payments/init', payload);
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to initialize payment');
    } catch (error) {
      throw error;
    }
  },
};
