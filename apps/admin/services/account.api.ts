import { authApi, IPaginationResponse, IResponseObject } from '@retrade/util';

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

export type AccountPaginationResponse = IPaginationResponse<AccountResponse>;

const getAccounts = async (
  page: number = 0,
  size: number = 10,
  query?: string,
): Promise<IResponseObject<AccountPaginationResponse> | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<AccountPaginationResponse>>(
      '/accounts',
      {
        params: {
          page,
          size,
          ...(query ? { q: query } : {}),
        },
      },
    );
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

export { getAccounts, toggleAccountStatus, updateAccountRoles };
