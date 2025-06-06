import { getDeviceInfo } from '@/lib/device-fingerprint';
import { authApi, ETokenName, IResponseObject, unAuthApi } from '@retrade/util';

type TLocalLogin = {
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
  enabled: boolean;
  locked: boolean;
  using2FA: boolean;
  joinInDate: string;
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
  avatarUrl: string;
};
const loginInternal = async (loginForm: TLocalLogin): Promise<void> => {
  const deviceInfo = await getDeviceInfo();
  const result = await unAuthApi.default.post<IResponseObject<TTokenResponse>>(
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

  if (result.data.success && result.status === 200) {
    const { ACCESS_TOKEN } = result.data.content.tokens;
    localStorage.setItem(ETokenName.ACCESS_TOKEN, ACCESS_TOKEN);
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

export { accountMe, loginInternal, registerInternal };
