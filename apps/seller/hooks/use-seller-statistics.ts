import { dashboardApi } from '@/service/dashboard.api';
import { SellerProfileResponse } from '@/service/seller.api';
import { useCallback, useEffect, useState } from 'react';

export interface SellerStatistics {
  totalProducts: number;
  totalOrders: number;
  rating: number;
}

function useSellerStatistics(sellerProfile?: SellerProfileResponse) {
  const [statistics, setStatistics] = useState<SellerStatistics>({
    totalProducts: 0,
    totalOrders: 0,
    rating: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const api = dashboardApi();

      // Fetch product metrics and order metrics in parallel
      const [productMetrics, orderMetrics] = await Promise.all([
        api.fetchSellerProductMetric(),
        api.fetchOrderBasicMetric(),
      ]);

      // Update statistics with fetched data
      setStatistics((prev) => ({
        ...prev,
        totalProducts: productMetrics?.productQuantity || 0,
        totalOrders: orderMetrics?.totalOrder || 0,
        // Use rating from seller profile or keep existing rating
        rating: sellerProfile?.avgVote || prev.rating || 0,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch seller statistics';
      setError(errorMessage);
      console.error('Error fetching seller statistics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshStatistics = useCallback(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    isLoading,
    error,
    refreshStatistics,
  };
}

export { useSellerStatistics };
