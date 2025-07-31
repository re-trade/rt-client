'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { useCategoryManager } from '@/hooks/use-category-manager';
import type { Category } from '@/services/category.api';
import { unAuthApi } from '@retrade/util/src/api/instance';
import { ChevronRight, Edit, Eye, EyeOff, Plus, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const normalizeCategory = (cat: any): Category => ({
  ...cat,
  description: typeof cat.description === 'string' ? cat.description : '',
  parentId: cat.parentId ?? null,
  parentName: cat.parentName ?? null,
  children: Array.isArray(cat.children) ? cat.children.map(normalizeCategory) : null,
});

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const res = await unAuthApi.default.get('categories', {
      params: { page: 0, size: 50 },
    });
    return res.data.content || [];
  } catch (err) {
    return [];
  }
};

export default function CategoryPage() {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    handleCreate,
    handleUpdate,
    handleToggleVisible,
  } = useCategoryManager();

  // State cho dialog và form
  const [openDialog, setOpenDialog] = useState<null | 'create' | 'edit'>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<{
    name: string;
    description?: string;
    categoryParentId?: string | null;
    visible: boolean;
  }>({ name: '', description: '', categoryParentId: null, visible: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load danh mục ban đầu
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Xử lý form input
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' && 'checked' in e.target
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  // Mở dialog thêm mới
  const openCreateDialog = (categoryParentId?: string | null) => {
    setForm({
      name: '',
      description: '',
      categoryParentId: categoryParentId ?? null,
      visible: true,
    });
    setEditingCategory(null);
    setOpenDialog('create');
  };

  // Mở dialog sửa
  const openEditDialog = (cat: Category) => {
    setForm({
      name: cat.name,
      description: cat.description ?? '',
      categoryParentId: cat.parentId ?? null,
      visible: cat.visible,
    });
    setEditingCategory(cat);
    setOpenDialog('edit');
  };

  // Đóng dialog
  const closeDialog = () => {
    setOpenDialog(null);
    setEditingCategory(null);
    setForm({ name: '', description: '', categoryParentId: null, visible: true });
  };

  // Submit form thêm/sửa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      name: form.name,
      description: form.description ?? undefined,
      categoryParentId: form.categoryParentId ?? null,
      visible: form.visible,
    };
    try {
      if (openDialog === 'create') {
        await handleCreate(payload);
        toast.success('Thêm danh mục thành công!', { position: 'top-right' });
      } else if (openDialog === 'edit' && editingCategory) {
        await handleUpdate(editingCategory.id, payload);
        toast.success('Cập nhật danh mục thành công!', { position: 'top-right' });
      }
    } catch (err: any) {
      console.error('Form submit error:', err);
      if (err?.response?.status === 401) {
        // Redirect về login nếu token hết hạn
        window.location.href = '/login?error=unauthorized';
        return;
      } else if (err?.response?.status === 500) {
        // Lỗi server
        toast.error('Lỗi server. Vui lòng thử lại sau!', { position: 'top-right' });
      } else {
        toast.error('Có lỗi xảy ra!', { position: 'top-right' });
      }
    } finally {
      setIsSubmitting(false);
      closeDialog();
    }
  };

  function TreeTableRow({
    category,
    level = 0,
    parentExpanded = true,
  }: {
    category: Category & { children?: Category[] | null };
    level?: number;
    parentExpanded?: boolean;
  }) {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = Array.isArray(category.children) && category.children.length > 0;
    if (!parentExpanded) return null;
    return (
      <>
        <TableRow
          className={`transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
            level > 0
              ? 'border-l-4 border-indigo-200 bg-gradient-to-r from-indigo-50/30 to-purple-50/30'
              : ''
          }`}
        >
          <TableCell style={{ paddingLeft: `${level * 32 + 16}px` }}>
            <div className="flex items-center gap-3">
              <button
                className={`btn btn-ghost btn-sm btn-circle ${
                  hasChildren ? 'hover:bg-indigo-100 text-indigo-600' : 'opacity-50 cursor-default'
                }`}
                onClick={hasChildren ? () => setExpanded((e) => !e) : undefined}
                disabled={!hasChildren}
              >
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${
                    expanded ? 'rotate-90' : ''
                  } ${hasChildren ? 'text-indigo-600' : 'text-gray-400'}`}
                />
              </button>
              <span
                className={`font-medium transition-colors ${
                  level === 0
                    ? 'text-lg text-gray-800 font-bold'
                    : 'text-sm text-indigo-700 font-semibold'
                }`}
              >
                {category.name}
              </span>
            </div>
          </TableCell>
          <TableCell>
            <div className="text-sm text-gray-600">
              {category.description || (
                <span className="text-gray-400 italic">(Không có mô tả)</span>
              )}
            </div>
          </TableCell>
          <TableCell>
            {category.visible ? (
              <div className="badge badge-success badge-sm gap-1 bg-emerald-100 text-emerald-700 border-emerald-200">
                <Eye className="h-3 w-3" />
                Hiện
              </div>
            ) : (
              <div className="badge badge-neutral badge-sm gap-1 bg-gray-100 text-gray-600 border-gray-200">
                <EyeOff className="h-3 w-3" />
                Ẩn
              </div>
            )}
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              <button
                className="btn btn-primary btn-sm btn-outline border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white"
                onClick={() => openEditDialog(category)}
              >
                <Edit className="h-4 w-4" />
                Sửa
              </button>
              <button
                className={`btn btn-sm ${
                  category.visible
                    ? 'btn-error btn-outline border-red-500 text-red-600 hover:bg-red-500 hover:text-white'
                    : 'btn-success btn-outline border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                }`}
                onClick={() => handleToggleVisible(normalizeCategory(category))}
              >
                {category.visible ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Ẩn
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Hiện
                  </>
                )}
              </button>
              <button
                className="btn btn-accent btn-sm btn-outline border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white"
                onClick={() => openCreateDialog(category.id)}
              >
                <Plus className="h-4 w-4" />
                Thêm con
              </button>
            </div>
          </TableCell>
        </TableRow>
        {hasChildren &&
          expanded &&
          Array.isArray(category.children) &&
          category.children.map((child) => (
            <TreeTableRow
              key={child.id}
              category={child as Category & { children?: Category[] | null }}
              level={level + 1}
              parentExpanded={expanded}
            />
          ))}
      </>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="hero bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white rounded-3xl p-12">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">Quản lý Danh mục</h1>
            <p className="text-xl opacity-90">Quản lý các danh mục sản phẩm trong hệ thống</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <div className="stats shadow-lg bg-white rounded-2xl border-0">
          <div className="stat">
            <div className="stat-figure text-indigo-600">
              <Tag className="h-8 w-8" />
            </div>
            <div className="stat-title text-gray-600">Tổng danh mục</div>
            <div className="stat-value text-indigo-600">{categories.length}</div>
          </div>
        </div>
        <button
          className="btn btn-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:scale-105 transition-all duration-300 shadow-lg"
          onClick={() => openCreateDialog()}
        >
          <Plus className="h-5 w-5" />
          Thêm danh mục mới
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card bg-white shadow-xl border-0 rounded-2xl">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="w-2/5">Tên danh mục</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(6)].map((_, i) => (
                    <tr key={i}>
                      <td>
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td>
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td>
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td>
                        <Skeleton className="h-8 w-24" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error shadow-lg rounded-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-bold">Lỗi!</h3>
            <div className="text-xs">{error}</div>
          </div>
        </div>
      )}

      {/* Categories Table */}
      {!loading && !error && (
        <div className="card bg-white shadow-xl border-0 rounded-2xl">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <th className="w-2/5 text-gray-700 font-semibold">Tên danh mục</th>
                    <th className="text-gray-700 font-semibold">Mô tả</th>
                    <th className="text-gray-700 font-semibold">Trạng thái</th>
                    <th className="text-gray-700 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categories
                    .filter((cat) => !cat.parentId)
                    .map((cat) => (
                      <TreeTableRow key={cat.id} category={cat} />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Thêm/Sửa */}
      <Dialog open={!!openDialog} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border-0 shadow-2xl">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {openDialog === 'create' ? 'Thêm danh mục mới' : 'Sửa danh mục'}
          </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <Label className="label">
                <span className="label-text text-gray-700 font-semibold">Tên danh mục</span>
              </Label>
              <Input
                name="name"
                value={form.name || ''}
                onChange={handleFormChange}
                className="input input-bordered border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="form-control">
              <Label className="label">
                <span className="label-text text-gray-700 font-semibold">Mô tả</span>
              </Label>
              <Input
                name="description"
                value={form.description || ''}
                onChange={handleFormChange}
                className="input input-bordered border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Mô tả danh mục (tùy chọn)"
              />
            </div>
            <div className="form-control">
              <Label className="label">
                <span className="label-text text-gray-700 font-semibold">Trạng thái</span>
              </Label>
              <select
                name="visible"
                value={form.visible ? 'true' : 'false'}
                onChange={handleFormChange}
                className="select select-bordered border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 w-full"
              >
                <option value="true">Hiện</option>
                <option value="false">Ẩn</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end mt-8">
              <button
                type="button"
                className="btn btn-ghost text-gray-600 hover:bg-gray-100"
                onClick={closeDialog}
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:scale-105 transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Đang lưu...
                  </>
                ) : (
                  'Lưu'
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
