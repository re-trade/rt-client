import { authApi, IResponseObject, unAuthApi } from '@retrade/util';

export interface OrderStatusResponse {
  id: string;
  code: string;
  name: string;
  enabled: boolean;
}

export const orderStatusApi = {
  async getOrderStatuses(page: number = 0, size: number = 20): Promise<OrderStatusResponse[]> {
    const response = await unAuthApi.default.get<IResponseObject<OrderStatusResponse[]>>(
      '/orders/status',
      {
        params: {
          page,
          size,
        },
      },
    );
    if (response.data.success) {
      return response.data.content;
    }
    return [];
  },

  async getAllOrderStatuses(): Promise<OrderStatusResponse[]> {
    const response =
      await authApi.default.get<IResponseObject<OrderStatusResponse[]>>(`/order-status`);
    return response.data.success ? response.data.content : [];
  },

  async getOrderStatusById(id: string): Promise<OrderStatusResponse | null> {
    const response = await authApi.default.get<IResponseObject<OrderStatusResponse>>(
      `/order-status/${id}`,
    );
    return response.data.success ? response.data.content : null;
  },

  async getNextStepOrderStaus(id: string): Promise<OrderStatusResponse[]> {
    const response = await authApi.default.get<IResponseObject<OrderStatusResponse[]>>(
      `/order-status/next-step/${id}`,
    );
    return response.data.success ? response.data.content : [];
  },
};
