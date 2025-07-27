import { IResponseObject, unAuthApi } from '@retrade/util';

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
};
