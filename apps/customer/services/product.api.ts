import { IResponseObject, unAuthApi } from '@retrade/util';

export type TProduct = {
  id: string;
  name: string;
  sellerId: string;
  sellerShopName: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  productImages: string[];
  brand: string;
  discount: string;
  model: string;
  currentPrice: number;
  categories: string[];
  keywords: string[];
  tags: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
};

export const productApi = {
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
  async searchProducts(page: number = 0, size: number = 10, query?: string): Promise<TProduct[]> {
    const response = await unAuthApi.default.get<IResponseObject<TProduct[]>>('/products/search', {
      params: {
        page,
        size,
        ...(query ? { q: query } : {}),
      },
    });
    return response.data.success ? response.data.content : [];
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
