'use client';

import { Label } from '@/components/ui/label';
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Package,
  RefreshCw,
  Search,
  Store,
  Tag,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TFilterSelected, useProductManager } from '@/hooks/use-product-manager';
import type { TProduct } from '@/services/product.api';
import { toast } from 'sonner';

const ProductStats = ({ products }: { products: TProduct[] }) => {
  const totalProducts = products.length;
  const verifiedProducts = products.filter((p) => p.verified).length;
  const pendingProducts = products.filter((p) => !p.verified).length;

  const AdvancedFilterspendingProducts = products.filter((p) => !p.verified).length;
  const totalValue = products.reduce((sum, p) => sum + p.currentPrice * p.quantity, 0);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 mb-1">{totalProducts}</div>
          <div className="text-sm text-gray-600">Tổng sản phẩm</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 mb-1">{verifiedProducts}</div>
          <div className="text-sm text-gray-600">Đã xác minh</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertCircle className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 mb-1">{pendingProducts}</div>
          <div className="text-sm text-gray-600">Chờ duyệt</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {totalValue.toLocaleString('vi-VN')} ₫
          </div>
          <div className="text-sm text-gray-600">Tổng giá trị</div>
        </div>
      </div>
    </div>
  );
};

const AdvancedFilters = ({
  keyword,
  onSearch,
  selectedFilter,
  handleSelectedFilterChange,
  filter,
  handleFilterReset,
}: {
  keyword: string;
  onSearch: (query: string) => void;
  selectedFilter: TFilterSelected | undefined;
  handleSelectedFilterChange: (
    key: keyof TFilterSelected,
    value: string | string[] | number | number[],
  ) => void;
  filter: any;
  handleFilterReset: () => void;
}) => {
  const [searchInput, setSearchInput] = useState(keyword);

  const handleSearchSubmit = () => {
    onSearch(searchInput);
  };

  const safeSelectedFilter: TFilterSelected = selectedFilter || {
    states: [],
    categories: [],
    seller: '',
    brands: [],
    minPrice: 0,
    maxPrice: 0,
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        <div className="flex-1">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
            Tìm kiếm sản phẩm
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search"
              type="text"
              placeholder="Nhập tên sản phẩm, thương hiệu..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Select
            value={safeSelectedFilter.states[0] || 'all'}
            onValueChange={(value) =>
              handleSelectedFilterChange('states', value === 'all' ? [] : [value])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {filter.states?.map((state: string) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={safeSelectedFilter.categories[0] || 'all'}
            onValueChange={(value) =>
              handleSelectedFilterChange('categories', value === 'all' ? [] : [value])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {filter.categoriesAdvanceSearch?.map((category: any) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={safeSelectedFilter.brands[0] || 'all'}
            onValueChange={(value) =>
              handleSelectedFilterChange('brands', value === 'all' ? [] : [value])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Thương hiệu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thương hiệu</SelectItem>
              {filter.brands?.map((brand: any) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleFilterReset} variant="outline">
          Đặt lại
        </Button>
      </div>
    </Card>
  );
};

const ProductDetailModal = ({
  product,
  isOpen,
  onClose,
  onVerify,
  onReject,
}: {
  product: TProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (id: string) => void;
  onReject?: (id: string) => void;
}) => {
  if (!product) return null;

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'NEW':
        return 'Mới';
      case 'LIKE_NEW':
        return 'Như mới';
      case 'USED_GOOD':
        return 'Đã sử dụng - Tốt';
      case 'DAMAGED':
        return 'Bị hư hỏng';
      default:
        return condition;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg border border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Package className="h-5 w-5 text-blue-600" />
            Chi tiết sản phẩm
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Hình ảnh sản phẩm */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
              <img
                src={product.thumbnail || '/placeholder.svg'}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            {product.productImages && product.productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.productImages.slice(0, 4).map((image: string, index: number) => (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded border border-gray-200"
                  >
                    <img
                      src={image || '/placeholder.svg'}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
              <p className="text-gray-600">{product.shortDescription}</p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-700">Giá:</span>
                <span className="text-lg font-bold text-green-600">
                  {product.currentPrice.toLocaleString('vi-VN')} ₫
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-gray-700">Số lượng:</span>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.quantity > 10
                      ? 'bg-green-100 text-green-700'
                      : product.quantity > 0
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.quantity}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-gray-700">Người bán:</span>
                <span className="text-gray-600">{product.sellerShopName}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Thương hiệu:</span>
                <div className="px-2 py-1 border border-gray-300 rounded text-xs">
                  {product.brand}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Model:</span>
                <span className="text-gray-600">{product.model}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Tình trạng:</span>
                <div className="px-2 py-1 border border-gray-300 rounded text-xs">
                  {getConditionText(product.condition)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Xác minh:</span>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${product.verified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                >
                  {product.verified ? 'Đã xác minh' : 'Chờ duyệt'}
                </div>
              </div>

              {product.warrantyExpiryDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Bảo hành đến:</span>
                  <span className="text-gray-600">
                    {new Date(product.warrantyExpiryDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-700">Ngày tạo:</span>
                <span className="text-gray-600">
                  {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Danh mục */}
            <div>
              <h4 className="font-medium mb-2 text-gray-700">Danh mục:</h4>
              <div className="flex flex-wrap gap-1">
                {product.categories.map((cat) => (
                  <div key={cat.id} className="px-2 py-1 border border-gray-300 rounded text-xs">
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Tags:</h4>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag: string, index: number) => (
                    <div
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium mb-2 text-gray-700">Mô tả chi tiết:</h4>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{product.description}</p>
        </div>

        {/* Nút duyệt/không duyệt */}
        {!product.verified && (
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white bg-transparent"
              onClick={() => onVerify && onVerify(product.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Duyệt
            </Button>
            <Button
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white bg-transparent"
              onClick={() => onReject && onReject(product.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Không duyệt
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ProductActions = ({
  product,
  onView,
  onVerify,
  onUnverify,
}: {
  product: TProduct;
  onView: (product: TProduct) => void;
  onVerify: (id: string) => void;
  onUnverify: (id: string) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => onView(product)}>
        <Eye className="h-4 w-4 mr-1" />
        Xem
      </Button>

      {!product.verified ? (
        <Button
          variant="outline"
          size="sm"
          className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white bg-transparent"
          onClick={() => onVerify(product.id)}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Duyệt
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white bg-transparent"
          onClick={() => onUnverify(product.id)}
        >
          <XCircle className="h-4 w-4 mr-1" />
          Cấm
        </Button>
      )}
    </div>
  );
};

export default function ProductManagementPage() {
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const {
    products,
    page,
    maxPage,
    totalProducts,
    loading,
    error,
    filter,
    keyword,
    selectedFilter,
    refetch,
    searchProducts,
    goToPage,
    verifyProduct,
    unverifyProduct,
    handleSelectedFilterChange,
    handleFilterReset,
  } = useProductManager();

  const handleVerify = async (productId: string) => {
    try {
      const result = await verifyProduct(productId);
      if (result.success) {
        toast.success('Xác minh sản phẩm thành công!');
      } else {
        toast.error(result.message || 'Lỗi xác minh sản phẩm');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Lỗi xác minh sản phẩm';
      toast.error(errorMessage);
    }
  };

  const handleReject = async (productId: string) => {
    try {
      const result = await unverifyProduct(productId);
      if (result.success) {
        toast.success('Hủy xác minh sản phẩm thành công!');
      } else {
        toast.error(result.message || 'Lỗi hủy xác minh sản phẩm');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Lỗi hủy xác minh sản phẩm';
      toast.error(errorMessage);
    }
  };

  const handleGoToPage = (newPage: number, searchQuery?: string) => {
    goToPage(newPage, searchQuery);
  };
  const handleView = (product: TProduct) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const statusColors: Record<string, string> = {
    true: 'bg-green-100 text-green-800',
    false: 'bg-orange-100 text-orange-800',
  };

  const statusLabels: Record<string, string> = {
    true: 'Đã xác minh',
    false: 'Chờ duyệt',
  };
  const handleExport = () => {
    console.log('Export products');
    toast.info('Tính năng xuất dữ liệu đang được phát triển');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p className="text-gray-600 mt-1">Quản lý và xác minh sản phẩm trong hệ thống</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={refetch} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Xuất dữ liệu
            </Button>
          </div>
        </div>

        {/* Stats */}
        <ProductStats products={products} />

        {/* Filters */}
        <AdvancedFilters
          keyword={keyword}
          onSearch={searchProducts}
          selectedFilter={selectedFilter}
          handleSelectedFilterChange={handleSelectedFilterChange}
          filter={filter}
          handleFilterReset={handleFilterReset}
        />

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Danh sách sản phẩm ({totalProducts})</span>
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Tên sản phẩm</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Danh mục</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Giá</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Trạng thái</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Người bán</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.thumbnail || '/placeholder.svg?height=40&width=40'}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">ID: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {product.categories.slice(0, 2).map((cat) => (
                            <Badge key={cat.id} variant="secondary">
                              {cat.name}
                            </Badge>
                          ))}
                          {product.categories.length > 2 && (
                            <Badge variant="secondary">+{product.categories.length - 2}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {product.currentPrice?.toLocaleString('vi-VN')} ₫
                        </div>
                        <div className="text-sm text-gray-500">SL: {product.quantity}</div>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium whitespace-nowrap ${statusColors[String(product.verified)]}`}
                        >
                          {statusLabels[String(product.verified)]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">{product.sellerShopName}</div>
                        <div className="text-xs text-gray-500">{product.sellerId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <ProductActions
                          product={product}
                          onView={handleView}
                          onVerify={handleVerify}
                          onUnverify={handleReject}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">Không tìm thấy sản phẩm nào</div>
              )}
            </div>

            {/* Pagination */}
            {maxPage > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Trang {page} / {maxPage} - Tổng {totalProducts} sản phẩm
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= maxPage}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Detail Modal */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onVerify={handleVerify}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}
