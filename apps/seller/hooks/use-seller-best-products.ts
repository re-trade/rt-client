'use client';

import { dashboardApi, DashboardBestProductResponse } from '@/service/dashboard.api';
import { useCallback, useEffect, useState } from 'react';

interface UseSellerBestProductsState {
  bestProducts: DashboardBestProductResponse[];
  isLoading: boolean;
  error: string | null;
}

export function useSellerBestProducts() {
  const [state, setState] = useState<UseSellerBestProductsState>({
    bestProducts: [],
    isLoading: false,
    error: null,
  });

  const fetchBestProducts = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await dashboardApi().fetchSellerBestProduct();
      setState((prev) => ({
        ...prev,
        bestProducts: response,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Không thể tải dữ liệu sản phẩm bán chạy',
      }));
    }
  }, []);

  const formatBestProductsData = useCallback(() => {
    return state.bestProducts.map((product) => ({
      productName: product.productName,
      quantitySold: product.quantitySold,
      revenue: product.revenue,
      formattedRevenue: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(product.revenue),
    }));
  }, [state.bestProducts]);

  const getProductsByRevenue = useCallback(() => {
    return [...formatBestProductsData()].sort((a, b) => b.revenue - a.revenue);
  }, [formatBestProductsData]);

  const getProductsByQuantity = useCallback(() => {
    return [...formatBestProductsData()].sort((a, b) => b.quantitySold - a.quantitySold);
  }, [formatBestProductsData]);

  const getTotalRevenue = useCallback(() => {
    return state.bestProducts.reduce((sum, product) => sum + product.revenue, 0);
  }, [state.bestProducts]);

  const getTotalQuantitySold = useCallback(() => {
    return state.bestProducts.reduce((sum, product) => sum + product.quantitySold, 0);
  }, [state.bestProducts]);

  const getChartData = useCallback(
    (limit: number = 5) => {
      const topProducts = [...getProductsByRevenue()].slice(0, Math.min(limit, 5));

      return topProducts.map((product, index) => ({
        name: product.productName,
        revenue: product.revenue,
        formattedRevenue: product.formattedRevenue,
        quantitySold: product.quantitySold,
        color: getColorByIndex(index, topProducts.length),
      }));
    },
    [getProductsByRevenue],
  );

  const getColorByIndex = (index: number, total: number) => {
    const colors = [
      '#3b82f6', // Blue
      '#10b981', // Green
      '#f59e0b', // Amber
      '#8b5cf6', // Purple
      '#ec4899', // Pink
      '#06b6d4', // Cyan
      '#ef4444', // Red
      '#84cc16', // Lime
      '#6366f1', // Indigo
      '#14b8a6', // Teal
    ];

    return colors[index % colors.length];
  };

  useEffect(() => {
    fetchBestProducts();
  }, [fetchBestProducts]);

  return {
    bestProducts: state.bestProducts,
    formattedBestProducts: formatBestProductsData(),
    bestProductsByRevenue: getProductsByRevenue(),
    bestProductsByQuantity: getProductsByQuantity(),
    chartData: getChartData(),
    totalRevenue: getTotalRevenue(),
    formattedTotalRevenue: new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(getTotalRevenue()),
    totalQuantitySold: getTotalQuantitySold(),
    isLoading: state.isLoading,
    error: state.error,
    refetch: fetchBestProducts,
  };
}
