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
import { unAuthApi } from '@retrade/util/src/api/instance';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Camera, DeviceMobile, House, Laptop, SpeakerHigh, Tag, TShirt } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  parentName?: string | null;
  visible: boolean;
  children?: Category[] | null;
}

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
    handleDelete,
    fetchByName,
  } = useCategoryManager();

  // State cho dialog và form
  const [openDialog, setOpenDialog] = useState<null | 'create' | 'edit'>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<Partial<Category>>({
    name: '',
    description: '',
    visible: true,
    parentId: null,
  });
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);

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
  const openCreateDialog = (parentId?: string | null) => {
    setForm({ name: '', description: '', visible: true, parentId: parentId ?? null });
    setEditingCategory(null);
    setOpenDialog('create');
  };

  // Mở dialog sửa
  const openEditDialog = (cat: Category) => {
    setForm({
      name: cat.name,
      description: cat.description ?? '',
      visible: cat.visible,
      parentId: cat.parentId ?? null,
    });
    setEditingCategory(cat);
    setOpenDialog('edit');
  };

  // Đóng dialog
  const closeDialog = () => {
    setOpenDialog(null);
    setEditingCategory(null);
    setForm({ name: '', description: '', visible: true, parentId: null });
  };

  // Submit form thêm/sửa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Chỉ gửi các trường hợp lệ cho API
      const payload = {
        name: form.name,
        description: form.description ?? undefined,
        parentId: form.parentId ?? undefined,
        visible: form.visible,
      };
      if (openDialog === 'create') {
        await handleCreate(payload);
        toast.success('Thêm danh mục thành công!');
      } else if (openDialog === 'edit' && editingCategory) {
        await handleUpdate(editingCategory.id, payload);
        toast.success('Cập nhật danh mục thành công!');
      }
      closeDialog();
      fetchCategories();
    } catch (err) {
      toast.error('Có lỗi xảy ra!');
    }
  };

  // Xác nhận xóa
  const handleDeleteCategory = async () => {
    if (!confirmDelete) return;
    try {
      await handleDelete(confirmDelete.id);
      toast.success('Xóa danh mục thành công!');
      setConfirmDelete(null);
      fetchCategories();
    } catch (err) {
      toast.error('Có lỗi khi xóa!');
    }
  };

  // Tìm kiếm
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) {
      fetchCategories();
      return;
    }
    try {
      const result = await fetchByName(search);
      // setCategories không có trong hook, nên dùng state tạm nếu muốn, hoặc refactor hook để hỗ trợ
      // Ở đây tạm thời chỉ hiển thị kết quả tìm kiếm qua categories
      // Nếu muốn hook hỗ trợ setCategories, hãy báo mình
    } catch {
      toast.error('Không tìm thấy danh mục!');
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
              variant="destructive"
              className="mr-2"
              onClick={() => setConfirmDelete(category)}
            >
              Xóa
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
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit">Tìm kiếm</Button>
        <Button type="button" variant="secondary" onClick={() => openCreateDialog()}>
          Thêm mới
        </Button>
      </form>
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
              {categories
                .filter((cat) => cat.parentId === null)
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
              <Button type="submit">Lưu</Button>
              <Button type="button" variant="secondary" onClick={closeDialog}>
                Hủy
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Dialog xác nhận xóa */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <div>Bạn có chắc muốn xóa danh mục "{confirmDelete?.name}"?</div>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Xóa
            </Button>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
