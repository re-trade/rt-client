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
  background: string;
  phoneNumber: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
};

type SellerProfileUpdateRequest = Omit<
  SellerProfileRegisterRequest,
  'avatarUrl' | 'background' | 'identityNumber'
>;

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
  ): Promise<SellerProfileResponse | undefined> => {
    try {
      const response = await authApi.default.put<IResponseObject<SellerProfileResponse>>(
        '/sellers/profile',
        req,
      );
      return response.data.content;
    } catch {
      return undefined;
    }
  },
  sellerVerification: async (req: {
    frontIdentity: File;
    backIdentity: File;
  }): Promise<SellerProfileResponse | undefined> => {
    try {
      const formData = new FormData();
      formData.append('frontSideIdentityCard', req.frontIdentity);
      formData.append('backSideIdentityCard', req.backIdentity);
      const response = await authApi.default.post<IResponseObject<SellerProfileResponse>>(
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
};
