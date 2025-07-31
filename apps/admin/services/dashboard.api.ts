import { authApi } from '@retrade/util';

interface DashboardStats {
  totalCategories: number;
  totalCustomers: number;
  totalOrders: number;
  totalProducts: number;
  totalSellers: number;
}

interface ApiResponse<T> {
  content: T[];
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

// Fetch categories count
const getCategoriesCount = async (): Promise<number> => {
  try {
    const response = await authApi.default.get('/categories/all');
    return response.data.content?.length || 0;
  } catch (error) {
    console.error('Error fetching categories count:', error);
    return 0;
  }
};

// Fetch customers count
const getCustomersCount = async (): Promise<number> => {
  try {
    const response = await authApi.default.get('/customers', {
      params: { page: 0, size: 30 },
    });
    return response.data.pagination?.totalElements || 0;
  } catch (error) {
    console.error('Error fetching customers count:', error);
    return 0;
  }
};

// Fetch orders count
const getOrdersCount = async (): Promise<number> => {
  try {
    const response = await authApi.default.get('/orders', {
      params: { page: 0, size: 50 },
    });
    return response.data.pagination?.totalElements || 0;
  } catch (error) {
    console.error('Error fetching orders count:', error);
    return 0;
  }
};

// Fetch products count
const getProductsCount = async (): Promise<number> => {
  try {
    const response = await authApi.default.get('/products', {
      params: { page: 0, size: 50 },
    });
    return response.data.pagination?.totalElements || 0;
  } catch (error) {
    console.error('Error fetching products count:', error);
    return 0;
  }
};

// Fetch sellers count
const getSellersCount = async (): Promise<number> => {
  try {
    const response = await authApi.default.get('/sellers', {
      params: { page: 0, size: 50 },
    });
    return response.data.pagination?.totalElements || 0;
  } catch (error) {
    console.error('Error fetching sellers count:', error);
    return 0;
  }
};

// Fetch all dashboard stats
const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [categoriesCount, customersCount, ordersCount, productsCount, sellersCount] = await Promise.all([
      getCategoriesCount(),
      getCustomersCount(),
      getOrdersCount(),
      getProductsCount(),
      getSellersCount(),
    ]);

    return {
      totalCategories: categoriesCount,
      totalCustomers: customersCount,
      totalOrders: ordersCount,
      totalProducts: productsCount,
      totalSellers: sellersCount,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalCategories: 0,
      totalCustomers: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalSellers: 0,
    };
  }
};

export {
  getDashboardStats,
  getCategoriesCount,
  getCustomersCount,
  getOrdersCount,
  getProductsCount,
  getSellersCount,
  type DashboardStats,
  type ApiResponse,
}; 