import { authApi, IResponseObject } from '@retrade/util';

type TCustomerProfileResponse = {
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

type TCustomerBaseMetricResponse = {
  boughtItems: number;
  orderPlace: number;
  orderComplete: number;
  walletBalance: number;
};

type TCustomerProfileRequest = Omit<
  TCustomerProfileResponse,
  'id' | 'lastUpdate' | 'email' | 'username'
>;

const profileApi = {
  async updateCustomerProfile(
    data: TCustomerProfileRequest,
  ): Promise<TCustomerProfileResponse | undefined> {
    const response = await authApi.default.put<IResponseObject<TCustomerProfileResponse>>(
      `/customers/profile`,
      data,
    );
    return response.data.success ? response.data.content : undefined;
  },
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
  async uploadAvatar(file: File): Promise<string | undefined> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await authApi.storage.post<IResponseObject<string>>(
        '/files/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data.success ? response.data.content : undefined;
    } catch {
      return undefined;
    }
  },
  async updateAvatar(avatarUrl: string): Promise<void> {
    await authApi.default.put<IResponseObject<string>>(
      '/customers/profile/avatar',
      {},
      {
        params: { avatarUrl },
      },
    );
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
export { profileApi };
export type { TCustomerBaseMetricResponse, TCustomerProfileRequest, TCustomerProfileResponse };
