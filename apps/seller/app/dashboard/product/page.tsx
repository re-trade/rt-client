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
import { productApi } from '@/service/product.api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
export default function ProductManagement() {
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<TProduct | null>(null);



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
    sort,
    handleSortChange,
  } = useProduct();

  const handleUpdateProduct = (updatedData: Partial<CreateProductDto>) => {
    if (!selectedProduct) return;
    setSelectedProduct(null);
    fetchProducts();
  };

  const handleUpdateProductStatus = async () => {
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

  const handleDeleteProduct = (product: TProduct) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      toast.loading('Đang xóa sản phẩm...');

      // Gọi API delete product
      await productApi.deleteProduct(productToDelete.id);

      toast.success('Đã xóa sản phẩm thành công');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Lỗi khi xóa sản phẩm');
    } finally {
      toast.dismiss();
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-orange-500 border-b-2 border-orange-400 pb-2 inline-block">
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
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Tạo sản phẩm mới
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border shadow bg-white">
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

          <Card className="border shadow bg-white">
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

          <Card className="border shadow bg-white">
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

          <Card className="border shadow bg-white">
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
          totalProductsCount={productList.length}
        />

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
          sort={sort}
          handleSortChange={handleSortChange}
        />

        <CreateProductDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSuccess={() => {
            fetchProducts();
          }}
        />
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.name}"?
                <br />
                <span className="text-red-600 font-medium">
                  Hành động này không thể hoàn tác.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteProduct}
                className="bg-red-600 hover:bg-red-700"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
