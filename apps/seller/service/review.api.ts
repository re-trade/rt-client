import { authApi, IResponseObject, createResponseObject } from '@retrade/util';

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

  getReview: async (reviewId: string): Promise<IResponseObject<ReviewResponse>> => {
    const response = await authApi.default.get<IResponseObject<ReviewResponse>>(
      `/reviews/${reviewId}`,
    );
    return response.data;
  },

  getAllReviewsBySeller: async (
    page: number = 0,
    size: number = 10,
    vote?: number,
    keyword?: string,
    isReply?: 'REPLY' | 'NO_REPLY' | null,
  ): Promise<{
    reviews: ReviewResponse[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
  }> => {
    const query = new URLSearchParams();
    query.set('page', page.toString());
    query.set('size', size.toString());
    if (vote) {
      query.set('vote', vote.toString());
    }
    if (isReply) {
      query.set('isReply', isReply);
    }
    if (keyword) {
      query.set('q', `keyword=${encodeURIComponent(keyword)}`);
    }
    const url = `/product-review/search?${query.toString()}`;
    const response = await authApi.default.get<IResponseObject<ReviewResponse[]>>(url);
    return {
      reviews: response.data.content,
      totalPages: response.data.pagination?.totalPages || 1,
      totalElements: response.data.pagination?.totalElements || response.data.content.length,
      currentPage: (response.data.pagination?.page || 0) + 1,
      pageSize: response.data.pagination?.size || size,
    };
  },

  getStatsReviewsSeller: async (): Promise<IResponseObject<StatsReViewResponse>> => {
    const response =
      await authApi.default.get<IResponseObject<StatsReViewResponse>>(`/product-review/stats`);
    return response.data;
  },
  replyReview: async (reviewId: string, content: string): Promise<IResponseObject<ReviewResponse>> => {
    const response = await authApi.default.patch<IResponseObject<ReviewResponse>>(
      `/product-review/${reviewId}/create-reply`,
      {
        content,
      },
    );
    return response.data;
  },
};

export type { ReviewResponse, StatsReViewResponse };
