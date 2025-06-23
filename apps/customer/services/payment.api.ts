import { authApi, IResponseObject } from '@retrade/util';

export interface PaymentInitRequest {
  paymentMethodId: string;
  paymentContent: string;
  orderId: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  type: string;
  description: string;
  imgUrl: string;
}

export interface PaymentMethodsResponse {
  content: PaymentMethod[];
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
}

export const paymentApi = {
  async initPayment(payload: PaymentInitRequest): Promise<string> {
    try {
      const response = await authApi.default.post<IResponseObject<string>>(
        '/payments/init',
        payload,
      );
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to initialize payment');
    } catch (error) {
      throw error;
    }
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await authApi.default.get<IResponseObject<PaymentMethod[]>>(
        '/payments/methods?page=0&size=10',
      );
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to fetch payment methods');
    } catch (error) {
      throw error;
    }
  },
};
