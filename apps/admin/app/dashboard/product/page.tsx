'use client';

import {
  AlertCircle,
  Award,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  Package,
  Pause,
  Play,
  RefreshCw,
  Shield,
  Store,
  Tag,
  Tags,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// Removed unused Input and Select imports
import AdminProductFilter from '@/components/product/AdminProductFilter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProductManager } from '@/hooks/use-product-manager';
import type { TProduct } from '@/services/product.api';
import { toast } from 'sonner';

const ProductStats = ({ products }: { products: TProduct[] }) => {
  const totalProducts = products.length;
  const verifiedProducts = products.filter((p) => p.verified).length;
  const pendingProducts = products.filter((p) => !p.verified).length;
  const totalValue = products.reduce((sum, p) => sum + p.currentPrice * p.quantity, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border shadow bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-slate-900">{totalProducts}</p>
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
              <p className="text-sm font-medium text-slate-600">Đã xác minh</p>
              <p className="text-2xl font-bold text-slate-900">{verifiedProducts}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Chờ duyệt</p>
              <p className="text-2xl font-bold text-slate-900">{pendingProducts}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-600" />
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
                {totalValue.toLocaleString('vi-VN')}₫
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Legacy AdvancedFilters component replaced with AdminProductFilter

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
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto p-0 sm:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw]">
        {/* Header */}
        <DialogHeader className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 bg-orange-500 text-white">
          <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 sm:gap-3">
            <Package className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            Chi tiết sản phẩm
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 lg:space-y-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-6">
              <div className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={product.thumbnail || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>

              {/* Thumbnail Carousel */}
              {product.productImages && product.productImages.length > 0 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto py-2 sm:py-3 scrollbar-thin scrollbar-thumb-slate-300">
                  <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-lg sm:rounded-xl overflow-hidden border-2 sm:border-3 border-orange-500 ring-2 ring-orange-200 shadow-md cursor-pointer hover:scale-105 transition-transform duration-200">
                    <img
                      src={product.thumbnail || '/placeholder.svg'}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {product.productImages.map((image: string, index: number) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-lg sm:rounded-xl overflow-hidden border-2 border-slate-200 hover:border-orange-300 transition-all duration-200 shadow-md cursor-pointer hover:scale-105"
                    >
                      <img
                        src={image || '/placeholder.svg'}
                        alt={`${product.name} ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6 sm:space-y-8">
              {/* Title and Status */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight">
                  {product.name}
                </h1>
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <Badge className="bg-blue-100 text-blue-800 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-bold rounded-lg">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    {getConditionText(product.condition)}
                  </Badge>
                  {product.verified && (
                    <Badge className="bg-green-100 text-green-800 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-bold rounded-lg">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                      Đã xác minh
                    </Badge>
                  )}
                </div>
                <p className="text-slate-600 text-lg sm:text-xl leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* Price and Quantity Card */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-orange-200 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <div className="text-center sm:text-left">
                    <p className="text-sm sm:text-base font-semibold text-orange-700 flex items-center gap-1.5 sm:gap-2 justify-center sm:justify-start mb-2 sm:mb-3">
                      <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                      Giá bán
                    </p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600">
                      {product.currentPrice?.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-sm sm:text-base font-semibold text-orange-700 flex items-center gap-1.5 sm:gap-2 justify-center sm:justify-end mb-2 sm:mb-3">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                      Số lượng
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600">
                      {product.quantity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Details Grid */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Package className="w-7 h-7 text-orange-500" />
                  Thông tin sản phẩm
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 bg-slate-50 rounded-lg sm:rounded-xl">
                    <Store className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-orange-500 flex-shrink-0" />
                    <div>
                      <span className="text-sm sm:text-base font-semibold text-slate-700">
                        Người bán
                      </span>
                      <p className="text-slate-900 font-bold text-base sm:text-lg">
                        {product.sellerShopName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 bg-slate-50 rounded-lg sm:rounded-xl">
                    <Tag className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-orange-500 flex-shrink-0" />
                    <div>
                      <span className="text-sm sm:text-base font-semibold text-slate-700">
                        Thương hiệu
                      </span>
                      <p className="text-slate-900 font-bold text-base sm:text-lg">
                        {product.brand}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 bg-slate-50 rounded-lg sm:rounded-xl">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-orange-500 flex-shrink-0" />
                    <div>
                      <span className="text-sm sm:text-base font-semibold text-slate-700">
                        Model
                      </span>
                      <p className="text-slate-900 font-bold text-base sm:text-lg">
                        {product.model}
                      </p>
                    </div>
                  </div>

                  {product.warrantyExpiryDate && (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 bg-slate-50 rounded-lg sm:rounded-xl">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-orange-500 flex-shrink-0" />
                      <div>
                        <span className="text-sm sm:text-base font-semibold text-slate-700">
                          Bảo hành đến
                        </span>
                        <p className="text-slate-900 font-bold text-base sm:text-lg">
                          {new Date(product.warrantyExpiryDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 bg-slate-50 rounded-lg sm:rounded-xl">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-orange-500 flex-shrink-0" />
                    <div>
                      <span className="text-sm sm:text-base font-semibold text-slate-700">
                        Ngày tạo
                      </span>
                      <p className="text-slate-900 font-bold text-base sm:text-lg">
                        {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories and Tags */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200 shadow-lg space-y-6 sm:space-y-8">
                {/* Categories */}
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
                    <Tags className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
                    Danh mục
                  </h4>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {product.categories.map((cat) => (
                      <Badge
                        key={cat.id}
                        className="text-sm sm:text-base bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-orange-200 hover:from-orange-100 hover:to-amber-100 font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg"
                      >
                        <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
                      <Tag className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {product.tags.map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          className="text-sm sm:text-base bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <Package className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
              Mô tả chi tiết
            </h3>
            <div className="prose prose-slate max-w-none prose-base sm:prose-lg">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {!product.verified && product.status === 'INIT' && (
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-slate-200">
              <Button
                variant="outline"
                size="lg"
                className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white bg-transparent font-bold px-6 py-3 text-base sm:text-lg min-h-[48px] transition-all duration-200"
                onClick={() => onVerify && onVerify(product.id)}
              >
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                Duyệt sản phẩm
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white bg-transparent font-bold px-6 py-3 text-base sm:text-lg min-h-[48px] transition-all duration-200"
                onClick={() => onReject && onReject(product.id)}
              >
                <XCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                Từ chối
              </Button>
            </div>
          )}
        </div>
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-slate-100 border border-transparent hover:border-slate-200"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white/95 backdrop-blur-sm shadow-xl border-slate-200"
      >
        <DropdownMenuLabel className="text-slate-700">Thao tác</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onView(product)}
          className="hover:bg-blue-50 hover:text-blue-700"
        >
          <Eye className="mr-2 h-4 w-4" />
          Xem chi tiết
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {!product.verified && product.status === 'INIT' ? (
          <DropdownMenuItem
            onClick={() => onVerify(product.id)}
            className="hover:bg-green-50 hover:text-green-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Duyệt sản phẩm
          </DropdownMenuItem>
        ) : product.verified ? (
          <DropdownMenuItem
            onClick={() => onUnverify(product.id)}
            className="hover:bg-red-50 hover:text-red-700"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Hủy xác minh
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function ProductManagementPage() {
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
    setSelectedFilter,
    activeFiltersCount,
    refetch,
    searchProducts,
    goToPage,
    verifyProduct,
    unverifyProduct,
    handleFilterReset,
  } = useProductManager();

  const handleVerify = async (productId: string) => {
    try {
      // Find the product to check its status
      const product = products.find((p) => p.id === productId);
      const result = await verifyProduct(productId);
      if (result.success) {
        if (product?.status === 'INIT') {
          toast.success(
            'Duyệt sản phẩm thành công! Sản phẩm đã được xác minh và có thể hoạt động.',
          );
        } else {
          toast.success('Xác minh sản phẩm thành công!');
        }
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
  const handleView = (product: TProduct) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  // Verification status styling (verified field - Admin approval status)
  const verificationColors: Record<string, string> = {
    true: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    false: 'bg-amber-100 text-amber-800 border border-amber-200',
  };

  const verificationLabels: Record<string, string> = {
    true: 'Đã xác minh',
    false: 'Chưa xác minh',
  };

  // Product status styling (status field - Operational status)
  const productStatusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800 border border-green-200',
    INACTIVE: 'bg-slate-100 text-slate-800 border border-slate-200',
    PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    DELETED: 'bg-red-100 text-red-800 border border-red-200',
    INIT: 'bg-blue-100 text-blue-800 border border-blue-200',
    DRAFT: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  };

  const productStatusLabels: Record<string, string> = {
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Không hoạt động',
    PENDING: 'Chờ duyệt',
    DELETED: 'Đã xóa',
    INIT: 'Khởi tạo',
    DRAFT: 'Bản nháp',
  };
  const handleExport = () => {
    console.log('Export products');
    toast.info('Tính năng xuất dữ liệu đang được phát triển');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-orange-500 border-b-2 border-orange-400 pb-2 inline-block">
              Quản lý sản phẩm
            </h1>
            <p className="text-slate-600 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Quản lý và xác minh sản phẩm trong hệ thống ({totalProducts})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={refetch}
              variant="outline"
              size="sm"
              disabled={loading}
              className="flex items-center gap-2 border-slate-200 hover:bg-slate-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-slate-200 hover:bg-slate-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất dữ liệu
            </Button>
          </div>
        </div>

        {/* Stats */}
        <ProductStats products={products} />

        {/* Filters */}
        <AdminProductFilter
          filter={filter}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeFiltersCount={activeFiltersCount}
          clearFilters={handleFilterReset}
          totalProductsCount={totalProducts}
          keyword={keyword}
          onSearch={searchProducts}
          loading={loading}
        />

        {/* Products Table */}
        <Card className="border shadow bg-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-slate-900">Danh sách sản phẩm ({totalProducts})</span>
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
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200 hover:bg-transparent">
                    <TableHead className="font-semibold text-slate-700 w-20">Hình ảnh</TableHead>
                    <TableHead className="font-semibold text-slate-700 min-w-48">
                      Tên sản phẩm
                    </TableHead>
                    <TableHead className="w-32 font-semibold text-slate-700">Giá</TableHead>
                    <TableHead className="min-w-40 font-semibold text-slate-700 hidden sm:table-cell">
                      Danh mục
                    </TableHead>
                    <TableHead className="w-36 font-semibold text-slate-700">
                      <div className="flex items-center gap-1">
                        Trạng thái
                        <div className="text-xs text-slate-500 font-normal hidden xl:block">
                          (Hoạt động)
                        </div>
                      </div>
                    </TableHead>
                    <TableHead className="w-32 font-semibold text-slate-700 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        Xác minh
                        <div className="text-xs text-slate-500 font-normal hidden xl:block">
                          (Admin)
                        </div>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 hidden lg:table-cell">
                      Người bán
                    </TableHead>
                    <TableHead className="w-24 font-semibold text-slate-700">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow
                      key={product.id}
                      className="hover:bg-slate-50/50 transition-colors border-b border-slate-100"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell>
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm">
                          <img
                            src={product.thumbnail || '/placeholder.svg'}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform hover:scale-110"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors">
                          {product.name}
                          {product.status === 'INIT' && !product.verified && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              <Clock className="w-3 h-3 mr-1" />
                              Chờ duyệt
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-500">
                          ID: {product.id.slice(0, 8)}...
                        </div>
                        {/* Mobile-only additional info */}
                        <div className="mt-2 flex flex-wrap gap-1 sm:hidden">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${verificationColors[String(product.verified)]}`}
                          >
                            {product.verified ? (
                              <Shield className="w-3 h-3" />
                            ) : (
                              <AlertCircle className="w-3 h-3" />
                            )}
                            {verificationLabels[String(product.verified)]}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500 lg:hidden">
                          {product.sellerShopName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                          {product.currentPrice?.toLocaleString('vi-VN')}₫
                        </span>
                        <div className="text-sm text-slate-500 mt-1">SL: {product.quantity}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {product.categories.slice(0, 2).map((cat) => (
                            <Badge
                              key={cat.id}
                              className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-indigo-100 font-medium"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {cat.name}
                            </Badge>
                          ))}
                          {product.categories.length > 2 && (
                            <Badge className="text-xs bg-slate-100 text-slate-700 border-slate-200 font-medium">
                              +{product.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${productStatusColors[product.status] || 'bg-gray-100 text-gray-800'}`}
                        >
                          {product.status === 'ACTIVE' && <Play className="w-3 h-3" />}
                          {product.status === 'INACTIVE' && <Pause className="w-3 h-3" />}
                          {product.status === 'PENDING' && <Clock className="w-3 h-3" />}
                          {product.status === 'DELETED' && <Trash2 className="w-3 h-3" />}
                          {product.status === 'INIT' && <Package className="w-3 h-3" />}
                          {product.status === 'DRAFT' && <FileText className="w-3 h-3" />}
                          {productStatusLabels[product.status] || product.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${verificationColors[String(product.verified)]}`}
                        >
                          {product.verified ? (
                            <Shield className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {verificationLabels[String(product.verified)]}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm font-medium text-slate-900">
                          {product.sellerShopName}
                        </div>
                        <div className="text-xs text-slate-500">{product.sellerId}</div>
                      </TableCell>
                      <TableCell>
                        <ProductActions
                          product={product}
                          onView={handleView}
                          onVerify={handleVerify}
                          onUnverify={handleReject}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                      <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-slate-500 font-medium">Đang tải sản phẩm...</p>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                  <div className="bg-slate-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Package className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    Không tìm thấy sản phẩm nào
                  </h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto text-center">
                    Hiện tại chưa có sản phẩm nào trong hệ thống hoặc không có sản phẩm nào phù hợp
                    với bộ lọc hiện tại.
                  </p>
                </div>
              ) : null}
            </div>

            {/* Pagination */}
            {totalProducts > 0 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  Trang {page} / {maxPage} - Tổng {totalProducts} sản phẩm
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    className="border-slate-200 hover:bg-slate-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= maxPage}
                    className="border-slate-200 hover:bg-slate-50"
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
