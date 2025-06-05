import { unAuthApi } from '@/configs/axios.config';
import { getDeviceInfo } from '@/lib/device-fingerprint';
import { IResponseObject } from '@/services/base.api';

type TLocalLogin = {
  username: string;
  password: string;
};

type TTokenResponse = {
  tokens: { accessToken: string; refreshToken: string };
  roles: string[];
  twoFA: boolean;
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
  avatarUrl: string;
};

type IUserAccount = {
  id: string;
  username: string;
  email: string;
  enabled: boolean;
  locked: boolean;
  using2FA: boolean;
  joinInDate: string;
  roles: string[];
};

const loginInternal = async (loginForm: TLocalLogin): Promise<void> => {
  const deviceInfo = await getDeviceInfo();

  const result = await unAuthApi.post<IResponseObject<TTokenResponse>>(
    '/auth/local',
    { ...loginForm },
    {
      headers: {
        'x-device-fingerprint': deviceInfo.deviceFingerprint,
        'x-device-name': deviceInfo.deviceName,
        'x-ip-address': deviceInfo.ipAddress,
        'x-location': deviceInfo.location,
      },
    },
  );

  if (result.data.success) {
    const { accessToken } = result.data.content.tokens;
    localStorage.setItem('accessToken', accessToken); // Use string literal instead of ETokenName
  }
};

const registerInternal = async (registerForm: TRegister): Promise<void> => {
  await unAuthApi.post<IResponseObject<TTokenResponse>>('/registers/customers/account', {
    ...registerForm,
  });
};

const getAccountInfo = async (): Promise<IUserAccount | null> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return null;
    }
    const deviceInfo = await getDeviceInfo(); // Add device info for headers
    const result = await unAuthApi.get<IResponseObject<IUserAccount | null>>('/account/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-device-fingerprint': deviceInfo.deviceFingerprint,
        'x-device-name': deviceInfo.deviceName,
        'x-ip-address': deviceInfo.ipAddress,
        'x-location': deviceInfo.location,
      },
    });

    if (result.data.success && result.data.content) {
      return result.data.content;
    }
    return null;
  } catch {
    return null;
  }
};

export { getAccountInfo, loginInternal, registerInternal, type IUserAccount };
