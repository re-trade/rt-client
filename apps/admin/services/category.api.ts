import { unAuthApi } from '@retrade/util';

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
    const response = await unAuthApi.default.get(`/categories/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createCategory = async (data: Partial<Category>): Promise<Category> => {
  try {
    const response = await unAuthApi.default.post('/categories', data, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
  try {
    const response = await unAuthApi.default.put(`/categories/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (id: string): Promise<void> => {
  try {
    await unAuthApi.default.delete(`/categories/${id}`, { withCredentials: true });
  } catch (error) {
    throw error;
  }
};

const getCategoryTree = async (): Promise<Category[]> => {
  try {
    const response = await unAuthApi.default.get('/categories/tree', { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCategoryParent = async (id: string): Promise<Category[]> => {
  try {
    const response = await unAuthApi.default.get(`/categories/parent/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCategoryByName = async (name: string): Promise<Category[]> => {
  try {
    const response = await unAuthApi.default.get(`/categories/by-name/${name}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCategoryByType = async (type: string): Promise<Category[]> => {
  try {
    const response = await unAuthApi.default.get(`/categories/type/${type}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getRootCategories = async (): Promise<Category[]> => {
  try {
    const response = await unAuthApi.default.get('/categories/root', { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  createCategory,
  deleteCategory,
  getCategoriesInternal,
  getCategoryByIdInternal,
  getCategoryByName,
  getCategoryByType,
  getCategoryParent,
  getCategoryTree,
  getRootCategories,
  updateCategory,
  type CategoriesResponse,
  type Category,
  type GetCategoriesParams,
};
