import { IResponseObject, unAuthApi } from '@retrade/util';
import axios from 'axios';

// Helper function to get access token
const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access-token');
};

// Helper function to check if user is authenticated
const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token;
};

// Helper function to validate authentication before making authenticated requests
const validateAuthentication = (): void => {
  if (!isAuthenticated()) {
    throw new Error('No access token found. Please login first.');
  }
};

// Helper function to refresh token (not available in this API)
const refreshToken = async (): Promise<boolean> => {
  // Since refresh token API is not available, always return false
  console.log('Refresh token API not available, need to login again');
  return false;
};

// Helper function to test token validity
const testTokenValidity = async (token: string): Promise<boolean> => {
  try {
    const url = 'https://dev.retrades.trade/api/main/v1/accounts/me';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error testing token validity:', error);
    return false;
  }
};

// Tạo instance axios riêng cho API của bạn
const retradeApi = axios.create({
  baseURL: 'https://dev.retrades.trade/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  timeout: 10000, // 10 seconds timeout
});

export type TProduct = {
  id: string;
  name: string;
  sellerId: string;
  sellerShopName: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  productImages: string[];
  brandId: string;
  condition: string;
  brand: string;
  quantity: number;
  warrantyExpiryDate: string;
  model: string;
  currentPrice: number;
  categories: { id: string; name: string }[];
  tags: string[];
  keywords?: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
};

export const productApi = {
  // API mới sử dụng endpoint getAllProducts
  async getAllProducts(
    page: number = 0,
    size: number = 10,
    query?: string,
  ): Promise<IResponseObject<TProduct[]>> {
    try {
      // Sử dụng fetch API để tránh CORS issues
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(query ? { query } : {}),
      });

      const url = `https://dev.retrades.trade/api/main/v1/products?${params}`;
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        success: false,
        content: [],
        pagination: {
          page: 0,
          size: 10,
          totalElements: 0,
          totalPages: 0,
        },
        message: 'Failed to fetch products',
        messages: ['Failed to fetch products'],
        code: 'ERROR',
      };
    }
  },

  async getProducts(page: number = 0, size: number = 10, query?: string): Promise<TProduct[]> {
    const response = await unAuthApi.default.get<IResponseObject<TProduct[]>>('/products', {
      params: {
        page,
        size,
        ...(query ? { query } : {}),
      },
    });
    return response.data.success ? response.data.content : [];
  },

  async searchProducts(
    page: number = 0,
    size: number = 10,
    query?: string,
  ): Promise<IResponseObject<TProduct[]>> {
    const response = await unAuthApi.default.get<IResponseObject<TProduct[]>>('/products/search', {
      params: {
        page,
        size,
        ...(query ? { q: query } : {}),
      },
    });
    return response.data;
  },

  async getProduct(id: string): Promise<TProduct> {
    try {
      const response = await unAuthApi.default.get<IResponseObject<TProduct>>(`/products/${id}`);
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Product not found');
    } catch (error) {
      throw error;
    }
  },

  // API delete sản phẩm
  async deleteProduct(id: string): Promise<IResponseObject<boolean>> {
    try {
      const url = `https://dev.retrades.trade/api/main/v1/products/${id}`;
      console.log('Deleting product from URL:', url);

      // Validate authentication
      validateAuthentication();

      // Lấy token từ localStorage
      let accessToken = getAccessToken();
      console.log('Access token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'null');
      console.log('Full token length:', accessToken?.length || 0);

      // Test token validity first
      if (accessToken) {
        const isTokenValid = await testTokenValidity(accessToken);
        console.log('Token validity test result:', isTokenValid);
        if (!isTokenValid) {
          console.log('Token is invalid, attempting to refresh...');
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            accessToken = getAccessToken();
            console.log(
              'Token refreshed, new token:',
              accessToken ? `${accessToken.substring(0, 20)}...` : 'null',
            );
          } else {
            // Clear invalid tokens
            localStorage.removeItem('access-token');
            localStorage.removeItem('refresh-token');
            if (typeof document !== 'undefined') {
              document.cookie = 'access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              document.cookie = 'refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            }
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.');
          }
        }
      }

      const makeDeleteRequest = async (token: string) => {
        const requestHeaders = {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        console.log('Delete request headers:', requestHeaders);
        console.log('Delete request URL:', url);

        const response = await fetch(url, {
          method: 'DELETE',
          headers: requestHeaders,
        });

        console.log('Delete response status:', response.status);
        console.log('Delete response headers:', response.headers);

        return response;
      };

      // First attempt with current token
      let response = await makeDeleteRequest(accessToken!);

      // If 401 or 403, token is expired and we can't refresh it
      if (response.status === 401 || response.status === 403) {
        console.log('Token is expired (401/403), need to login again');
        // Clear invalid tokens
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
        if (typeof document !== 'undefined') {
          document.cookie = 'access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.');
      }

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.log('Error response data:', errorData);
          errorMessage = errorData.message || errorData.error || errorData.details || errorMessage;
        } catch (e) {
          // If we can't parse error response, use status text
          console.log('Could not parse error response:', e);
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Delete response data:', data);
      return data;
    } catch (error) {
      console.error('Error deleting product:', error);

      // If token is expired, clear tokens and redirect
      if (error instanceof Error && error.message.includes('Token expired')) {
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
        if (typeof document !== 'undefined') {
          document.cookie = 'access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      }

      return {
        success: false,
        content: false,
        message: error instanceof Error ? error.message : 'Failed to delete product',
        messages: [error instanceof Error ? error.message : 'Failed to delete product'],
        code: 'ERROR',
      };
    }
  },

  async verifyProduct(id: string): Promise<IResponseObject<boolean>> {
    const url = `https://dev.retrades.trade/api/main/v1/products/${id}/verify`;
    const accessToken = localStorage.getItem('access-token');
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const status = response.status;
      const contentType = response.headers.get('content-type');
      let errorData: any = {};
      let errorText = '';

      try {
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorText = await response.text();
          errorData = { message: errorText };
        }
      } catch (e) {
        errorText = await response.text();
        errorData = { message: errorText };
      }

      console.error('Verify product error:', {
        status,
        errorData,
        errorText,
        url: response.url,
        method: 'PUT',
      });

      throw new Error(
        errorData.message ||
          `Duyệt sản phẩm thất bại (status: ${status})${errorText ? `: ${errorText}` : ''}`,
      );
    }
    return await response.json();
  },

  async unverifyProduct(id: string): Promise<IResponseObject<boolean>> {
    const url = `https://dev.retrades.trade/api/main/v1/products/${id}/unverify`;
    const accessToken = localStorage.getItem('access-token');
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Không duyệt sản phẩm thất bại');
    return await response.json();
  },
};
