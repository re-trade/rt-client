import { profileApi } from '@/services/customer-profile.api';
import { useEffect, useState } from 'react';

export type TCustomerBaseMetric = {
  boughtItems: number;
  orderPlace: number;
  orderComplete: number;
  walletBalance: number;
};

export type CustomerMetricsHookReturn = {
  metrics: TCustomerBaseMetric | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export const useCustomerMetrics = (): CustomerMetricsHookReturn => {
  const [metrics, setMetrics] = useState<TCustomerBaseMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileApi.getCustomerBaseMetric();
      if (data) {
        setMetrics(data);
      } else {
        setError('Không thể tải dữ liệu thống kê');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
};
