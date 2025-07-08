import { authApi, IResponseObject } from '@retrade/util';

type ReviewResponse = {
  id: string;
  product: {
    productId: string;
    productName: string;
    thumbnailUrl?: string;
  };
  isVerifiedPurchase: boolean;
  content: string;
  author: {
    authId: string;
    name: string;
    avatarUrl?: string;
  };
  vote: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  orderId: string;
  helpful: number;
  imageUrls: string[];
  reply?: {
    content: string;
    createdAt: string;
    updatedAt?: string;
  };
};

type StatsReViewResponse = {
  totalReviews: number;
  averageRating: number;
  repliedReviews: number;
  replyRate: number;
  totalPositiveReviews: number;
  averagePositiveReviews: number;
  ratingDistribution: {
    vote: number;
    count: number;
    percentage: number;
  }[];
};

export const reviewApi = {
  getReviews: async (
    productId: string,
    page: number = 1,
    size: number = 10,
  ): Promise<ReviewResponse[]> => {
    const response = await authApi.default.get<IResponseObject<ReviewResponse[]>>(
      `/products/${productId}/reviews`,
      {
        params: {
          page,
          size,
        },
      },
    );
    return response.data.content;
  },

  getReview: async (reviewId: string): Promise<ReviewResponse> => {
    const response = await authApi.default.get<IResponseObject<ReviewResponse>>(
      `/reviews/${reviewId}`,
    );
    return response.data.content;
  },

  getAllreviewsBySeller: async (
    page: number = 0,
    size: number = 10,
    vote?: number,
    q?: string,
  ): Promise<ReviewResponse[]> => {
    const response = await authApi.default.get<IResponseObject<ReviewResponse[]>>(
      `/product-review/search`,
      {
        params: {
          page,
          size,
          vote,
          q,
        },
      },
    );
    return response.data.content;
  },

  getStatsReviewsSeller: async (): Promise<StatsReViewResponse> => {
    const response =
      await authApi.default.get<IResponseObject<StatsReViewResponse>>(`/product-review/stats`);
    return response.data.content;
  },
  replyReview: async (reviewId: string, content: string): Promise<ReviewResponse> => {
    const response = await authApi.default.patch<IResponseObject<ReviewResponse>>(
      `/product-review/${reviewId}/create-reply`,
      { content: content },
    );
    return response.data.content;
  },
};

export type { ReviewResponse, StatsReViewResponse };
