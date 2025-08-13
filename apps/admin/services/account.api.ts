import { authApi, IResponseObject } from '@retrade/util';

export type AccountResponse = {
  id: string;
  username: string;
  email: string;
  enabled: boolean;
  locked: boolean;
  using2FA: boolean;
  changedUsername: boolean;
  lastLogin: string;
  joinInDate: string;
  roles: string[];
};

export type CustomerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  avatarUrl: string;
  username: string;
  email: string;
  gender: number;
  enabled: boolean;
  locked: boolean;
  lastUpdate: string;
};

export type SellerProfile = {
  id: string;
  accountId: string;
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
  avgVote: number;
  identityVerifiedStatus: string;
  createdAt: string;
  updatedAt: string;
};

export type DetailedAccountResponse = {
  id: string;
  username: string;
  email: string;
  enabled: boolean;
  locked: boolean;
  using2FA: boolean;
  changedUsername: boolean;
  lastLogin: string;
  joinInDate: string;
  roles: string[];
  customerProfile?: CustomerProfile;
  sellerProfile?: SellerProfile;
};

const getAccounts = async (
  page: number = 0,
  size: number = 10,
  query?: string,
): Promise<IResponseObject<AccountResponse[]> | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<AccountResponse[]>>('/accounts', {
      params: {
        page,
        size,
        ...(query ? { q: query } : {}),
      },
    });
    if (result.data.success && result.status === 200) {
      return result.data;
    }
    return undefined;
  } catch {
    return undefined;
  }
};

const toggleAccountStatus = async (accountId: string, enabled: boolean): Promise<boolean> => {
  try {
    const result = await authApi.default.patch(`/accounts/${accountId}/status`, {
      enabled,
    });
    return result.data.success && result.status === 200;
  } catch {
    return false;
  }
};

const updateAccountRoles = async (accountId: string, roles: string[]): Promise<boolean> => {
  try {
    const result = await authApi.default.patch(`/accounts/${accountId}/roles`, {
      roles,
    });
    return result.data.success && result.status === 200;
  } catch {
    return false;
  }
};

const getAccountById = async (
  accountId: string,
): Promise<IResponseObject<DetailedAccountResponse> | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<DetailedAccountResponse>>(
      `/accounts/${accountId}`,
    );
    if (result.data.success && result.status === 200) {
      return result.data;
    }
    return undefined;
  } catch {
    return undefined;
  }
};

export { getAccountById, getAccounts, toggleAccountStatus, updateAccountRoles };
