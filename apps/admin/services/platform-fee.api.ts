import { authApi } from '@retrade/util';

export interface PlatformFee {
  id: string;
  minPrice: number;
  maxPrice: number | null;
  feeRate: number;
  description: string;
}

export interface PlatformFeeCreateUpdate {
  minPrice: number;
  maxPrice: number | null;
  feeRate: number;
  description: string;
}

export interface IResponseObject<T> {
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

// Get all platform fees with pagination
const getPlatformFees = async (
  page: number = 0,
  size: number = 10,
): Promise<IResponseObject<PlatformFee[]> | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<PlatformFee[]>>(
      '/platform-settings/fee',
      {
        params: { page, size },
      },
    );

    if (result.data.success && result.status === 200) {
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching platform fees:', error);
    return undefined;
  }
};

// Get platform fee by ID
const getPlatformFeeById = async (
  id: string,
): Promise<IResponseObject<PlatformFee> | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<PlatformFee>>(
      `/platform-settings/fee/${id}`,
    );

    if (result.data.success && result.status === 200) {
      return result.data;
    }
  } catch (error) {
    console.error(`Error fetching platform fee with id ${id}:`, error);
    return undefined;
  }
};

// Create new platform fee
const createPlatformFee = async (
  payload: PlatformFeeCreateUpdate,
): Promise<IResponseObject<PlatformFee> | undefined> => {
  try {
    const result = await authApi.default.post<IResponseObject<PlatformFee>>(
      '/platform-settings/fee',
      payload,
    );

    if (result.data.success && result.status === 200) {
      return result.data;
    }
  } catch (error) {
    console.error('Error creating platform fee:', error);
    throw error;
  }
};

// Update platform fee
const updatePlatformFee = async (
  id: string,
  payload: PlatformFeeCreateUpdate,
): Promise<IResponseObject<PlatformFee> | undefined> => {
  try {
    const result = await authApi.default.put<IResponseObject<PlatformFee>>(
      `/platform-settings/fee/${id}`,
      payload,
    );

    if (result.data.success && result.status === 200) {
      return result.data;
    }
  } catch (error) {
    console.error(`Error updating platform fee with id ${id}:`, error);
    throw error;
  }
};

// Delete platform fee
const deletePlatformFee = async (id: string): Promise<IResponseObject<null> | undefined> => {
  try {
    const result = await authApi.default.delete<IResponseObject<null>>(
      `/platform-settings/fee/${id}`,
    );

    if (result.data.success && result.status === 200) {
      return result.data;
    }
  } catch (error) {
    console.error(`Error deleting platform fee with id ${id}:`, error);
    throw error;
  }
};

export {
  createPlatformFee,
  deletePlatformFee,
  getPlatformFeeById,
  getPlatformFees,
  updatePlatformFee,
};
