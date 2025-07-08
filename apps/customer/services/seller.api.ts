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

export { getSellerProfile };
