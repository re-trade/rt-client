import {
  BrandInput,
  getBrands,
  getCategories,
  postBrand,
  TBrand,
  TCategory,
} from '@/services/brand.api';
import { useCallback, useEffect, useState } from 'react';

const useBrandManager = (initialPage = 1, pageSize = 10) => {
  const [brands, setBrands] = useState<TBrand[]>([]);
  const [page, setPage] = useState(initialPage);
  const [maxPage, setMaxPage] = useState(1);
  const [totalBrands, setTotalBrands] = useState(0);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(
    async (searchQuery?: string, pageNumber: number = initialPage) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getBrands(pageNumber - 1, pageSize, searchQuery);
        if (response && response.success) {
          setBrands(response.content || []);
          setMaxPage(response.pagination?.totalPages ?? 1);
          setTotalBrands(response.pagination?.totalElements ?? response.content?.length ?? 0);
          setPage(pageNumber);
        } else {
          setBrands([]);
          setMaxPage(1);
          setTotalBrands(0);
          setError(response?.messages?.[0] || 'Failed to fetch brands');
        }
      } catch (err) {
        setBrands([]);
        setMaxPage(1);
        setTotalBrands(0);
        setError(err instanceof Error ? err.message : 'Failed to fetch brands');
      } finally {
        setLoading(false);
      }
    },
    [pageSize, initialPage],
  );

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const response = await getCategories();
      if (response && response.success) {
        setCategories(response.content || []);
      } else {
        setCategories([]);
        setCategoriesError(response?.messages?.[0] || 'Failed to fetch categories');
      }
    } catch (err) {
      setCategories([]);
      setCategoriesError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const addBrand = useCallback(
    async (data: BrandInput): Promise<{ success: boolean; message: string }> => {
      setLoading(true);
      setError(null);
      try {
        const response = await postBrand(data);
        if (response.success) {
          await fetchBrands(undefined, page);
          return { success: true, message: 'Brand added successfully' };
        } else {
          const msg = response.messages?.[0] || 'Failed to add brand';
          setError(msg);
          return { success: false, message: msg };
        }
      } catch (err: any) {
        const msg = err.message || 'Failed to add brand';
        setError(msg);
        return { success: false, message: msg };
      } finally {
        setLoading(false);
      }
    },
    [fetchBrands, page],
  );

  const updateBrand = useCallback(
    async (id: string, data: BrandInput): Promise<{ success: boolean; message: string }> => {
      setLoading(true);
      setError(null);
      try {
        const response = await postBrand(data);
        if (response.success) {
          await fetchBrands(undefined, page);
          return { success: true, message: 'Brand updated successfully' };
        } else {
          const msg = response.messages?.[0] || 'Failed to update brand';
          setError(msg);
          return { success: false, message: msg };
        }
      } catch (err: any) {
        const msg = err.message || 'Failed to update brand';
        setError(msg);
        return { success: false, message: msg };
      } finally {
        setLoading(false);
      }
    },
    [fetchBrands, page],
  );

  const deleteBrand = useCallback(
    async (id: string): Promise<{ success: boolean; message: string }> => {
      setLoading(true);
      setError(null);
      try {
        const response = await deleteBrand(id);
        if (response.success) {
          await fetchBrands(undefined, page);
          return { success: true, message: 'Brand deleted successfully' };
        } else {
          const msg = response.message?.[0] || 'Failed to delete brand';
          setError(msg);
          return { success: false, message: msg };
        }
      } catch (err: any) {
        const msg = err.message || 'Failed to delete brand';
        setError(msg);
        return { success: false, message: msg };
      } finally {
        setLoading(false);
      }
    },
    [fetchBrands, page],
  );

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const refetch = useCallback(() => fetchBrands(), [fetchBrands]);

  const goToPage = useCallback(
    (newPage: number, searchQuery?: string) => {
      setPage(newPage);
      fetchBrands(searchQuery, newPage);
    },
    [fetchBrands],
  );

  return {
    brands,
    page,
    maxPage,
    totalBrands,
    loading,
    error,
    fetchBrands,
    addBrand,
    deleteBrand,
    updateBrand,
    setPage,
    refetch,
    goToPage,
    fetchCategories,
    categories,
    categoriesLoading,
    categoriesError,
  };
};

export default useBrandManager;
