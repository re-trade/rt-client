'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCategoryManager } from '@/hooks/use-category-manager';
import type { Category } from '@/services/category.api';
import { unAuthApi } from '@retrade/util/src/api/instance';
import { ChevronRight } from 'lucide-react';
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
          className={`transition-colors group ${level > 0 ? 'border-l-4 border-blue-100 bg-blue-50/30' : ''} hover:bg-blue-50`}
        >
          <TableCell style={{ paddingLeft: `${level * 32 + 16}px` }}>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 transition-colors ${hasChildren ? 'hover:bg-blue-100' : 'opacity-50 cursor-default'}`}
                onClick={hasChildren ? () => setExpanded((e) => !e) : undefined}
                aria-label={expanded ? 'Thu gọn' : 'Mở rộng'}
                disabled={!hasChildren}
                tabIndex={hasChildren ? 0 : -1}
              >
                <span
                  className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
                >
                  {hasChildren ? (
                    <ChevronRight
                      size={16}
                      className={hasChildren ? 'text-gray-700' : 'text-gray-300'}
                    />
                  ) : (
                    <ChevronRight size={16} className="text-gray-300" />
                  )}
                </span>
              </Button>
              <span
                className={`group-hover:text-blue-600 transition-colors ${level === 0 ? 'font-bold text-base' : 'text-sm text-blue-700 font-medium'}`}
              >
                {category.name}
              </span>
            </div>
          </TableCell>
          <TableCell>
            {category.description || <span className="text-gray-400">(Không có)</span>}
          </TableCell>
          <TableCell>
            {category.visible ? (
              <span className="text-xs text-green-600 bg-green-100 rounded px-2 py-0.5">Hiện</span>
            ) : (
              <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">Ẩn</span>
            )}
          </TableCell>
          <TableCell>
            <Button
              size="sm"
              variant="outline"
              className="mr-2 hover:border-blue-400 hover:text-blue-700"
              onClick={() => openEditDialog(category)}
            >
              Sửa
            </Button>
            <Button
              size="sm"
              variant={category.visible ? 'destructive' : 'secondary'}
              className="hover:border-blue-400 hover:text-blue-700"
              onClick={() => handleToggleVisible(normalizeCategory(category))}
            >
              {category.visible ? 'Ẩn' : 'Hiện'}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="hover:border-blue-400 hover:text-blue-700"
              onClick={() => openCreateDialog(category.id)}
            >
              Thêm con
            </Button>
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
    <div>
      <h2 className="text-xl font-bold mb-2">Quản lý Category</h2>
      <Separator className="mb-4" />
      <Button type="button" variant="secondary" className="mb-4" onClick={() => openCreateDialog()}>
        Thêm mới
      </Button>
      {loading && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/5">Tên danh mục</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(6)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-24" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/5">Tên danh mục</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories
                .filter((cat) => !cat.parentId)
                .map((cat) => (
                  <TreeTableRow key={cat.id} category={cat} />
                ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {/* Dialog Thêm/Sửa */}
      <Dialog open={!!openDialog} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogTitle>{openDialog === 'create' ? 'Thêm danh mục' : 'Sửa danh mục'}</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Tên danh mục</Label>
              <Input name="name" value={form.name || ''} onChange={handleFormChange} required />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Input
                name="description"
                value={form.description || ''}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Label>Trạng thái</Label>
              <select
                name="visible"
                value={form.visible ? 'true' : 'false'}
                onChange={handleFormChange}
              >
                <option value="true">Hiện</option>
                <option value="false">Ẩn</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={closeDialog}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
