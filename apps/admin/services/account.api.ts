import { authApi, IResponseObject } from '@retrade/util';

export type RoleString = string;
export type RoleObject = {
  id?: string;
  name?: string;
  authority?: string;
  description?: string;
  role?: string;
  enabled?: boolean;
};
export type Role = RoleString | RoleObject;

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
  roles: Role[];
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
  roles: Role[];
  customerProfile?: CustomerProfile;
  sellerProfile?: SellerProfile;
};

export type BanType = 'account' | 'seller';

export type BanAction = 'ban' | 'unban';

export interface BanRequest {
  accountId: string;
  banType: BanType;
  action: BanAction;
}

export const normalizeRole = (role: Role): string => {
  try {
    if (typeof role === 'string') {
      return role;
    }

    if (typeof role === 'object' && role !== null) {
      const normalizedRole = role.role || role.authority || role.name || role.id;
      if (normalizedRole) {
        return normalizedRole;
      }
    }

    return 'UNKNOWN_ROLE';
  } catch (error) {
    return 'ERROR_ROLE';
  }
};

export const normalizeRoles = (roles: Role[]): string[] => {
  try {
    if (!roles) {
      return [];
    }
    if (!Array.isArray(roles)) {
      return [];
    }
    return roles
      .filter((role) => {
        if (typeof role === 'object' && role !== null && 'enabled' in role) {
          return role.enabled === true;
        }
        return true;
      })
      .map(normalizeRole)
      .filter((role) => role && role !== 'UNKNOWN_ROLE' && role !== 'ERROR_ROLE');
  } catch (error) {
    return [];
  }
};

export const getRoleDisplayName = (role: Role): string => {
  if (typeof role === 'string' && role === 'All') {
    return 'All';
  }

  const normalizedRole = normalizeRole(role);

  if (normalizedRole === 'UNKNOWN_ROLE' || normalizedRole === 'ERROR_ROLE') {
    return 'Unknown';
  }

  const roleDisplayMap: Record<string, string> = {
    ROLE_ADMIN: 'Admin',
    ROLE_CUSTOMER: 'Customer',
    ROLE_SELLER: 'Seller',
  };

  return roleDisplayMap[normalizedRole] || normalizedRole.replace('ROLE_', '') || 'Unknown';
};

export const hasRole = (roles: Role[], targetRole: string): boolean => {
  try {
    if (!roles || !Array.isArray(roles) || !targetRole) {
      return false;
    }
    const normalizedRoles = normalizeRoles(roles);
    return normalizedRoles.includes(targetRole);
  } catch (error) {
    return false;
  }
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
  } catch (error) {
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
  } catch (error) {
    return undefined;
  }
};

const banAccount = async (accountId: string): Promise<boolean> => {
  try {
    const result = await authApi.default.patch<IResponseObject<void>>(
      `/accounts/${accountId}/ban`,
      {},
    );
    return result.data.success && result.status === 200;
  } catch {
    return false;
  }
};

const unbanAccount = async (accountId: string): Promise<boolean> => {
  try {
    const result = await authApi.default.patch<IResponseObject<void>>(
      `/accounts/${accountId}/unban`,
      {},
    );
    return result.data.success && result.status === 200;
  } catch {
    return false;
  }
};

const banSeller = async (accountId: string): Promise<boolean> => {
  try {
    const result = await authApi.default.patch<IResponseObject<void>>(
      `/accounts/${accountId}/seller/ban`,
      {},
    );
    return result.data.success && result.status === 200;
  } catch {
    return false;
  }
};

const unbanSeller = async (accountId: string): Promise<boolean> => {
  try {
    const result = await authApi.default.patch<IResponseObject<void>>(
      `/accounts/${accountId}/seller/unban`,
      {},
    );
    return result.data.success && result.status === 200;
  } catch {
    return false;
  }
};

export {
  banAccount,
  banSeller,
  getAccountById,
  getAccounts,
  toggleAccountStatus,
  unbanAccount,
  unbanSeller,
  updateAccountRoles,
};
