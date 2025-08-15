'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCategoryManager } from '@/hooks/use-category-manager';
import type { Category } from '@/services/category.api';
import { unAuthApi } from '@retrade/util/src/api/instance';
import { ChevronRight, Edit, Eye, EyeOff, MoreHorizontal, Plus, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

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

  const [openDialog, setOpenDialog] = useState<null | 'create' | 'edit'>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<{
    name: string;
    description?: string;
    categoryParentId?: string | null;
    visible: boolean;
  }>({ name: '', description: '', categoryParentId: null, visible: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' && 'checked' in e.target
          ? (e.target as HTMLInputElement).checked
          : name === 'categoryParentId'
            ? value === ''
              ? null
              : value
            : value,
    }));
  };

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

  const closeDialog = () => {
    setOpenDialog(null);
    setEditingCategory(null);
    setForm({ name: '', description: '', categoryParentId: null, visible: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (openDialog === 'create') {
        const payload = {
          name: form.name,
          description: form.description ?? undefined,
          categoryParentId: form.categoryParentId ?? null,
          visible: form.visible,
        };
        await handleCreate(payload);
        toast.success('Thêm danh mục thành công!', { position: 'top-right' });
      } else if (openDialog === 'edit' && editingCategory) {
        const payload: any = {
          name: form.name,
          description: form.description ?? undefined,
          visible: form.visible,
        };

        if (form.categoryParentId !== editingCategory.parentId) {
          payload.categoryParentId = form.categoryParentId;
        }

        await handleUpdate(editingCategory.id, payload);
        toast.success('Cập nhật danh mục thành công!', { position: 'top-right' });
      }
    } catch (err: any) {
      console.error('Form submit error:', err);
      if (err?.response?.status === 401) {
        window.location.href = '/login?error=unauthorized';
        return;
      } else if (err?.response?.status === 500) {
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
        <tr
          className={`hover:bg-gray-50 transition-colors ${level > 0 ? 'border-l-4 border-blue-200 bg-blue-50/30' : ''
            }`}
        >
          <td className="px-6 py-4" style={{ paddingLeft: `${level * 32 + 24}px` }}>
            <div className="flex items-center gap-3">
              <button
                className={`p-1 rounded hover:bg-blue-100 transition-colors ${hasChildren ? 'text-blue-600' : 'text-gray-400 cursor-default'
                  }`}
                onClick={hasChildren ? () => setExpanded((e) => !e) : undefined}
                disabled={!hasChildren}
              >
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${expanded ? 'rotate-90' : ''
                    }`}
                />
              </button>
              <span
                className={`font-medium ${level === 0
                  ? 'text-lg text-gray-800 font-bold'
                  : 'text-sm text-blue-700 font-semibold'
                  }`}
              >
                {category.name}
              </span>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="text-sm text-gray-600">
              {category.description ? (
                category.description.length > 48 ? (
                  `${category.description.slice(0, 48)}...`
                ) : (
                  category.description
                )
              ) : (
                <span className="text-gray-400 italic">(Không có mô tả)</span>
              )}
            </div>
          </td>
          <td className="px-6 py-4">
            {category.visible ? (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                <Eye className="h-3 w-3" />
                Hiện
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                <EyeOff className="h-3 w-3" />
                Ẩn
              </div>
            )}
          </td>
          <td className="px-6 py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-600 hover:text-orange-600 hover:bg-orange-50"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handleToggleVisible(normalizeCategory(category))}
                >
                  {category.visible ? (
                    <>
                      <EyeOff className="h-4 w-4 inline mr-1" />
                      Ẩn
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 inline mr-1" />
                      Hiện
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openEditDialog(category)}
                  className="cursor-pointer"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa danh mục
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => openCreateDialog(category.id)}
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  Thêm con danh mục
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </td>
        </tr>
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-blue-500 text-white rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Quản lý Danh mục</h1>
        <p className="text-lg opacity-90">Quản lý các danh mục sản phẩm trong hệ thống</p>
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Tổng danh mục</div>
              <div className="text-2xl font-bold text-gray-800">{categories.length}</div>
            </div>
          </div>
        </div>
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          onClick={() => openCreateDialog()}
        >
          <Plus className="h-5 w-5" />
          Thêm danh mục mới
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-6 py-3 text-gray-700 font-semibold w-2/5">
                      Tên danh mục
                    </th>
                    <th className="text-left px-6 py-3 text-gray-700 font-semibold">Mô tả</th>
                    <th className="text-left px-6 py-3 text-gray-700 font-semibold">Trạng thái</th>
                    <th className="text-left px-6 py-3 text-gray-700 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(6)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">!</span>
            </div>
            <div>
              <h3 className="font-semibold text-red-800">Lỗi!</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Categories Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-6 py-3 text-gray-700 font-semibold w-2/5">
                      Tên danh mục
                    </th>
                    <th className="text-left px-6 py-3 text-gray-700 font-semibold">Mô tả</th>
                    <th className="text-left px-6 py-3 text-gray-700 font-semibold">Trạng thái</th>
                    <th className="text-left px-6 py-3 text-gray-700 font-semibold">Thao tác</th>
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
        <DialogContent className="sm:max-w-md bg-white rounded-lg border border-gray-200">
          <DialogTitle className="text-xl font-bold text-gray-800">
            {openDialog === 'create' ? 'Thêm danh mục mới' : 'Sửa danh mục'}
          </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Tên danh mục</Label>
              <Input
                name="name"
                value={form.name || ''}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</Label>
              <Input
                name="description"
                value={form.description || ''}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mô tả danh mục (tùy chọn)"
              />
            </div>
            {openDialog === 'create' && (
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Danh mục cha</Label>
                <select
                  name="categoryParentId"
                  value={form.categoryParentId || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Không có danh mục cha</option>
                  {categories
                    .filter((cat) => !cat.parentId)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</Label>
              <select
                name="visible"
                value={form.visible ? 'true' : 'false'}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="true">Hiện</option>
                <option value="false">Ẩn</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={closeDialog}
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
