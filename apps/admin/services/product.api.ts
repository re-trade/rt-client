import { IPaginationResponse, IResponseObject } from '@retrade/util';
import { unAuthApi, authApi } from '@retrade/util/src/api/instance';

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
  async getAllProducts(
    page: number = 0,
    size: number = 10,
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

  async verifyProduct(id: string): Promise<IResponseObject<null>> {
    const response = await authApi.default.put<IResponseObject<null>>(`/products/${id}/verify`);
    return response.data;
  },

  async unverifyProduct(id: string): Promise<IResponseObject<null>> {
    const response = await authApi.default.put<IResponseObject<null>>(`/products/${id}/unverify`);
    return response.data;
  },
};
