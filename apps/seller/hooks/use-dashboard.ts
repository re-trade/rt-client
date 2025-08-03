'use client';
import { dashboardApi, DashboardMetricResponse } from '@/service/dashboard.api';
import { useCallback, useEffect, useState } from 'react';

export type TimeRange = '7d' | '30d' | '90d' | '1y';

const useDashboard = (initialTimeRange: TimeRange = '30d') => {
  const [dashboardMetric, setDashboardMetric] = useState<DashboardMetricResponse[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const calculateDateRange = useCallback((range: TimeRange): { fromDate: Date; toDate: Date } => {
    const toDate = new Date();
    const fromDate = new Date();

    switch (range) {
      case '7d':
        fromDate.setDate(fromDate.getDate() - 7);
        break;
      case '30d':
        fromDate.setDate(fromDate.getDate() - 30);
        break;
      case '90d':
        fromDate.setDate(fromDate.getDate() - 90);
        break;
      case '1y':
        fromDate.setFullYear(fromDate.getFullYear() - 1);
        break;
      default:
        fromDate.setDate(fromDate.getDate() - 30);
    }

    return { fromDate, toDate };
  }, []);

  const fetchDashboardMetric = useCallback(async () => {
    setIsLoading(true);
    const { fromDate, toDate } = calculateDateRange(timeRange);
    const response = await dashboardApi().fetchSellerDashboardMetric(fromDate, toDate);
    setDashboardMetric(response);
    setIsLoading(false);
  }, [timeRange, calculateDateRange]);

  const refreshDashboard = useCallback(() => {
    fetchDashboardMetric();
  }, [fetchDashboardMetric]);

  const updateTimeRange = useCallback((newRange: TimeRange) => {
    setTimeRange(newRange);
  }, []);

  useEffect(() => {
    fetchDashboardMetric();
  }, [fetchDashboardMetric]);

  return {
    dashboardMetric,
    timeRange,
    updateTimeRange,
    refreshDashboard,
    isLoading,
  };
};

export { useDashboard };
