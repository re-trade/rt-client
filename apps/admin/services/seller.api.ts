import { authApi, IResponseObject } from '@retrade/util';

export type TSellerProfile = {
  id: string;
  accountId: string;
  shopName: string;
  description: string;
  businessType: string | null;
  addressLine: string;
  district: string;
  ward: string;
  state: string;
  avatarUrl: string | null;
  email: string;
  background: string | null;
  phoneNumber: string;
  verified: boolean;
  identityVerifiedStatus: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'UNVERIFIED';
  createdAt: string;
  updatedAt: string;
};

interface ApproveSellerRequest {
  sellerId: string;
  forced: boolean;
  approve: boolean;
}

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

const getSeller = async (id: string): Promise<IResponseObject<TSellerProfile>> => {
  const result = await authApi.default.get<IResponseObject<TSellerProfile>>(`/sellers/${id}`);
  if (result.data.success) {
    return result.data;
  }
  throw new Error('Seller not found');
};

const getIdCardImage = async (id: string, cardType: 'FRONT' | 'BACK'): Promise<string | null> => {
  try {
    const result = await authApi.default.get(`/sellers/${id}/id-card`, {
      params: { cardType },
      responseType: 'blob',
    });

    if (result.status === 200) {
      const blob = new Blob([result.data], { type: 'image/jpeg' });
      return URL.createObjectURL(blob);
    }
  } catch {
    return null;
  }
  return null;
};

const approveSeller = async (
  sellerId: string,
  approve: boolean,
  forced: boolean = true,
): Promise<IResponseObject<any> | undefined> => {
  try {
    const payload: ApproveSellerRequest = {
      sellerId,
      forced,
      approve,
    };

    const result = await authApi.default.patch<IResponseObject<any>>(`/sellers/approve`, payload);
    if (result.data.success) {
      return result.data;
    }
  } catch {
    return undefined;
  }
  return undefined;
};

const banSeller = async (id: string): Promise<IResponseObject<null> | undefined> => {
  const result = await authApi.default.put<IResponseObject<null>>(`/sellers/${id}/ban-seller`);
  if (result.data.success) {
    return result.data;
  } else return undefined;
};

const unbanSeller = async (id: string): Promise<IResponseObject<null> | undefined> => {
  const result = await authApi.default.put<IResponseObject<null>>(`/sellers/${id}/unban-seller`);
  if (result.data.success) {
    return result.data;
  } else return undefined;
};

export { approveSeller, banSeller, getIdCardImage, getSeller, getSellers, unbanSeller };
