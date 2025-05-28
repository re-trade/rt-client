import { ETokenName, unAuthApi } from '@/configs/axios.config';
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

const loginInternal = async (loginForm: TLocalLogin): Promise<void> => {
  const result = await unAuthApi.post<IResponseObject<TTokenResponse>>('/auth/local', loginForm);
  if (result.data.success) {
    const { accessToken } = result.data.content.tokens;
    localStorage.setItem(ETokenName.ACCESS_TOKEN, accessToken);
  }
};

export { loginInternal };
