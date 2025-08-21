import { authApi, IResponseObject } from '@retrade/util';

export type TCustomerProfileResponse = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  avatarUrl: string;
  username: string;
  email: string;
  gender: number;
  lastUpdate: string;
};

export type TCustomerBaseMetricResponse = {
  boughtItems: number;
  orderPlace: number;
  orderComplete: number;
  walletBalance: number;
};

export type TCustomerProfileRequest = Omit<
  TCustomerProfileResponse,
  'id' | 'lastUpdate' | 'email' | 'username'
>;

export const customerProfileApi = {
  async getCustomerProfile(): Promise<TCustomerProfileResponse | undefined> {
    try {
      const result =
        await authApi.default.get<IResponseObject<TCustomerProfileResponse>>('/customers/profile');
      if (result.data.success && result.status === 200) {
        const { content } = result.data;
        return content;
      }
    } catch {
      return undefined;
    }
    return undefined;
  },

  async updateCustomerProfile(
    data: TCustomerProfileRequest,
  ): Promise<TCustomerProfileResponse | undefined> {
    const response = await authApi.default.put<IResponseObject<TCustomerProfileResponse>>(
      `/customers/profile`,
      data,
    );
    return response.data.success ? response.data.content : undefined;
  },

  async getCustomerBaseMetric(): Promise<TCustomerBaseMetricResponse | undefined> {
    try {
      const result =
        await authApi.default.get<IResponseObject<TCustomerBaseMetricResponse>>(
          '/customers/metric',
        );
      if (result.data.success && result.status === 200) {
        const { content } = result.data;
        return content;
      }
    } catch {}
  },
};
