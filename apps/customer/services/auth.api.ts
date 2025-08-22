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

type TAccountMeResponse = {
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

type TRegister = {
  username: string;
  password: string;
  rePassword: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
};
const loginInternal = async (loginForm: TLocalLogin): Promise<void> => {
  const deviceInfo = await getDeviceInfo();
  try {
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
  } catch {
    throw new Error('Đăng nhập thất bại. Xin hãy kiểm tra tên đăng nhập và mật khẩu.');
  }
};

const registerInternal = async (registerForm: TRegister): Promise<void> => {
  await unAuthApi.default.post<IResponseObject<TTokenResponse>>('/registers/customers/account', {
    ...registerForm,
  });
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

const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const result = await authApi.default.get<IResponseObject<{ existed: boolean }>>(
      `/accounts/check-username?username=${username}`,
    );
    if (result.data.success && result.status === 200) {
      const { content } = result.data;
      return !content.existed;
    }
  } catch {
    return false;
  }
  return false;
};

export type { TAccountMeResponse };

const register2FAInternal = async (width: number = 300, height: number = 300): Promise<Blob> => {
  const response = await authApi.default.post<Blob>(
    `/auth/register/2fa?width=${width}&height=${height}`,
    null,
    {
      responseType: 'blob',
      headers: {
        Accept: 'image/png',
      },
    },
  );

  return response.data;
};

const callLogout = async (): Promise<boolean> => {
  try {
    const result = await authApi.default.post<IResponseObject<TAccountMeResponse>>('/auth/logout');
    if (result.data.success && result.status === 200) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
export {
  accountMe,
  callLogout,
  checkUsernameAvailability,
  loginInternal,
  register2FAInternal,
  registerInternal,
};
