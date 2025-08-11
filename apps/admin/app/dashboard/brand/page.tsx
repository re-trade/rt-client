'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import useBrandManager from '@/hooks/use-brand-manager';
import { AlertCircle, Building2, Eye, ImageIcon, Package, Plus, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AdvancedFilters = ({
  searchQuery,
  onSearch,
}: {
  searchQuery: string;
  onSearch: (query: string) => void;
}) => {
  const [filterType, setFilterType] = useState('');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleClearFilters = () => {
    setFilterType('');
    setLocalSearchQuery('');
    onSearch('');
  };

  const handleSearch = () => {
    onSearch(localSearchQuery);
  };

  return <Card></Card>;
};

const BrandDetailModal = ({
  brand,
  isOpen,
  onClose,
}: {
  brand: any | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!brand) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Chi tiết nhãn hàng
          </DialogTitle>
          <DialogDescription>Thông tin đầy đủ về nhãn hàng này</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-center">
            {brand.imgUrl ? (
              <div className="relative w-80 h-60">
                {' '}
                <img
                  src={brand.imgUrl || '/placeholder.svg?height=96&width=96'}
                  alt={`${brand.name} logo`}
                  className="max-w-full max-h-full rounded-lg object-contain border-4 border-primary/20 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <ImageIcon className="h-4 w-4" />
                </div>
              </div>
            ) : (
              <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center border-4 border-primary/20">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Mã nhãn hàng</Label>
                <p className="text-lg font-mono bg-muted px-3 py-2 rounded-md">{brand.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Tên nhãn hàng</Label>
                <p className="text-xl font-semibold">{brand.name}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FormField = ({
  label,
  required = false,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </Label>
    {children}
    {error && (
      <p className="text-sm text-destructive flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {error}
      </p>
    )}
  </div>
);

export default function BrandManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandImgUrl, setNewBrandImgUrl] = useState('');
  const [newBrandDescription, setNewBrandDescription] = useState('');
  const [newSelectedCategoryIds, setNewSelectedCategoryIds] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    brands,
    page,
    maxPage,
    totalBrands,
    loading,
    error,
    refetch,
    goToPage,
    fetchBrands,
    fetchCategories,
    categories,
    categoriesLoading,
    categoriesError,
    addBrand,
  } = useBrandManager();

  useEffect(() => {
    if (isAddModalOpen) {
      fetchCategories();
    }
  }, [isAddModalOpen, fetchCategories]);

  const resetNewBrandForm = () => {
    setNewBrandName('');
    setNewBrandImgUrl('');
    setNewBrandDescription('');
    setNewSelectedCategoryIds([]);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newBrandName.trim()) {
      newErrors.name = 'Tên nhãn hàng là bắt buộc';
    } else if (newBrandName.trim().length < 2) {
      newErrors.name = 'Tên nhãn hàng phải có ít nhất 2 ký tự';
    }

    if (!newBrandImgUrl.trim()) {
      newErrors.imgUrl = 'URL logo là bắt buộc';
    } else if (!isValidUrl(newBrandImgUrl)) {
      newErrors.imgUrl = 'Vui lòng nhập URL hợp lệ';
    }

    if (!newBrandDescription.trim()) {
      newErrors.description = 'Mô tả nhãn hàng là bắt buộc';
    } else if (newBrandDescription.trim().length < 10) {
      newErrors.description = 'Mô tả phải có ít nhất 10 ký tự';
    }

    if (newSelectedCategoryIds.length === 0) {
      newErrors.categories = 'Vui lòng chọn ít nhất một danh mục';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchBrands(query, 1);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > maxPage) return;
    setCurrentPage(newPage);
    goToPage(newPage, searchQuery);
  };

  const handleView = (brand: any) => {
    setSelectedBrand(brand);
    setIsDetailModalOpen(true);
  };

  const handleAddBrand = async () => {
    if (!validateForm()) {
      toast.error('Vui lòng sửa các lỗi trong biểu mẫu trước khi gửi');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addBrand({
        name: newBrandName.trim(),
        imgUrl: newBrandImgUrl.trim(),
        description: newBrandDescription.trim(),
        categoryIds: newSelectedCategoryIds,
      });

      if (result.success) {
        toast.success('Thêm nhãn hàng thành công!');
        setIsAddModalOpen(false);
        resetNewBrandForm();
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Đã xảy ra lỗi khi thêm nhãn hàng');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Quản lý nhãn hàng</h1>
          <p className="text-muted-foreground mt-2">Quản lý danh mục nhãn hàng của bạn một cách dễ dàng</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} size="lg" className="shadow-lg">
          <Plus className="h-5 w-5 mr-2" />
          Thêm nhãn hàng mới
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-medium">Đã xảy ra lỗi</p>
                <p className="text-sm">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {categoriesError && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-medium">Lỗi danh mục</p>
                <p className="text-sm">{categoriesError}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <AdvancedFilters searchQuery={searchQuery} onSearch={handleSearch} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Danh sách nhãn hàng
          </CardTitle>
          <CardDescription>
            {totalBrands > 0
              ? `Hiển thị ${brands.length} trong tổng số ${totalBrands} nhãn hàng`
              : 'Không tìm thấy nhãn hàng'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Đang tải nhãn hàng...</p>
              </div>
            </div>
          ) : brands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="bg-muted rounded-full p-6">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Không tìm thấy nhãn hàng</h3>
                <p className="text-muted-foreground">
                  Thử điều chỉnh tìm kiếm hoặc thêm nhãn hàng mới để bắt đầu
                </p>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm nhãn hàng đầu tiên
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-80">Logo</TableHead>
                    <TableHead>Tên nhãn hàng</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead className="text-center">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brands.map((brand) => (
                    <TableRow key={brand.id} className="hover:bg-muted/50">
                      <TableCell className="w-40 h-24">
                        {' '}
                        {brand.imgUrl ? (
                          <img
                            src={brand.imgUrl}
                            alt={`${brand.name} logo`}
                            className="max-w-full max-h-full rounded-lg object-contain border shadow-sm"
                            style={{ maxWidth: '160px', maxHeight: '96px' }} 
                          />
                        ) : (
                          <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center border">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{brand.name}</p>
                          <p className="text-sm text-muted-foreground">Nhãn hàng</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">{brand.id}</code>
                      </TableCell>

                      <TableCell className="flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(brand)}
                          className="p-0"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {maxPage > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Trang {page} trên {maxPage} • Tổng {totalBrands} nhãn hàng
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      Trước
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, maxPage) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === maxPage}
                    >
                      Tiếp
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <BrandDetailModal
        brand={selectedBrand}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedBrand(null);
        }}
      />

      <Dialog
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) resetNewBrandForm();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Thêm nhãn hàng mới
            </DialogTitle>
            <DialogDescription>
              Điền thông tin bên dưới để tạo nhãn hàng mới
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Tên nhãn hàng" required error={errors.name}>
                <Input
                  value={newBrandName}
                  onChange={(e) => {
                    setNewBrandName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="Nhập tên nhãn hàng"
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="URL Logo" required error={errors.imgUrl}>
                <Input
                  value={newBrandImgUrl}
                  onChange={(e) => {
                    setNewBrandImgUrl(e.target.value);
                    if (errors.imgUrl) setErrors((prev) => ({ ...prev, imgUrl: '' }));
                  }}
                  placeholder="https://example.com/logo.png"
                  disabled={isSubmitting}
                />
              </FormField>
            </div>

            <FormField label="Mô tả nhãn hàng" required error={errors.description}>
              <Textarea
                value={newBrandDescription}
                onChange={(e) => {
                  setNewBrandDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                placeholder="Mô tả về nhãn hàng, giá trị và điểm đặc biệt..."
                rows={4}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label="Danh mục" required error={errors.categories}>
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-8 border rounded-md">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Đang tải danh mục...</span>
                </div>
              ) : categoriesError ? (
                <div className="text-destructive text-sm bg-destructive/5 p-3 rounded-md">
                  Lỗi khi tải danh mục: {categoriesError}
                </div>
              ) : (
                <MultiSelect
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                  selected={newSelectedCategoryIds}
                  onChange={(selected) => {
                    setNewSelectedCategoryIds(selected);
                    if (errors.categories) setErrors((prev) => ({ ...prev, categories: '' }));
                  }}
                  placeholder="Chọn danh mục cho nhãn hàng..."
                />
              )}
            </FormField>

            {newBrandImgUrl && isValidUrl(newBrandImgUrl) && (
              <div className="space-y-2">
                <Label>Xem trước logo</Label>
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
                  <img
                    src={newBrandImgUrl || '/placeholder.svg?height=48&width=48'}
                    alt="Xem trước logo"
                    className="h-12 w-12 rounded-lg object-cover border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div>
                    <p className="font-medium">{newBrandName || 'Tên nhãn hàng'}</p>
                    <p className="text-sm text-muted-foreground">Xem trước logo</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button onClick={handleAddBrand} disabled={isSubmitting} className="min-w-24">
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm nhãn hàng
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
