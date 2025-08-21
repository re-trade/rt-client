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
}

const getCategoriesInternal = async (params?: GetCategoriesParams): Promise<CategoriesResponse> => {
  try {
    const qQuery = new URLSearchParams({
      enabled: 'true',
      visible: 'true',
    });
    const rootQuery = new URLSearchParams();
    if (params?.page) rootQuery.set('page', params.page.toString());
    if (params?.size) rootQuery.set('size', params.size.toString());
    const queryString = `q=${qQuery.toString()}${rootQuery.toString() ? `&${rootQuery}` : ''}`;
    const response = await unAuthApi.default.get(`/categories?${queryString}`, {
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
