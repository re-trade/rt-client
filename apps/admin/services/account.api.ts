import { authApi, IResponseObject } from '@retrade/util';

export type RoleString = string;
export type RoleObject = {
  code: string;
  enabled: boolean;
  id?: string;
  name?: string;
  authority?: string;
  description?: string;
  role?: string;
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
  roles: RoleObject[];
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
  roles: RoleObject[];
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
      const normalizedRole = role.code || role.role || role.authority || role.name || role.id;
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

export const transformRoleToCorrectFormat = (role: Role): RoleObject => {
  if (typeof role === 'string') {
    return {
      code: role,
      enabled: true,
    };
  }

  if (typeof role === 'object' && role !== null) {
    const code = role.code || role.role || role.authority || role.name || role.id || 'UNKNOWN_ROLE';
    const enabled = role.enabled !== undefined ? role.enabled : true;

    return {
      code,
      enabled,
      ...role, // Preserve other properties
    };
  }

  return {
    code: 'UNKNOWN_ROLE',
    enabled: false,
  };
};

export const transformRolesToCorrectFormat = (roles: Role[]): RoleObject[] => {
  try {
    if (!roles || !Array.isArray(roles)) {
      return [];
    }
    return roles.map(transformRoleToCorrectFormat);
  } catch (error) {
    return [];
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
      // Transform roles to correct format
      const transformedContent = result.data.content.map((account) => ({
        ...account,
        roles: transformRolesToCorrectFormat(account.roles),
      }));

      return {
        ...result.data,
        content: transformedContent,
      };
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
      // Transform roles to correct format
      const transformedContent = {
        ...result.data.content,
        roles: transformRolesToCorrectFormat(result.data.content.roles),
      };

      return {
        ...result.data,
        content: transformedContent,
      };
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

// Test function to verify role transformation
export const testRoleTransformation = () => {
  console.log('Testing role transformation...');

  // Test case 1: String role
  const stringRole = 'ROLE_ADMIN';
  const transformedString = transformRoleToCorrectFormat(stringRole);
  console.log('String role transformation:', { input: stringRole, output: transformedString });

  // Test case 2: Object role with 'role' property
  const objectRoleWithRole = { role: 'ROLE_CUSTOMER', enabled: true };
  const transformedObjectRole = transformRoleToCorrectFormat(objectRoleWithRole);
  console.log('Object role with role property:', {
    input: objectRoleWithRole,
    output: transformedObjectRole,
  });

  // Test case 3: Object role with 'authority' property
  const objectRoleWithAuthority = { authority: 'ROLE_SELLER', enabled: false };
  const transformedObjectAuthority = transformRoleToCorrectFormat(objectRoleWithAuthority);
  console.log('Object role with authority property:', {
    input: objectRoleWithAuthority,
    output: transformedObjectAuthority,
  });

  // Test case 4: Object role with 'code' property (already correct)
  const objectRoleWithCode = { code: 'ROLE_ADMIN', enabled: true };
  const transformedObjectCode = transformRoleToCorrectFormat(objectRoleWithCode);
  console.log('Object role with code property:', {
    input: objectRoleWithCode,
    output: transformedObjectCode,
  });

  // Test case 5: Array of mixed roles
  const mixedRoles = [
    'ROLE_ADMIN',
    { role: 'ROLE_CUSTOMER', enabled: true },
    { authority: 'ROLE_SELLER', enabled: false },
    { code: 'ROLE_MODERATOR', enabled: true },
  ];
  const transformedArray = transformRolesToCorrectFormat(mixedRoles);
  console.log('Mixed roles array transformation:', { input: mixedRoles, output: transformedArray });

  console.log('Role transformation test completed!');
};

export {
  banAccount,
  banSeller,
  getAccountById,
  getAccounts,
  testRoleTransformation,
  toggleAccountStatus,
  transformRolesToCorrectFormat,
  transformRoleToCorrectFormat,
  unbanAccount,
  unbanSeller,
  updateAccountRoles,
};
