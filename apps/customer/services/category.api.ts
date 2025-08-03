import { IResponseObject, unAuthApi } from '@retrade/util';

interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  parentName: string | null;
  sellerId: string | null;
  sellerShopName: string | null;
  visible: boolean;
  type: string;
  children: Category[] | null;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesResponse {
  content: Category[];
  messages: string[];
  code: string;
  success: boolean;
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
}

interface GetCategoriesParams {
  page?: number;
  size?: number;
  parentId?: string;
  sellerId?: string;
  visible?: boolean;
  type?: string;
}

const getCategoriesInternal = async (params?: GetCategoriesParams): Promise<CategoriesResponse> => {
  try {
    const response = await unAuthApi.default.get('/categories', {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCategoryByIdInternal = async (id: string): Promise<Category> => {
  try {
    const response = await unAuthApi.default.get<IResponseObject<Category>>(`/categories/${id}`, {
      withCredentials: true,
    });
    return response.data.content;
  } catch (error) {
    throw error;
  }
};

const getCategoryChildrenInternal = async (
  parentId: string,
  params?: GetCategoriesParams,
): Promise<CategoriesResponse> => {
  try {
    const response = await unAuthApi.default.get(`/categories/${parentId}/children`, {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  getCategoriesInternal,
  getCategoryByIdInternal,
  getCategoryChildrenInternal,
  type CategoriesResponse,
  type Category,
  type GetCategoriesParams,
};
