"use client"
import axios from "axios"
const baseAPIUrl = process.env.NEXT_PUBLIC_API_URL;
const unAuthenticationAxios = axios.create({baseURL: baseAPIUrl, headers: {'Content-Type': 'application/json'}});

const authenticateAxios = axios.create({
    baseURL: baseAPIUrl,
    headers: {
      'Content-Type': 'application/json',
    },
});

authenticateAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

authenticateAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry){
        
      }
      return Promise.reject(error);
    }
);
  