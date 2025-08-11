import { authApi, IResponseObject } from '@retrade/util';

export interface RetradeRequest {
  orderItemId: string;
  quantity: number;
  price: number;
  shortDescription: string;
  description: string;
  thumbnail: string;
}

export interface RetradeResponse {
  retradeRecordedId: string;
  productId: string;
  retradeProductId: string;
}

export const retradeApi = {
  async createRetrade(request: RetradeRequest): Promise<RetradeResponse> {
    try {
      const response = await authApi.default.post<IResponseObject<RetradeResponse>>(
        '/product-histories/retrade',
        request,
      );

      if (response.data.success) {
        return response.data.content;
      }

      throw new Error(response.data.messages?.[0] || 'Failed to create retrade request');
    } catch (error) {
      throw error;
    }
  },
};
