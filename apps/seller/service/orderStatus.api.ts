import { authApi, IResponseObject } from '@retrade/util';
export type OrderStatusResponse = {
  id: string;
  name: string;
  code: string;
};

export const orderStatusApi = {
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
  async getNextStepOrderStaus(id: string):  Promise<OrderStatusResponse[]> {
    const response = await authApi.default.get<IResponseObject<OrderStatusResponse[]>>(
       `/order-status/next-step/${id}`,
    )
    return response.data.success ? response.data.content :[];
  },

};
