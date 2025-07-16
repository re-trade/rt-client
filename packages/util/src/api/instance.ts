import { AxiosInstance } from 'axios';
import { createAuthApi, createUnAuthApi, EApiService } from './axios.config';

const authApi: Record<string, AxiosInstance> & {
  default: AxiosInstance;
  voucher: AxiosInstance;
  imageSearch: AxiosInstance;
  storage: AxiosInstance;
} = {
  get default() {
    return createAuthApi();
  },
  get voucher() {
    return createAuthApi(EApiService.VOUCHER);
  },
  get imageSearch() {
    return createAuthApi(EApiService.IMAGE_SEARCH);
  },
  get storage() {
    return createAuthApi(EApiService.STORAGE);
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

export { authApi, unAuthApi };
