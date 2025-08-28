'use client';

import { productApi, RetradeProductDetail } from '@/service/product.api';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function useRetradeProductDetail(productId: string) {
  const [productDetail, setProductDetail] = useState<RetradeProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductDetail = useCallback(async () => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await productApi.getRetradeProductDetail(productId);
      setProductDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product detail');
      toast.error('Không thể tải chi tiết sản phẩm retrade');
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  const refreshProductDetail = () => {
    fetchProductDetail();
  };

  return {
    productDetail,
    isLoading,
    error,
    refreshProductDetail,
  };
}
