import { getDeviceInfo } from '@/lib/device-fingerprint';
import { authApi, ETokenName, IResponseObject, unAuthApi } from '@retrade/util';

export type TLocalLogin = {
  username: string;
  password: string;
};

type TTokenResponse = {
  tokens: { ACCESS_TOKEN: string; REFRESH_TOKEN: string };
  roles: string[];
  twoFA: boolean;
};

export type TAccountMeResponse = {
  id: string;
  username: string;
  email: string;
  phone: string;
  enabled: boolean;
  locked: boolean;
  using2FA: boolean;
  joinInDate: string;
  changedUsername: boolean;
  lastLogin?: string;
  roles: string[];
};

export type TSeller = {
  id: string;
  createdDate: string;
  updatedDate: string;
  address: string;
  avatarUrl: string;
  background: string;
  businessType: string;
  description: string;
  email: string;
  frontSideIdentityCard: string;
  backSideIdentityCard: string;
  identityNumber: string;
  phoneNumber: string;
  shopName: string;
  taxCode: string;
  verified: boolean;
  accountId: string;
};

const loginInternal = async (loginForm: TLocalLogin): Promise<void> => {
  const deviceInfo = await getDeviceInfo();
  const result = await unAuthApi.default.post<IResponseObject<TTokenResponse>>(
    '/auth/local',
    { ...loginForm },
    {
      headers: {
        'x-device-fingerprint': encodeURIComponent(deviceInfo.deviceFingerprint),
        'x-device-name': encodeURIComponent(deviceInfo.deviceName),
        'x-ip-address': encodeURIComponent(deviceInfo.ipAddress),
        'x-location': encodeURIComponent(deviceInfo.location),
      },
    },
  );
  if (result.data.success && result.status === 200) {
    const { ACCESS_TOKEN } = result.data.content.tokens;
    localStorage.setItem(ETokenName.ACCESS_TOKEN, ACCESS_TOKEN);
  }
};

const accountMe = async (): Promise<TAccountMeResponse | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TAccountMeResponse>>('/accounts/me');
    if (result.data.success && result.status === 200) {
      const { content } = result.data;
      return content;
    }
  } catch {
    return undefined;
  }
  return undefined;
};

const logout = async (): Promise<boolean> => {
  try {
    const result = await authApi.default.get<IResponseObject<TAccountMeResponse>>('/auth/logout');
    if (result.data.success && result.status === 200) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};

export const AuthSellerApi = {
  async register(): Promise<TSeller> {
    const response = await authApi.default.post<TSeller>('/auth/seller/register');
    if (response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to register seller');
  },
  async getShopSeller(id: string): Promise<TSeller> {
    const response = await authApi.default.get<TSeller>(`/auth/seller/${id}`);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to get seller seller');
  },
  async updateShopSeller(id: string, data: Partial<TSeller>): Promise<TSeller> {
    const response = await authApi.default.put<TSeller>(`/auth/seller/${id}`, data);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to update seller seller');
  },
};

export { accountMe, loginInternal, logout };
