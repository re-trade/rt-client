import { IResponseObject, unAuthApi } from '@retrade/util';
import axios from 'axios';

// Tạo instance axios riêng cho API của bạn
const retradeApi = axios.create({
  baseURL: 'https://dev.retrades.trade/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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
  async getAllProducts(page: number = 0, size: number = 10, query?: string): Promise<IResponseObject<TProduct[]>> {
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
          'Accept': 'application/json',
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
};
