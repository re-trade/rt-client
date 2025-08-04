import { IResponseObject } from '@/api/base.api';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const BASE_API_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
const NODE_ENV: string = process.env.NEXT_PUBLIC_NODE_ENV ?? 'development';
export enum ETokenName {
  ACCESS_TOKEN = 'access-token',
  REFRESH_TOKEN = 'refresh-token',
}

export enum EApiService {
  MAIN = 'main',
  VOUCHER = 'user',
  IMAGE_SEARCH = 'image-search',
  STORAGE = 'storage',
}

export type CustomAxiosRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

export interface DeviceInfo {
  deviceFingerprint: string;
  deviceName: string;
  ipAddress: string;
  location: string;
}

const createBaseURL = (service: EApiService = EApiService.MAIN) => {
  const path = NODE_ENV === 'development' ? '/api/v1' : `/api/${service}/v1`;
  return new URL(path, BASE_API_URL).toString();
};

export const createUnAuthApi = (service: EApiService = EApiService.MAIN): AxiosInstance =>
  axios.create({
    baseURL: createBaseURL(service),
    headers: {
      'Content-Type': 'application/json',
    },
    maxRedirects: 5,
  });

export const createAuthApi = (
  service: EApiService = EApiService.MAIN,
  getDeviceInfo?: () => Promise<DeviceInfo>,
): AxiosInstance => {
  const instance = axios.create({
    baseURL: createBaseURL(service),
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    maxRedirects: 5,
  });

  if (typeof window !== 'undefined') {
    instance.interceptors.request.use(
      async (config) => {
        const accessToken = localStorage.getItem(ETokenName.ACCESS_TOKEN);
        if (accessToken && config.headers) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
          if (getDeviceInfo) {
            const deviceInfo = await getDeviceInfo();
            config.headers['x-device-fingerprint'] = deviceInfo.deviceFingerprint;
            config.headers['x-device-name'] = deviceInfo.deviceName;
            config.headers['x-ip-address'] = deviceInfo.ipAddress;
            config.headers['x-location'] = deviceInfo.location;
          }
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
            const response = await createAuthApi().post<
              IResponseObject<{
                tokens: {
                  ACCESS_TOKEN: string;
                  REFRESH_TOKEN: string;
                };
                roles: string[];
                twoFA: boolean;
              }>
            >('/auth/refresh-token');

            const { tokens } = response.data.content;
            localStorage.setItem(ETokenName.ACCESS_TOKEN, tokens.ACCESS_TOKEN);

            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${tokens.ACCESS_TOKEN}`,
            };

            return instance(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  return instance;
};

export const createApiInstances = (getDeviceInfo?: () => Promise<DeviceInfo>) => {
  const authApi: Record<string, AxiosInstance> & {
    default: AxiosInstance;
    voucher: AxiosInstance;
    imageSearch: AxiosInstance;
    storage: AxiosInstance;
  } = {
    get default() {
      return createAuthApi(EApiService.MAIN, getDeviceInfo);
    },
    get voucher() {
      return createAuthApi(EApiService.VOUCHER, getDeviceInfo);
    },
    get imageSearch() {
      return createAuthApi(EApiService.IMAGE_SEARCH, getDeviceInfo);
    },
    get storage() {
      return createAuthApi(EApiService.STORAGE, getDeviceInfo);
    },
  };

  const unAuthApi: Record<string, AxiosInstance> & {
    default: AxiosInstance;
    voucher: AxiosInstance;
    imageSearch: AxiosInstance;
    storage: AxiosInstance;
  } = {
    get default() {
      return createUnAuthApi();
    },
    get voucher() {
      return createUnAuthApi(EApiService.VOUCHER);
    },
    get imageSearch() {
      return createUnAuthApi(EApiService.IMAGE_SEARCH);
    },
    get storage() {
      return createUnAuthApi(EApiService.STORAGE);
    },
  };

  return { authApi, unAuthApi };
};
