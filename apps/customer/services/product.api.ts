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
  avgVote: number;
};

export type TProductRandomResponse = {
  selectedProductId: string;
  randomProductIds: string[];
};

export type TProductHistory = {
  productId: string;
  productName: string;
  productThumbnail: string;
  productDescription: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl: string;
};
export type HomeStats = {
  totalProducts: number;
  totalSoldProducts: number;
  totaOrders: number;
  totalUsers: number;
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

  async getProductSimilar(
    productId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<TProduct[]> {
    const response = await unAuthApi.default.get<IResponseObject<TProduct[]>>('/products/similar', {
      params: {
        page,
        size,
        q: `id=${productId}`,
      },
    });
    return response.data.content;
  },
  async getproductBestSellers(page: number = 0, size: number = 8): Promise<TProduct[]> {
    const response = await unAuthApi.default.get<IResponseObject<TProduct[]>>(
      '/products/best-selling',
      {
        params: {
          page,
          size,
        },
      },
    );
    return response.data.content;
  },
  async getProductHistory(
    productId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<TProductHistory[]> {
    const response = await unAuthApi.default.get<IResponseObject<TProductHistory[]>>(
      `/product-histories/product/${productId}`,
      {
        params: {
          page,
          size,
        },
      },
    );
    return response.data.content;
  },
  async getHomeStats(): Promise<HomeStats> {
    const response =
      await unAuthApi.default.get<IResponseObject<HomeStats>>('/products/home-stats');
    if (!response.data.success) {
      throw new Error('Failed to fetch home stats');
    }
    return response.data.content;
  },
  async getProductsBySeller(
    sellerId: string,
    page: number = 0,
    size: number = 12,
    searchQuery?: string,
  ): Promise<IResponseObject<TProduct[]>> {
    const queryParts = [`seller=${sellerId}`];
    if (searchQuery && searchQuery.trim()) {
      queryParts.push(`keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
    queryParts.push('verified=true');

    const response = await unAuthApi.default.get<IResponseObject<TProduct[]>>('/products/search', {
      params: {
        page,
        size,
        q: queryParts.join('&'),
      },
    });
    return response.data;
  },
  async getProductIdRandom(): Promise<TProductRandomResponse> {
    const response =
      await unAuthApi.default.get<IResponseObject<TProductRandomResponse>>('/products/id/random');
    return response.data.content;
  },
};
