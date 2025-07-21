'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Camera, DeviceMobile, House, Laptop, SpeakerHigh, Tag, TShirt } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const getIconForCategory = (name: string): { Icon: React.ElementType; color: string } => {
  const lowerCaseName = name.toLowerCase();
  if (
    lowerCaseName.includes('electronic') ||
    lowerCaseName.includes('computer') ||
    lowerCaseName.includes('laptop') ||
    lowerCaseName.includes('computing')
  ) {
    return { Icon: Laptop, color: '#3b82f6' };
  }
  if (lowerCaseName.includes('phone') || lowerCaseName.includes('mobile')) {
    return { Icon: DeviceMobile, color: '#06b6d4' };
  }
  if (
    lowerCaseName.includes('fashion') ||
    lowerCaseName.includes('apparel') ||
    lowerCaseName.includes('clothing')
  ) {
    return { Icon: TShirt, color: '#f472b6' };
  }
  if (lowerCaseName.includes('home') || lowerCaseName.includes('appliances')) {
    return { Icon: House, color: '#f59e42' };
  }
  if (lowerCaseName.includes('camera') || lowerCaseName.includes('photography')) {
    return { Icon: Camera, color: '#a78bfa' };
  }
  if (
    lowerCaseName.includes('audio') ||
    lowerCaseName.includes('music') ||
    lowerCaseName.includes('speaker')
  ) {
    return { Icon: SpeakerHigh, color: '#facc15' };
  }
  return { Icon: Tag, color: '#64748b' };
};

// Sửa lại normalizeCategory để trả về object chuẩn, không ép type Category
const normalizeCategory = (cat: any): Category => ({
  ...cat,
  description: typeof cat.description === 'string' ? cat.description : '',
  categoryParentId: cat.categoryParentId ?? null,
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
      categoryParentId: cat.categoryParentId ?? null,
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
    } catch (err) {
      toast.error('Có lỗi xảy ra!', { position: 'top-right' });
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
    category: Category;
    level?: number;
    parentExpanded?: boolean;
  }) {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = category.children && category.children.length > 0;
    const { Icon, color } = getIconForCategory(category.name);
    if (!parentExpanded) return null;
    return (
      <>
        <TableRow className="transition-colors hover:bg-gray-50 group">
          <TableCell style={{ paddingLeft: `${level * 24 + 16}px` }}>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 transition-colors ${hasChildren ? 'hover:bg-gray-200' : 'opacity-50 cursor-default'}`}
                onClick={hasChildren ? () => setExpanded((e) => !e) : undefined}
                aria-label={expanded ? 'Thu gọn' : 'Mở rộng'}
                disabled={!hasChildren}
                tabIndex={hasChildren ? 0 : -1}
              >
                {expanded ? (
                  <ChevronDown
                    size={16}
                    className={hasChildren ? 'text-gray-700' : 'text-gray-300'}
                  />
                ) : (
                  <ChevronRight
                    size={16}
                    className={hasChildren ? 'text-gray-700' : 'text-gray-300'}
                  />
                )}
              </Button>
              <Icon
                size={20}
                weight="duotone"
                color={color}
                className="transition-colors group-hover:scale-110"
              />
              <span className="font-medium group-hover:text-blue-600 transition-colors">
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
              className="mr-2"
              onClick={() => openEditDialog(category)}
            >
              Sửa
            </Button>
            <Button
              size="sm"
              variant={category.visible ? 'destructive' : 'secondary'}
              onClick={() => handleToggleVisible(normalizeCategory(category))}
            >
              {category.visible ? 'Ẩn' : 'Hiện'}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => openCreateDialog(category.id)}>
              Thêm con
            </Button>
          </TableCell>
        </TableRow>
        {hasChildren &&
          expanded &&
          category.children!.map((child) => (
            <TreeTableRow
              key={child.id}
              category={child}
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
      {loading && <div>Đang tải...</div>}
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
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    {cat.categoryParentId ? (
                      <span style={{ marginLeft: 24 }}>↳ {cat.name}</span>
                    ) : (
                      <b>{cat.name}</b>
                    )}
                  </TableCell>
                  <TableCell>{cat.parentName || '(root)'}</TableCell>
                  <TableCell>
                    {cat.description || <span className="text-gray-400">(Không có)</span>}
                  </TableCell>
                  <TableCell>
                    {cat.visible ? (
                      <span className="text-xs text-green-600 bg-green-100 rounded px-2 py-0.5">
                        Hiện
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">
                        Ẩn
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mr-2"
                      onClick={() => openEditDialog(cat)}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant={cat.visible ? 'destructive' : 'secondary'}
                      onClick={() => handleToggleVisible(normalizeCategory(cat))}
                    >
                      {cat.visible ? 'Ẩn' : 'Hiện'}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => openCreateDialog(cat.id)}>
                      Thêm con
                    </Button>
                  </TableCell>
                </TableRow>
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
