import { authApi, IResponseObject } from '@retrade/util';

type SellerProfileRegisterRequest = {
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
  identityNumber: string;
};

type SellerProfileUpdateRequest = {
  shopName: string;
  description: string;
  // businessType: number;
  addressLine: string;
  avatarUrl: string;
  background: string;
  district: string;
  ward: string;
  state: string;
  email: string;
  phoneNumber: string;
};

type SellerProfileResponse = {
  id: string;
  shopName: string;
  description: string;
  businessType: number;
  addressLine: string;
  district: string;
  ward: string;
  state: string;
  avatarUrl: string;
  email: string;
  avgVote: number;
  identityVerifiedStatus: string;
  background: string;
  phoneNumber: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
};

type SellerStatusResponse = {
  canLogin: boolean;
  registered: boolean;
  banned: boolean;
  registerFailed: boolean;
};

export const sellerApi = {
  registerSeller: async (
    req: SellerProfileRegisterRequest,
  ): Promise<SellerProfileResponse | undefined> => {
    try {
      const response = await authApi.default.post<IResponseObject<SellerProfileResponse>>(
        '/sellers/register',
        req,
      );
      return response.data.content;
    } catch {
      return undefined;
    }
  },
  updateSellerProfile: async (
    req: SellerProfileUpdateRequest,
  ): Promise<IResponseObject<SellerProfileResponse>> => {
    const response = await authApi.default.put<IResponseObject<SellerProfileResponse>>(
      '/sellers/profile',
      req,
    );
    return response.data;
  },
  sellerVerification: async (req: {
    frontIdentity: File;
    backIdentity: File;
  }): Promise<SellerProfileResponse | undefined> => {
    try {
      const formData = new FormData();
      formData.append('frontSideIdentityCard', req.frontIdentity);
      formData.append('backSideIdentityCard', req.backIdentity);
      const response = await authApi.default.put<IResponseObject<SellerProfileResponse>>(
        '/sellers/identity/submit',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data.content;
    } catch {
      return undefined;
    }
  },
  sellerInformation: async (): Promise<SellerProfileResponse | undefined> => {
    try {
      const response =
        await authApi.default.get<IResponseObject<SellerProfileResponse>>('/sellers/profile');
      return response.data.content;
    } catch {
      return undefined;
    }
  },
  checkSellerStatus: async (): Promise<SellerStatusResponse | undefined> => {
    try {
      const response =
        await authApi.default.get<IResponseObject<SellerStatusResponse>>('/sellers/status');
      return response.data.content;
    } catch {
      return undefined;
    }
  },
};
export type {
  SellerProfileRegisterRequest,
  SellerProfileResponse,
  SellerProfileUpdateRequest,
  SellerStatusResponse,
};
