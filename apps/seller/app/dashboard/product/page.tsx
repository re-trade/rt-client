'use client';

import { CreateProductDialog } from '@/components/dialog-common/add/create-product-dialog';
import { EditProductDialog } from '@/components/dialog-common/view-update/edit-product-dialog';
import { ProductDetailsDialog } from '@/components/dialog-common/view-update/view-detail-product';
import ProductTable from '@/components/product/ProductTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import useProduct from '@/hooks/use-product';
import { CreateProductDto, TProduct } from '@/service/product.api';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import {
  BarChart3,
  ChevronDown,
  DollarSign,
  Filter,
  Package,
  Plus,
  RefreshCw,
  Search,
  Star,
  TrendingUp,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProductManagement() {
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    productList,
    filteredProducts,
    filterOptions,
    filter,
    setFilter,
    activeFiltersCount,
    stats,
    loading,
    showFilters,
    setShowFilters,
    refreshing,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    handlePageChange,
    handlePageSizeChange,
    handleRefresh,
    clearFilters,
    fetchProducts,
  } = useProduct();

  const handleUpdateProduct = (updatedData: Partial<CreateProductDto>) => {
    if (!selectedProduct) return;
    setSelectedProduct(null);
    fetchProducts();
  };

  const handleEditProduct = (product: TProduct) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };
  const handDetailsProduct = (product: TProduct) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleDeleteProduct = async (product: TProduct) => {
    try {
      const updatedProducts = productList.filter((p) => p.id !== product.id);
      toast.success('Đã xoá sản phẩm thành công');
      fetchProducts();
    } catch (error) {
      toast.error('Lỗi khi xoá sản phẩm');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Quản lý sản phẩm
            </h1>
            <p className="text-slate-600 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Quản lý tất cả sản phẩm của bạn ({filteredProducts.length}/{productList.length})
            </p>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 border-slate-200 hover:bg-slate-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border-slate-200 hover:bg-slate-50 relative"
            >
              <Filter className="w-4 h-4" />
              Bộ lọc
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Tạo sản phẩm mới
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng sản phẩm</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalProducts}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-emerald-50 to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.activeProducts}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Đã xác minh</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.verifiedProducts}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng giá trị</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.totalValue.toLocaleString('vi-VN')}đ
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm sản phẩm theo tên..."
                  className="w-full flex-1 pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  value={filter.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-medium">{filteredProducts.length} sản phẩm</span>
                </div>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 px-2 text-slate-500 hover:text-slate-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          {showFilters && (
            <CardContent className="pt-0">
              <Separator className="mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Trạng thái</Label>
                  <Select
                    value={filter.status}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger className="border-slate-200 focus:border-blue-500">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                      <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Xác minh</Label>
                  <Select
                    value={filter.verified}
                    onValueChange={(value) => handleFilterChange('verified', value)}
                  >
                    <SelectTrigger className="border-slate-200 focus:border-blue-500">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      <SelectItem value="true">Đã xác minh</SelectItem>
                      <SelectItem value="false">Chưa xác minh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Danh mục</Label>
                  <Select
                    value={filter.category}
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger className="border-slate-200 focus:border-blue-500">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      {filterOptions.categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Thương hiệu</Label>
                  <Select
                    value={filter.brand}
                    onValueChange={(value) => handleFilterChange('brand', value)}
                  >
                    <SelectTrigger className="border-slate-200 focus:border-blue-500">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      {filterOptions.brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Khoảng giá</Label>
                  <Select
                    value={filter.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                  >
                    <SelectTrigger className="border-slate-200 focus:border-blue-500">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      {filterOptions.priceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Products Table */}
        <ProductTable
          products={filteredProducts}
          loading={loading}
          handDetailsProduct={handDetailsProduct}
          handleDeleteProduct={handleDeleteProduct}
          handleEditProduct={handleEditProduct}
          clearFilters={clearFilters}
          setIsCreateOpen={setIsCreateOpen}
          refreshing={refreshing}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          totalItems={totalItems}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
        />

        {/* Dialogs */}
        <CreateProductDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSuccess={() => {
            fetchProducts();
          }}
        />

        <EditProductDialog
          open={isEditOpen}
          isEdit={true}
          onOpenChange={setIsEditOpen}
          product={selectedProduct}
          onUpdateProduct={handleUpdateProduct}
        />
        <ProductDetailsDialog
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          product={selectedProduct}
        />
      </div>
    </div>
  );
}
