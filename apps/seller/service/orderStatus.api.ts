import { authApi, IResponseObject } from '@retrade/util';
export type OrderStatusResponse = {
  id: string;
  name: string;
  code: string;
};

export const orderStatusApi = {
  async getAllOrderStatuses(): Promise<OrderStatusResponse[]> {
    const response =
      await authApi.default.get<IResponseObject<OrderStatusResponse[]>>(`/orders/status`);
    return response.data.success ? response.data.content : [];
  },
  async getOrderStatusById(id: string): Promise<OrderStatusResponse | null> {
    const response = await authApi.default.get<IResponseObject<OrderStatusResponse>>(
      `/orders/status/${id}`,
    );
    return response.data.success ? response.data.content : null;
  },
};
