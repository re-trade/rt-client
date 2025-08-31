import { authApi, IResponseObject } from '@retrade/util';

export type TProductHistory = {
  productId: string;
  productName: string;
  productThumbnail: string;
  productDescription: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl: string;
};

export const productHistoryApi = {
  async getProductHistory(
    productId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<TProductHistory[]> {
    try {
      const response = await authApi.default.get<IResponseObject<TProductHistory[]>>(
        `/product-histories/product/${productId}`,
        {
          params: {
            page,
            size,
          },
        },
      );

      if (response.data.success) {
        return response.data.content;
      }

      return [];
    } catch (error) {
      console.error('Error fetching product history:', error);
      return [];
    }
  },

  async getProductHistoryPaginated(
    productId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<{
    histories: TProductHistory[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
  }> {
    try {
      const response = await authApi.default.get<IResponseObject<TProductHistory[]>>(
        `/product-histories/product/${productId}`,
        {
          params: {
            page,
            size,
          },
        },
      );

      const histories = response.data.success ? response.data.content : [];
      const pagination = response.data.pagination;

      return {
        histories,
        totalPages: pagination?.totalPages || 1,
        totalElements: pagination?.totalElements || histories.length,
        currentPage: (pagination?.page || 0) + 1,
        pageSize: pagination?.size || size,
      };
    } catch (error) {
      console.error('Error fetching product history with pagination:', error);
      return {
        histories: [],
        totalPages: 1,
        totalElements: 0,
        currentPage: 1,
        pageSize: size,
      };
    }
  },
};
