import {
  getCategoriesInternal,
  getCategoryByIdInternal,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  getCategoryParent,
  getCategoryByName,
  getCategoryByType,
  getRootCategories,
  type Category,
  type CategoriesResponse,
  type GetCategoriesParams,
} from '@/services/category.api';
import { useCallback, useState } from 'react';

export function useCategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tree, setTree] = useState<Category[]>([]);
  const [rootCategories, setRootCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách category (có thể truyền params)
  const fetchCategories = useCallback(async (params?: GetCategoriesParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategoriesInternal(params);
      setCategories(res.content || []);
    } catch (err) {
      setError('Lỗi khi tải danh mục');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy cây phân cấp
  const fetchTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategoryTree();
      setTree(res || []);
    } catch (err) {
      setError('Lỗi khi tải cây danh mục');
      setTree([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy root
  const fetchRootCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRootCategories();
      setRootCategories(res || []);
    } catch (err) {
      setError('Lỗi khi tải danh mục gốc');
      setRootCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Thêm mới
  const handleCreate = useCallback(async (data: Partial<Category>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createCategory(data);
      await fetchCategories();
      return res;
    } catch (err) {
      setError('Lỗi khi thêm danh mục');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  // Sửa
  const handleUpdate = useCallback(async (id: string, data: Partial<Category>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateCategory(id, data);
      await fetchCategories();
      return res;
    } catch (err) {
      setError('Lỗi khi cập nhật danh mục');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  // Xóa
  const handleDelete = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      setError('Lỗi khi xóa danh mục');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  // Lấy parent
  const fetchParent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await getCategoryParent(id);
    } catch (err) {
      setError('Lỗi khi lấy parent');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Tìm theo tên
  const fetchByName = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      return await getCategoryByName(name);
    } catch (err) {
      setError('Lỗi khi tìm theo tên');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Tìm theo type
  const fetchByType = useCallback(async (type: string) => {
    setLoading(true);
    setError(null);
    try {
      return await getCategoryByType(type);
    } catch (err) {
      setError('Lỗi khi tìm theo type');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Kiểm tra tồn tại
  const checkExist = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await getCategoryByIdInternal(id);
    } catch (err) {
      setError('Không tìm thấy danh mục');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    tree,
    rootCategories,
    loading,
    error,
    fetchCategories,
    fetchTree,
    fetchRootCategories,
    handleCreate,
    handleUpdate,
    handleDelete,
    fetchParent,
    fetchByName,
    fetchByType,
    checkExist,
  };
} 