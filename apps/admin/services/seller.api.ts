import { authApi, IResponseObject } from '@retrade/util';

export type TSellerProfile = {
  id: string;
  shopName: string;
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
  createdAt: string;
  updatedAt: string;
};

const getSellers = async (
  page: number = 0,
  size: number = 10,
  query?: string,
): Promise<IResponseObject<TSellerProfile[]> | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TSellerProfile[]>>(`/sellers`, {
      params: {
        page,
        size,
        ...(query ? { q: query } : {}),
      },
    });
    if (result.data.success && result.status === 200) {
      return result.data;
    }
  } catch {
    return undefined;
  }
};

export { getSellers };
