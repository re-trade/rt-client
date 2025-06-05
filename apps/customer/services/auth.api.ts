import { getDeviceInfo } from '@/lib/device-fingerprint';
import { ETokenName, IResponseObject, unAuthApi } from '@retrade/util';

type TLocalLogin = {
  username: string;
  password: string;
};

type TTokenResponse = {
  tokens: { ACCESS_TOKEN: string; REFRESH_TOKEN: string };
  roles: string[];
  twoFA: boolean;
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

export { loginInternal };
