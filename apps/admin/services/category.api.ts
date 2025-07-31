import { unAuthApi } from '@retrade/util';

interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  parentName: string | null;
  visible: boolean;
  children: Category[] | null;
}

interface CategoriesResponse {
  content: Category[];
  messages: string[];
  code: string;
  success: boolean;
  pagination?: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
}

interface GetCategoriesParams {
  page?: number;
  size?: number;
  name?: string;
  visible?: boolean;
}

const getAllCategories = async (): Promise<Category[]> => {
  const response = await unAuthApi.default.get('/categories/all', { withCredentials: true });
  return response.data.content;
};

const getCategoriesInternal = async (params?: GetCategoriesParams): Promise<CategoriesResponse> => {
  try {
    const response = await unAuthApi.default.get('/categories/search', {
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
    const response = await unAuthApi.default.get(`/categories/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createCategory = async (data: {
  name: string;
  description?: string;
  categoryParentId?: string | null;
  visible: boolean;
}): Promise<Category> => {
  try {
    const response = await unAuthApi.default.post('/categories', data, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (
  id: string,
  data: { name: string; description?: string; categoryParentId?: string | null; visible: boolean },
): Promise<Category> => {
  try {
    console.log('Updating category with data:', { id, data });
    const response = await unAuthApi.default.put(`/categories/${id}`, data, {
      withCredentials: true,
    });
    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update category error:', error);
    throw error;
  }
};

export {
  createCategory,
  getAllCategories,
  getCategoriesInternal,
  getCategoryByIdInternal,
  updateCategory,
  type CategoriesResponse,
  type Category,
  type GetCategoriesParams,
};
