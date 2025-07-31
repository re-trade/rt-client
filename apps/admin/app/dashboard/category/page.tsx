'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { useCategoryManager } from '@/hooks/use-category-manager';
import type { Category } from '@/services/category.api';
import { unAuthApi } from '@retrade/util/src/api/instance';
import { ChevronRight, Edit, Eye, EyeOff, Plus } from 'lucide-react';
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
          className={`transition-all duration-300 hover:bg-base-200 ${
            level > 0 ? 'border-l-4 border-primary/20 bg-primary/5' : ''
          }`}
        >
          <TableCell style={{ paddingLeft: `${level * 32 + 16}px` }}>
            <div className="flex items-center gap-3">
              <button
                className={`btn btn-ghost btn-sm btn-circle ${
                  hasChildren ? 'hover:bg-primary/10' : 'opacity-50 cursor-default'
                }`}
                onClick={hasChildren ? () => setExpanded((e) => !e) : undefined}
                disabled={!hasChildren}
              >
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${
                    expanded ? 'rotate-90' : ''
                  } ${hasChildren ? 'text-primary' : 'text-base-content/30'}`}
                />
              </button>
              <span
                className={`font-medium transition-colors ${
                  level === 0
                    ? 'text-lg text-base-content font-bold'
                    : 'text-sm text-primary font-semibold'
                }`}
              >
                {category.name}
              </span>
            </div>
          </TableCell>
          <TableCell>
            <div className="text-sm text-base-content/70">
              {category.description || (
                <span className="text-base-content/40 italic">(Không có mô tả)</span>
              )}
            </div>
          </TableCell>
          <TableCell>
            {category.visible ? (
              <div className="badge badge-success badge-sm gap-1">
                <Eye className="h-3 w-3" />
                Hiện
              </div>
            ) : (
              <div className="badge badge-neutral badge-sm gap-1">
                <EyeOff className="h-3 w-3" />
                Ẩn
              </div>
            )}
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              <button
                className="btn btn-primary btn-sm btn-outline"
                onClick={() => openEditDialog(category)}
              >
                <Edit className="h-4 w-4" />
                Sửa
              </button>
              <button
                className={`btn btn-sm ${
                  category.visible ? 'btn-error btn-outline' : 'btn-success btn-outline'
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
                className="btn btn-accent btn-sm btn-outline"
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
    <div className="space-y-6">
      {/* Header */}
      <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg p-6">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold">Quản lý Danh mục</h1>
            <p className="py-4">Quản lý các danh mục sản phẩm trong hệ thống</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Tổng danh mục</div>
            <div className="stat-value text-primary">{categories.length}</div>
          </div>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => openCreateDialog()}>
          <Plus className="h-5 w-5" />
          Thêm danh mục mới
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card bg-base-100 shadow-lg border border-base-300">
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
        <div className="alert alert-error shadow-lg">
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
        <div className="card bg-base-100 shadow-lg border border-base-300">
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
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-xl font-bold">
            {openDialog === 'create' ? 'Thêm danh mục mới' : 'Sửa danh mục'}
          </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <Label className="label">
                <span className="label-text">Tên danh mục</span>
              </Label>
              <Input
                name="name"
                value={form.name || ''}
                onChange={handleFormChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <Label className="label">
                <span className="label-text">Mô tả</span>
              </Label>
              <Input
                name="description"
                value={form.description || ''}
                onChange={handleFormChange}
                className="input input-bordered"
                placeholder="Mô tả danh mục (tùy chọn)"
              />
            </div>
            <div className="form-control">
              <Label className="label">
                <span className="label-text">Trạng thái</span>
              </Label>
              <select
                name="visible"
                value={form.visible ? 'true' : 'false'}
                onChange={handleFormChange}
                className="select select-bordered w-full"
              >
                <option value="true">Hiện</option>
                <option value="false">Ẩn</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeDialog}
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
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
