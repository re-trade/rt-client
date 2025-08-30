'use client';

import MetricCard from '@/components/dashboard/MetricCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  AlertCircle,
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  FolderTree,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Tag,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const normalizeCategory = (cat: any): Category => ({
  ...cat,
  description: typeof cat.description === 'string' ? cat.description : '',
  parentId: cat.parentId ?? null,
  parentName: cat.parentName ?? null,
  children: Array.isArray(cat.children) ? cat.children.map(normalizeCategory) : [],
});

const buildCategoryTree = (categories: Category[]): Category[] => {
  const categoryMap = new Map<string, Category>();
  const rootCategories: Category[] = [];

  // First pass: create a map of all categories
  categories.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // Second pass: build the tree structure
  categories.forEach((cat) => {
    const category = categoryMap.get(cat.id)!;

    if (cat.parentId && categoryMap.has(cat.parentId)) {
      // This is a child category, add it to its parent's children array
      const parent = categoryMap.get(cat.parentId)!;
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(category);
    } else {
      // This is a root category
      rootCategories.push(category);
    }
  });

  return rootCategories;
};

export default function CategoryPage() {
  const {
    categories: rawCategories,
    loading,
    error,
    fetchCategories,
    handleCreate,
    handleUpdate,
    handleToggleVisible,
  } = useCategoryManager();

  // Build tree structure from flat category list
  const categories = buildCategoryTree(rawCategories);

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

    // Validate required fields
    if (!form.name.trim()) {
      toast.error('Tên danh mục không được để trống!', { position: 'top-right' });
      setIsSubmitting(false);
      return;
    }

    if (!form.description?.trim()) {
      toast.error('Mô tả danh mục không được để trống!', { position: 'top-right' });
      setIsSubmitting(false);
      return;
    }

    try {
      if (openDialog === 'create') {
        const payload = {
          name: form.name.trim(),
          description: form.description.trim(),
          categoryParentId: form.categoryParentId ?? null,
          visible: form.visible,
        };
        await handleCreate(payload);
        toast.success('Thêm danh mục thành công!', { position: 'top-right' });
      } else if (openDialog === 'edit' && editingCategory) {
        const payload: any = {
          name: form.name.trim(),
          description: form.description.trim(),
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
        <TableRow
          className={`hover:bg-gray-50 transition-colors duration-150 ${
            level > 0 ? 'border-l-4 border-orange-200 bg-orange-50/30' : ''
          }`}
        >
          <TableCell className="py-4" style={{ paddingLeft: `${level * 32 + 24}px` }}>
            <div className="flex items-center gap-3">
              <button
                className={`p-1 rounded hover:bg-orange-100 transition-colors ${
                  hasChildren ? 'text-orange-600' : 'text-gray-400 cursor-default'
                }`}
                onClick={hasChildren ? () => setExpanded((e) => !e) : undefined}
                disabled={!hasChildren}
              >
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${
                    expanded ? 'rotate-90' : ''
                  }`}
                />
              </button>
              <span
                className={`font-medium ${
                  level === 0
                    ? 'text-lg text-gray-800 font-bold'
                    : 'text-sm text-orange-700 font-semibold'
                }`}
              >
                {category.name}
              </span>
            </div>
          </TableCell>
          <TableCell className="py-4">
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
          </TableCell>
          <TableCell className="py-4">
            {category.visible ? (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <Eye className="h-3 w-3" />
                Hiện
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                <EyeOff className="h-3 w-3" />
                Ẩn
              </div>
            )}
          </TableCell>
          <TableCell className="py-4">
            <div className="flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title="Thao tác"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => handleToggleVisible(normalizeCategory(category))}
                    className="cursor-pointer"
                  >
                    {category.visible ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Ẩn danh mục
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Hiện danh mục
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openEditDialog(category)}
                    className="cursor-pointer"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => openCreateDialog(category.id)}
                    className="cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm danh mục con
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

  const totalCategories = rawCategories.length;
  const visibleCategories = rawCategories.filter((cat) => cat.visible).length;
  const hiddenCategories = totalCategories - visibleCategories;
  const parentCategories = rawCategories.filter((cat) => !cat.parentId).length;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi các danh mục sản phẩm trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => fetchCategories()}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button
            onClick={() => openCreateDialog()}
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm danh mục
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Tổng danh mục"
          value={totalCategories}
          change="+0% so với tháng trước"
          icon={Tag}
          color="from-blue-500 to-blue-600"
          trend="neutral"
        />
        <MetricCard
          title="Danh mục hiển thị"
          value={visibleCategories}
          change="+0% so với tháng trước"
          icon={Eye}
          color="from-green-500 to-green-600"
          trend="neutral"
        />
        <MetricCard
          title="Danh mục ẩn"
          value={hiddenCategories}
          change="+0% so với tháng trước"
          icon={EyeOff}
          color="from-red-500 to-red-600"
          trend="neutral"
        />
        <MetricCard
          title="Danh mục cha"
          value={parentCategories}
          change="+0% so với tháng trước"
          icon={FolderTree}
          color="from-purple-500 to-purple-600"
          trend="neutral"
        />
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Có lỗi xảy ra</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchCategories()}
                className="border-red-200 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <FolderTree className="h-5 w-5 text-orange-600" />
                Danh sách danh mục
              </CardTitle>
              <CardDescription className="text-gray-600">
                {totalCategories > 0
                  ? `Quản lý và theo dõi ${totalCategories} danh mục trong hệ thống`
                  : 'Không tìm thấy danh mục nào'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-3">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-600" />
                <p className="text-gray-600">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <FolderTree className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có danh mục nào</h3>
              <p className="text-gray-600 mb-4">Bắt đầu bằng cách thêm danh mục đầu tiên của bạn</p>
              <Button
                onClick={() => openCreateDialog()}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm danh mục đầu tiên
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 py-4 w-2/5">
                      Tên danh mục
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Mô tả</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 text-center">
                      Thao tác
                    </TableHead>
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
            </div>
          )}
        </CardContent>
      </Card>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả <span className="text-red-500">*</span>
              </Label>
              <Input
                name="description"
                value={form.description || ''}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Nhập mô tả cho danh mục..."
                required
              />
            </div>
            {openDialog === 'create' && (
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Danh mục cha</Label>
                <select
                  name="categoryParentId"
                  value={form.categoryParentId || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Không có danh mục cha (Tạo danh mục gốc)</option>
                  {rawCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.parentId ? `└─ ${cat.name}` : cat.name}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="true">Hiện</option>
                <option value="false">Ẩn</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={isSubmitting}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
