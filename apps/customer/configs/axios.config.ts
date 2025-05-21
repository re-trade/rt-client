import type { AxiosRequestConfig } from 'axios';
import axios, { AxiosError } from "axios";
const BASE_API_URL: string = process.env.NEXT_API_BASE_URL ?? "http://localhost:8080/api/v1";

enum ETokenName {
    ACCESS_TOKEN = "access-token",
    REFRESH_TOKEN = "refresh-token"
}

const unAuthApi = axios.create({
    baseURL: BASE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 1000,
    maxRedirects: 5
});

const authApi = axios.create({
    baseURL: BASE_API_URL,
    withCredentials: true,
    timeout: 1000,
    maxRedirects: 5
});

authApi.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem(ETokenName.ACCESS_TOKEN);
    if (accessToken && config.headers) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
}, (error) =>  {
    Promise.reject(error);
});



type CustomAxiosRequestConfig = Omit<AxiosRequestConfig, '_retry'> & {
  _retry?: boolean;
};

authApi.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        if (error.response?.status == 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try{
                const refreshToken = localStorage.getItem('refresh-token');
                const response = await unAuthApi.post('/auth/refresh-token', {
                    refreshToken
                });
                const {accessToken, refreshToken: newRefreshToken} = response.data;
                localStorage.setItem('access-token', accessToken);
                localStorage.setItem('refresh-token', newRefreshToken);
                authApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                return authApi(originalRequest);
            } catch(error){
                localStorage.removeItem('access-token');
                localStorage.removeItem('refresh-token');
                return Promise.reject(error);
            }
        }
    }
)


export { authApi, ETokenName, unAuthApi };
export type { CustomAxiosRequestConfig };

