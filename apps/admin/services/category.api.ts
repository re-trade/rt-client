import { authApi } from '@retrade/util';

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
  const response = await authApi.default.get('/categories/all');
  return response.data.content;
};

const getCategoriesInternal = async (params?: GetCategoriesParams): Promise<CategoriesResponse> => {
  try {
    const response = await authApi.default.get('/categories/search', {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCategoryByIdInternal = async (id: string): Promise<Category> => {
  try {
    const response = await authApi.default.get(`/categories/${id}`);
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
    const response = await authApi.default.post('/categories', data);
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
    const response = await authApi.default.put(`/categories/${id}`, data);
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
