import {
  createCategory,
  getAllCategories,
  updateCategory,
  type Category,
} from '@/services/category.api';
import { useCallback, useState } from 'react';

const normalizeCategory = (cat: any): Category => ({
  ...cat,
  description: typeof cat.description === 'string' ? cat.description : '',
  parentId: cat.parentId ?? null,
  parentName: cat.parentName ?? null,
  children: Array.isArray(cat.children) ? cat.children.map(normalizeCategory) : null,
});

export function useCategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllCategories();
      setCategories(res.map(normalizeCategory));
    } catch (err) {
      setError('Lỗi khi tải danh mục');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreate = useCallback(
    async (data: {
      name: string;
      description?: string;
      categoryParentId?: string | null;
      visible: boolean;
    }) => {
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
    },
    [fetchCategories],
  );

  // Sửa
  const handleUpdate = useCallback(
    async (
      id: string,
      data: {
        name: string;
        description?: string;
        categoryParentId?: string | null;
        visible: boolean;
      },
    ) => {
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
    },
    [fetchCategories],
  );

  // Toggle visible (ẩn/hiện)
  const handleToggleVisible = useCallback(
    async (cat: Category) => {
      return handleUpdate(cat.id, {
        name: cat.name,
        description: cat.description,
        categoryParentId: (cat as any).parentId ?? null,
        visible: !cat.visible,
      });
    },
    [handleUpdate],
  );

  return {
    categories,
    loading,
    error,
    fetchCategories,
    handleCreate,
    handleUpdate,
    handleToggleVisible,
  };
}
