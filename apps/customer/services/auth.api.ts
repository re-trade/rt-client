import { ETokenName, unAuthApi } from '@/configs/axios.config';
import { IResponseObject } from '@/services/base.api';
import { getDeviceInfo, type IDeviceInfo } from '@/lib/device-fingerprint';

type TLocalLogin = {
  username: string;
  password: string;
};

type TTokenResponse = {
  tokens: { accessToken: string; refreshToken: string };
  roles: string[];
  twoFA: boolean;
};

const loginInternal = async (loginForm: TLocalLogin): Promise<void> => {
  const deviceInfo = await getDeviceInfo();
  
  const result = await unAuthApi.post<IResponseObject<TTokenResponse>>('/auth/local', 
    { ...loginForm },
    {
      headers: {
        'x-device-fingerprint': deviceInfo.deviceFingerprint,
        'x-device-name': deviceInfo.deviceName,
        'x-ip-address': deviceInfo.ipAddress,
        'x-location': deviceInfo.location,
      }
    }
  );

  if (result.data.success) {
    const { accessToken } = result.data.content.tokens;
    localStorage.setItem(ETokenName.ACCESS_TOKEN, accessToken);
  }
};

export { loginInternal };
