'use client';

import { dashboardApi, DashboardRevenueResponse } from '@/service/dashboard.api';
import { useCallback, useEffect, useState } from 'react';

interface UseSellerRevenueState {
  revenueData: DashboardRevenueResponse[];
  year: number;
  isLoading: boolean;
  error: string | null;
}

export function useSellerRevenue(initialYear: number = new Date().getFullYear()) {
  const [state, setState] = useState<UseSellerRevenueState>({
    revenueData: [],
    year: initialYear,
    isLoading: false,
    error: null,
  });

  const fetchRevenue = useCallback(
    async (year: number = state.year) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await dashboardApi().fetchSellerRevenue(year);
        setState((prev) => ({
          ...prev,
          revenueData: response,
          year,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Không thể tải dữ liệu doanh thu',
        }));
      }
    },
    [state.year],
  );

  const setYear = useCallback(
    (newYear: number) => {
      fetchRevenue(newYear);
    },
    [fetchRevenue],
  );

  const getAvailableYears = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = 0; i < 6; i++) {
      years.push(currentYear - i);
    }

    return years;
  }, []);

  const getFormattedChartData = useCallback(() => {
    const monthsData: Array<{
      month: number;
      monthName: string;
      total: number;
      formattedTotal: string;
    }> = Array.from({ length: 12 }, (_, i) => {
      const monthData = state.revenueData.find((item) => item.month === i + 1);

      return {
        month: i + 1,
        monthName: getMonthName(i),
        total: monthData?.total || 0,
        formattedTotal: new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0,
        }).format(monthData?.total || 0),
      };
    });

    return monthsData;
  }, [state.revenueData]);

  const getMonthName = (monthIndex: number): string => {
    const monthNames = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ];
    return monthNames[monthIndex];
  };

  const getTotalAnnualRevenue = useCallback(() => {
    return state.revenueData.reduce((sum, item) => sum + item.total, 0);
  }, [state.revenueData]);

  const getHighestRevenueMonth = useCallback(() => {
    if (state.revenueData.length === 0) return null;

    let highestMonth = state.revenueData[0];

    for (const month of state.revenueData) {
      if (highestMonth && month.total > highestMonth.total) {
        highestMonth = month;
      }
    }

    return {
      month: highestMonth?.month || 0,
      monthName: highestMonth ? getMonthName(highestMonth.month - 1) || '' : '',
      total: highestMonth?.total || 0,
      formattedTotal: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(highestMonth?.total || 0),
    };
  }, [state.revenueData]);

  const getQuarterlyRevenue = useCallback(() => {
    const quarters = [
      { name: 'Q1', months: [1, 2, 3], total: 0 },
      { name: 'Q2', months: [4, 5, 6], total: 0 },
      { name: 'Q3', months: [7, 8, 9], total: 0 },
      { name: 'Q4', months: [10, 11, 12], total: 0 },
    ];

    state.revenueData.forEach((item) => {
      const quarter = Math.ceil(item.month / 3) - 1;
      if (quarter >= 0 && quarter < 4 && quarters[quarter]) {
        quarters[quarter].total += item.total;
      }
    });

    return quarters.map((q) => ({
      ...q,
      formattedTotal: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(q.total),
    }));
  }, [state.revenueData]);

  const getAverageMonthlyRevenue = useCallback(() => {
    const nonZeroMonths = state.revenueData.filter((month) => month.total > 0).length || 1;
    return getTotalAnnualRevenue() / nonZeroMonths;
  }, [state.revenueData, getTotalAnnualRevenue]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  return {
    revenueData: state.revenueData,
    chartData: getFormattedChartData(),
    quarterlyData: getQuarterlyRevenue(),
    year: state.year,
    setYear,
    availableYears: getAvailableYears(),
    totalRevenue: getTotalAnnualRevenue(),
    formattedTotalRevenue: new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(getTotalAnnualRevenue()),
    highestMonth: getHighestRevenueMonth(),
    averageMonthlyRevenue: getAverageMonthlyRevenue(),
    formattedAverageMonthlyRevenue: new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(getAverageMonthlyRevenue()),
    isLoading: state.isLoading,
    error: state.error,
    refetch: fetchRevenue,
  };
}
