import { authApi,IResponseObject,unAuthApi } from "@retrade/util";
export type CreateOrderHistory={
  orderComboId: string;
  notes: string;
  newStatusId: string
}
export type OrderHistoryResponse = {
  id: string;
  orderComboId: string;
  oldOrderStatus: {
    id: string;
    code: string;
    name: string;
    enabled: boolean;
  };
  newOrderStatus: {
    id: string;
    code: string;
    name: string;
    enabled: boolean;
  };
  sellerId: string;
  notes: string;
  createdAt: string; 
  updatedAt: string;
};

export const orderHistoryApi ={
async updateStatusOrder(orderHistory: CreateOrderHistory): Promise<OrderHistoryResponse | null> {
  const response = await authApi.default.post<IResponseObject<OrderHistoryResponse>>(
    `/order-history`,
    orderHistory 
  );
  return response.data.success ? response.data.content : null;
}
}