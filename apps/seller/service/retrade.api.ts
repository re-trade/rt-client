import { authApi, IResponseObject } from '@retrade/util';

export interface RetradeRequest {
  orderId: string;
  itemId: string;
  quantity: number;
}

export interface RetradeResponse {
  id: string;
  orderId: string;
  itemId: string;
  productId: string;
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const retradeApi = {
  async createRetrade(request: RetradeRequest): Promise<RetradeResponse> {
    try {
      const response = await authApi.default.post<IResponseObject<RetradeResponse>>(
        '/retrade/request',
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

  async getRetradeRequests(
    page: number = 0,
    size: number = 10,
  ): Promise<{
    content: RetradeResponse[];
    pagination: {
      page: number;
      size: number;
      totalPages: number;
      totalElements: number;
    };
  }> {
    try {
      const response = await authApi.default.get<
        IResponseObject<{
          content: RetradeResponse[];
          pagination: {
            page: number;
            size: number;
            totalPages: number;
            totalElements: number;
          };
        }>
      >('/retrade/requests', {
        params: {
          page,
          size,
        },
      });

      if (response.data.success) {
        return response.data.content;
      }

      throw new Error(response.data.messages?.[0] || 'Failed to fetch retrade requests');
    } catch (error) {
      throw error;
    }
  },

  async getRetradeRequestById(id: string): Promise<RetradeResponse> {
    try {
      const response = await authApi.default.get<IResponseObject<RetradeResponse>>(
        `/retrade/request/${id}`,
      );

      if (response.data.success) {
        return response.data.content;
      }

      throw new Error(response.data.messages?.[0] || 'Failed to fetch retrade request');
    } catch (error) {
      throw error;
    }
  },

  async cancelRetradeRequest(id: string): Promise<void> {
    try {
      const response = await authApi.default.post<IResponseObject<void>>(
        `/retrade/request/${id}/cancel`,
      );

      if (!response.data.success) {
        throw new Error(response.data.messages?.[0] || 'Failed to cancel retrade request');
      }
    } catch (error) {
      throw error;
    }
  },
};
