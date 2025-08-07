'use client';

import { CreateProductDialog } from '@/components/dialog-common/add/create-product-dialog';
import { EditProductDialog } from '@/components/dialog-common/view-update/edit-product-dialog';
import { ProductDetailsDialog } from '@/components/dialog-common/view-update/view-detail-product';
import ProductFilter from '@/components/product/ProductFilter';
import ProductTable from '@/components/product/ProductTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useProduct from '@/hooks/use-product';
import { CreateProductDto, TProduct } from '@/service/product.api';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import { DollarSign, Package, Plus, RefreshCw, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProductManagement() {
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    productList,
    filterOptions,
    filter,
    setFilter,
    activeFiltersCount,
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
    productMetric,
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
              Quản lý tất cả sản phẩm của bạn ({productList.length}/{totalItems})
            </p>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 border-slate-200 hover:bg-slate-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Làm mới
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng sản phẩm</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {productMetric.productQuantity}
                  </p>
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
                  <p className="text-2xl font-bold text-slate-900">
                    {productMetric.productActivate}
                  </p>
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
                  <p className="text-2xl font-bold text-slate-900">
                    {productMetric.productApprove}
                  </p>
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
                    {productMetric.totalPrice.toLocaleString('vi-VN')}đ
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <ProductFilter
          filter={filter}
          setFilter={setFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filterOptions={filterOptions}
          activeFiltersCount={activeFiltersCount}
          clearFilters={clearFilters}
          filteredProductsCount={productList.length}
          totalProductsCount={productList.length}
        />

        {/* Products Table */}
        <ProductTable
          products={productList}
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
