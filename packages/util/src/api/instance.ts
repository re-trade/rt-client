import { AxiosInstance } from 'axios';
import { createAuthApi, createUnAuthApi, EApiService } from './axios.config';

const authApi: Record<string, AxiosInstance> & {
  default: AxiosInstance;
  achievement: AxiosInstance;
  imageSearch: AxiosInstance;
  storage: AxiosInstance;
  notification: AxiosInstance;
  province: AxiosInstance;
  textModeration: AxiosInstance;
} = {
  get default() {
    return createAuthApi();
  },
  get achievement() {
    return createAuthApi(EApiService.ACHIEVEMENT);
  },
  get imageSearch() {
    return createAuthApi(EApiService.IMAGE_SEARCH);
  },
  get storage() {
    return createAuthApi(EApiService.STORAGE);
  },
  get notification() {
    return createUnAuthApi(EApiService.NOTIFICATION);
  },
  get province() {
    return createUnAuthApi(EApiService.PROVINCE);
  },
  get textModeration() {
    return createUnAuthApi(EApiService.TEXT_MODERATION);
  },
};

const unAuthApi: Record<string, AxiosInstance> & {
  default: AxiosInstance;
  achievement: AxiosInstance;
  imageSearch: AxiosInstance;
  storage: AxiosInstance;
  notification: AxiosInstance;
  province: AxiosInstance;
  textModeration: AxiosInstance;
} = {
  get default() {
    return createUnAuthApi();
  },
  get achievement() {
    return createUnAuthApi(EApiService.ACHIEVEMENT);
  },
  get imageSearch() {
    return createUnAuthApi(EApiService.IMAGE_SEARCH);
  },
  get storage() {
    return createUnAuthApi(EApiService.STORAGE);
  },
  get notification() {
    return createUnAuthApi(EApiService.NOTIFICATION);
  },
  get province() {
    return createUnAuthApi(EApiService.PROVINCE);
  },
  get textModeration() {
    return createUnAuthApi(EApiService.TEXT_MODERATION);
  },
};

export { authApi, unAuthApi };
