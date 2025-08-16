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
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'INIT' | 'PENDING' | 'DRAFT';
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

  async getAllProductsForExport(): Promise<TProduct[]> {
    try {
      const allProducts: TProduct[] = [];
      let page = 0;
      const size = 50;
      let hasMore = true;

      console.log('Starting to fetch all products for export...');

      while (hasMore) {
        console.log(`Fetching page ${page} with size ${size}...`);
        
        const response = await unAuthApi.default.get<IResponseObject<IPaginationResponse<TProduct>>>(
          '/products',
          {
            params: {
              page,
              size,
            },
          },
        );

        console.log(`Page ${page} response:`, response.data);

        if (response.data.success && response.data.content?.content) {
          const products = response.data.content.content;
          console.log(`Page ${page} has ${products.length} products`);
          allProducts.push(...products);
          
          // Kiểm tra xem còn trang nào không
          if (response.data.content.totalPages <= page + 1 || products.length < size) {
            console.log(`No more pages. Total pages: ${response.data.content.totalPages}, current page: ${page}`);
            hasMore = false;
          } else {
            page++;
          }
        } else {
          console.log(`Page ${page} failed or no content:`, response.data);
          hasMore = false;
        }
      }

      console.log(`Total products fetched: ${allProducts.length}`);
      return allProducts;
    } catch (error) {
      console.error('Error fetching all products for export:', error);
      throw new Error('Failed to fetch all products for export');
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
