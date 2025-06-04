import { getDeviceInfo } from '@/lib/device-fingerprint';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const BASE_API_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
const NODE_ENV: string = process.env.NODE_ENV ?? 'development';

enum ETokenName {
  ACCESS_TOKEN = 'access-token',
  REFRESH_TOKEN = 'refresh-token',
}

enum EApiService {
  MAIN = 'main',
  VOUCHER = 'user',
  CATALOG = 'catalog',
  STORAGE = 'storage',
}

type CustomAxiosRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

const createBaseURL = (service: EApiService = EApiService.MAIN) => {
  const path = NODE_ENV === 'development' ? '/api/v1' : `/api/${service}/v1`;
  return new URL(path, BASE_API_URL).toString();
};

const createUnAuthApi = (service: EApiService = EApiService.MAIN): AxiosInstance =>
  axios.create({
    baseURL: createBaseURL(service),
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 1000,
    maxRedirects: 5,
  });

const createAuthApi = (service: EApiService = EApiService.MAIN): AxiosInstance => {
  const instance = axios.create({
    baseURL: createBaseURL(service),
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 1000,
    maxRedirects: 5,
  });

  instance.interceptors.request.use(
    async (config) => {
      const accessToken = localStorage.getItem(ETokenName.ACCESS_TOKEN);
      if (accessToken && config.headers) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        const deviceInfo = await getDeviceInfo();
        config.headers['x-device-fingerprint'] = deviceInfo.deviceFingerprint;
        config.headers['x-device-name'] = deviceInfo.deviceName;
        config.headers['x-ip-address'] = deviceInfo.ipAddress;
        config.headers['x-location'] = deviceInfo.location;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem(ETokenName.REFRESH_TOKEN);
          const response = await unAuthApi.default.post('/auth/refresh-token', {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem(ETokenName.ACCESS_TOKEN, accessToken);
          localStorage.setItem(ETokenName.REFRESH_TOKEN, newRefreshToken);

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`,
          };

          return instance(originalRequest);
        } catch (err) {
          localStorage.removeItem(ETokenName.ACCESS_TOKEN);
          localStorage.removeItem(ETokenName.REFRESH_TOKEN);
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

const authApi: Record<string, AxiosInstance> & {
  default: AxiosInstance;
  voucher: AxiosInstance;
  catalog: AxiosInstance;
  storage: AxiosInstance;
} = {
  get default() {
    return createAuthApi();
  },
  get voucher() {
    return createAuthApi(EApiService.VOUCHER);
  },
  get catalog() {
    return createAuthApi(EApiService.CATALOG);
  },
  get storage() {
    return createAuthApi(EApiService.STORAGE);
  },
};

const unAuthApi: Record<string, AxiosInstance> & {
  default: AxiosInstance;
  voucher: AxiosInstance;
  catalog: AxiosInstance;
  storage: AxiosInstance;
} = {
  get default() {
    return createUnAuthApi();
  },
  get voucher() {
    return createUnAuthApi(EApiService.VOUCHER);
  },
  get catalog() {
    return createUnAuthApi(EApiService.CATALOG);
  },
  get storage() {
    return createUnAuthApi(EApiService.STORAGE);
  },
};

export { authApi, createAuthApi, createUnAuthApi, EApiService, ETokenName, unAuthApi };
export type { CustomAxiosRequestConfig };
