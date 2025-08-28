'use client';

import RetradeProductFilter from '@/components/retrade-products/RetradeProductFilter';
import RetradeProductTable from '@/components/retrade-products/RetradeProductTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useRetradeProduct from '@/hooks/use-retrade-product';
import { TProduct } from '@/service/product.api';
import { DollarSign, Package, RefreshCw, Repeat, Star, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MyProductPage() {
  const router = useRouter();
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
    productMetric,
    sort,
    handleSortChange,
  } = useRetradeProduct();

  const handleProductDetail = (productId: string) => {
    router.push(`/dashboard/my-product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-orange-500 border-b-2 border-orange-400 pb-2 inline-block">
              Sản phẩm Retrade
            </h1>
            <p className="text-slate-600 flex items-center gap-2">
              <Repeat className="w-4 h-4" />
              Quản lý sản phẩm đã qua sử dụng của bạn ({productList.length}/{totalItems})
            </p>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 border-orange-200 hover:bg-orange-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng sản phẩm retrade</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {productMetric.productQuantity}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Package className="h-6 w-6 text-orange-600" />
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

        <RetradeProductFilter
          filter={filter}
          setFilter={setFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filterOptions={filterOptions}
          activeFiltersCount={activeFiltersCount}
          clearFilters={clearFilters}
          totalProductsCount={productList.length}
        />
        <RetradeProductTable
          products={productList}
          loading={loading}
          refreshing={refreshing}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          sort={sort}
          handleSortChange={handleSortChange}
          onRowClick={handleProductDetail}
        />
      </div>
    </div>
  );
}
