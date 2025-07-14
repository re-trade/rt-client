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
  phone: string;
  enabled: boolean;
  locked: boolean;
  using2FA: boolean;
  joinInDate: string;
  changedUsername: boolean;
  lastLogin?: string;
  roles: string[];
};

const loginInternal = async (loginForm: TLocalLogin): Promise<void> => {
  const deviceInfo = await getDeviceInfo();
  
  // Sử dụng URL đúng cho API
  const url = 'https://dev.retrades.trade/api/main/v1/auth/local';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-device-fingerprint': encodeURIComponent(deviceInfo.deviceFingerprint),
      'x-device-name': encodeURIComponent(deviceInfo.deviceName),
      'x-ip-address': encodeURIComponent(deviceInfo.ipAddress),
      'x-location': encodeURIComponent(deviceInfo.location),
    },
    body: JSON.stringify(loginForm),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.success && response.status === 200) {
    const { ACCESS_TOKEN, REFRESH_TOKEN } = result.content.tokens;
    
    // Save to localStorage
    localStorage.setItem(ETokenName.ACCESS_TOKEN, ACCESS_TOKEN);
    localStorage.setItem(ETokenName.REFRESH_TOKEN, REFRESH_TOKEN);
    
    // Save to cookies for middleware
    if (typeof document !== 'undefined') {
      document.cookie = `access-token=${ACCESS_TOKEN}; path=/; max-age=3600; SameSite=Strict`;
      document.cookie = `refresh-token=${REFRESH_TOKEN}; path=/; max-age=86400; SameSite=Strict`;
    }
  } else {
    throw new Error(result.message || 'Login failed');
  }
};

const accountMe = async (): Promise<TAccountMeResponse | undefined> => {
  try {
    // Lấy token từ localStorage
    const accessToken = localStorage.getItem(ETokenName.ACCESS_TOKEN);
    if (!accessToken) {
      return undefined;
    }

    const url = 'https://dev.retrades.trade/api/main/v1/accounts/me';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success && response.status === 200) {
      return result.content;
    }
  } catch (error) {
    console.error('Error fetching account info:', error);
    return undefined;
  }
  return undefined;
};

export type { TAccountMeResponse };

export { accountMe, loginInternal };
