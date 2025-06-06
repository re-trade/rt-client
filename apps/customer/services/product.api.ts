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
  async getProducts(): Promise<TProduct[]> {
    const response = await unAuthApi.default.get<IResponseObject<TProduct[]>>(`/products`);
    if (response.data.success) {
      return response.data.content;
    }
    return [];
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
