import { authApi } from '@retrade/util';

export type TBrand = {
  id: string;
  name: string;
  imgUrl: string;
};

export type TCategory = {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  parentName?: string;
  visible?: boolean;
  children?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type BrandInput = {
  name: string;
  imgUrl: string;
  description?: string;
  categoryIds?: string[];
};

interface IResponseObject<T> {
  code: string;
  success: boolean;
  messages: string[];
  content: T;
  pagination?: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
}



const getBrands = async (
  page: number = 0,
  size: number = 10,
  query?: string,
): Promise<IResponseObject<TBrand[]> | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TBrand[]>>(
      `/brands`,
      {
        params: {
          page,
          size,
          ...(query ? { q: query } : {}),
        },
      },
    );
    if (result.data.success && result.status === 200) {
      return result.data;
    }
  } catch {
    return undefined;
  }
};

const postBrand = async (data: BrandInput): Promise<IResponseObject<TBrand>> => {
  try {
    if (!data.name.trim()) {
      throw new Error('Brand name is required');
    }
    if (!data.imgUrl.trim()) {
      throw new Error('Image URL is required');
    }
   

    const cleanData = {
      name: data.name.trim(),
      imgUrl: data.imgUrl.trim(),
      description: data.description?.trim() || '',
      categoryIds: data.categoryIds || [],
    };

    console.log('Posting brand with:', JSON.stringify(cleanData, null, 2));

    const response = await authApi.default.post<IResponseObject<TBrand>>(
      `/brands`,
      cleanData,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );

    if (!response?.data || !response.data.success) {
      throw new Error(response?.data?.messages?.[0] || 'Failed to post brand');
    }

    return response.data;
  } catch (error: any) {
    console.error('Error posting brand:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });
    throw new Error(error.response?.data?.messages?.[0] || error.message || 'Failed to post brand');
  }
};

const getCategories = async (): Promise<IResponseObject<TCategory[]> | undefined> => {
  try {
    const response = await authApi.default.get<IResponseObject<TCategory[]>>(
      '/categories/all',
      { withCredentials: true },
    );
    if (response.status === 200 && response.data.success) {
      return response.data;
    }
    return undefined;
  } catch (error: any) {
    console.error('Error fetching categories:', error.response || error.message);
    return undefined;
  }
};

export {getBrands, postBrand, type IResponseObject , getCategories};

function isValidUrl(arg0: string) {
    throw new Error('Function not implemented.');
}
