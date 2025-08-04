import { authApi, IResponseObject } from '@retrade/util';

export type TSellerProfile = {
  id: string;
  shopName: string;
  accountId: string;
  description: string;
  addressLine: string;
  district: string;
  ward: string;
  state: string;
  avatarUrl: string;
  email: string;
  background: string;
  phoneNumber: string;
  verified: boolean;
  avgVote: number;
  createdAt: string;
  updatedAt: string;
};

export type TSellerMetricResponse = {
  productQuantity: number;
  avgVote: number;
  totalOrder: number;
  totalOrderSold: number;
};

const getSellerProfile = async (id: string): Promise<TSellerProfile | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TSellerProfile>>(`/sellers/${id}`);
    if (result.data.success && result.status === 200) {
      return result.data.content;
    }
  } catch {
    return undefined;
  }
};

const getSellerMetric = async (id: string): Promise<TSellerMetricResponse | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TSellerMetricResponse>>(
      `/sellers/${id}/metric`,
    );
    if (result.data.success && result.status === 200) {
      return result.data.content;
    }
  } catch {
    return undefined;
  }
};

export { getSellerMetric, getSellerProfile };
