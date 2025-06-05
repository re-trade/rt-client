import { AxiosInstance } from 'axios';
import { createAuthApi, createUnAuthApi, EApiService } from './axios.config';

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

export { authApi, unAuthApi };
