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

const getAccounts = async (): Promise<IResponseObject<AccountResponse[]> | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<AccountResponse[]>>('/accounts/me');
    if (result.data.success && result.status === 200) {
      return result.data;
    }
    return undefined;
  } catch {
    return undefined;
  }
};

export { getAccounts };
