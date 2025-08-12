import type { IPaginationResponse, IResponseObject } from '@retrade/util';
import { authApi, unAuthApi } from '@retrade/util/src/api/instance';

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
  retraded: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TProductFilter = {
  categoriesAdvanceSearch: {
    id: string;
    name: string;
  }[];
  brands: {
    id: string;
    name: string;
    imgUrl: string;
  }[];
  states: string[];
  sellers: {
    sellerId: string;
    sellerName: string;
    sellerAvatarUrl: string;
  }[];
  minPrice: number;
  maxPrice: number;
};

export const productApi = {
  async getAllProducts(
    page = 0,
    size = 10,
    query?: string,
  ): Promise<IResponseObject<IPaginationResponse<TProduct>>> {
    try {
      const response = await unAuthApi.default.get<IResponseObject<IPaginationResponse<TProduct>>>(
        '/products',
        {
          params: {
            page,
            size,
            ...(query ? { query } : {}),
          },
        },
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        content: {
          content: [],
          page: 0,
          size: size,
          totalElements: 0,
          totalPages: 0,
        },
        message: 'Failed to fetch products',
        messages: ['Failed to fetch products'],
        code: 'ERROR',
      };
    }
  },

  async getProduct(id: string): Promise<TProduct> {
    const response = await unAuthApi.default.get<IResponseObject<TProduct>>(`/products/${id}`);
    if (response.data.success) {
      return response.data.content;
    }
    throw new Error('Product not found');
  },

  async searchProducts(
    page = 0,
    size = 10,
    query?: string,
    sort: string[] = ['id,asc'],
  ): Promise<IResponseObject<TProduct[]>> {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('size', size.toString());
    for (const s of sort) {
      params.append('sort', s);
    }
    if (query) {
      params.set('q', query);
    }

    const response = await unAuthApi.default.get<IResponseObject<TProduct[]>>(
      `/products/search?${params.toString()}`,
    );
    return response.data;
  },

  async getProductFilter(keyword: string): Promise<TProductFilter> {
    const response = await unAuthApi.default.get<IResponseObject<TProductFilter>>(
      '/products/filter',
      {
        params: {
          q: `keyword=${keyword}`,
        },
      },
    );
    if (!response.data.success) {
      throw new Error('Failed to fetch filter');
    }
    return response.data.content;
  },

  async verifyProduct(id: string): Promise<IResponseObject<null>> {
    const response = await authApi.default.put<IResponseObject<null>>(`/products/${id}/verify`);
    return response.data;
  },

  async unverifyProduct(id: string): Promise<IResponseObject<null>> {
    const response = await authApi.default.put<IResponseObject<null>>(`/products/${id}/unverify`);
    return response.data;
  },
};
