import { authApi, IResponseObject } from '@retrade/util';

interface DashboardStats {
  totalCategories: number;
  totalCustomers: number;
  totalOrders: number;
  totalProducts: number;
  totalSellers: number;
}

interface DashboardStatsResponse {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalCategories: number;
  totalSellers: number;
  newUsersThisMonth: number;
  revenueThisMonth: number;
  totalReport: number;
}

interface ProductStatusCount {
  status: string;
  count: number;
}

interface ProductStatusChartData {
  name: string;
  value: number;
  color: string;
}

interface RevenueMonthResponse {
  month: string;
  total: number;
}

const productStatusColorMap: Record<string, string> = {
  ACTIVE: '#10b981',
  INACTIVE: '#f59e0b',
  DELETED: '#ef4444',
  INIT: '#3b82f6',
  DRAFT: '#8b5cf6',
  default: '#6b7280',
};

const productStatusNames: Record<string, string> = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Ngừng hoạt động',
  DELETED: 'Đã xóa',
  INIT: 'Khởi tạo',
  DRAFT: 'Bản nháp',
  default: 'Không xác định',
};

const getCategoriesCount = async (): Promise<number> => {
  try {
    const response = await authApi.default.get('/categories/all');
    return response.data.content?.length || 0;
  } catch (error) {
    console.error('Error fetching categories count:', error);
    return 0;
  }
};

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
    const [categoriesCount, customersCount, ordersCount, productsCount, sellersCount] =
      await Promise.all([
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

const getDashboardMetric = async (): Promise<DashboardStatsResponse> => {
  try {
    const response =
      await authApi.default.get<IResponseObject<DashboardStatsResponse>>('/dashboard/admin/metric');
    if (response.data.success) {
      return response.data.content;
    } else {
      return {
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCategories: 0,
        totalSellers: 0,
        newUsersThisMonth: 0,
        revenueThisMonth: 0,
        totalReport: 0,
      };
    }
  } catch {
    return {
      totalUsers: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCategories: 0,
      totalSellers: 0,
      newUsersThisMonth: 0,
      revenueThisMonth: 0,
      totalReport: 0,
    };
  }
};

const getDashboardRevenue = async (year: number): Promise<RevenueMonthResponse[]> => {
  try {
    const response = await authApi.default.get<IResponseObject<RevenueMonthResponse[]>>(
      `/dashboard/admin/revenue?year=${year}`,
    );
    if (response.data.success) {
      return response.data.content;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

const getProductStatsByStatus = async (): Promise<ProductStatusChartData[]> => {
  try {
    const response = await authApi.default.get<IResponseObject<ProductStatusCount[]>>(
      '/dashboard/admin/product-stats',
    );
    if (response.data.success) {
      return response.data.content.map((item) => ({
        name: productStatusNames[item.status] || productStatusNames.default || 'Không xác định',
        value: item.count,
        color: productStatusColorMap[item.status] || productStatusColorMap.default || '#6b7280',
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching product stats:', error);
    return [];
  }
};

export {
  getCategoriesCount,
  getCustomersCount,
  getDashboardMetric,
  getDashboardRevenue,
  getDashboardStats,
  getOrdersCount,
  getProductsCount,
  getProductStatsByStatus,
  getSellersCount,
  type DashboardStats,
  type DashboardStatsResponse,
  type ProductStatusChartData,
  type RevenueMonthResponse,
};
