import { productApi, TProduct, TProductHistory } from '@/services/product.api';
import { useCallback, useEffect, useState } from 'react';

export function useProductDetail(id: string) {
  const [productDetail, setProductDetail] = useState<TProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<TProduct[]>([]);
  const [productHistories, setProductHistories] = useState<TProductHistory[]>([]);
  const [listImg, setListImg] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const product = await productApi.getProduct(id);
      setProductDetail(product);
      setListImg([
        ...(product.thumbnail ? [product.thumbnail] : []),
        ...(product.productImages || []),
      ]);

      const related = await productApi.getProductSimilar(id, 0, 4);
      setRelatedProducts(related);

      const productHistories = await productApi.getProductHistory(id);
      setProductHistories(productHistories);
    } catch (error) {
      console.error('Error fetching product detail or related:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (mounted) {
        await fetchData();
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [fetchData]);

  return { productDetail, productHistories, listImg, relatedProducts, loading, refresh: fetchData };
}
