import {
  getDashboardMetric,
  getDashboardStats,
  type DashboardStats,
} from '@/services/dashboard.api';
import { useCallback, useEffect, useState } from 'react';

// Interface for the new getDashboardMetric API response
interface DashboardMetricStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalCategories: number;
  totalSellers: number;
  newUsersThisMonth: number;
  revenueThisMonth: number;
  totalReport: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu dashboard');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

// New hook for the getDashboardMetric API
export function useDashboardMetric() {
  const [stats, setStats] = useState<DashboardMetricStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardMetric();
      setStats(data);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu dashboard');
      console.error('Dashboard metric fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
