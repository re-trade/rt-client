'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProductManager } from '@/hooks/use-product-manager';
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Download,
  Eye,
  Filter,
  Package,
  RefreshCw,
  Search,
  Store,
  Tag,
  XCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useState } from 'react';

const ProductStats = ({ products }: { products: any[] }) => {
  const totalProducts = products.length;
  const verifiedProducts = products.filter((p) => p.verified).length;
  const pendingProducts = products.filter((p) => !p.verified).length;
  const totalValue = products.reduce((sum, p) => sum + p.currentPrice * p.quantity, 0);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="stat bg-base-100 shadow-lg rounded-xl border border-base-300">
        <div className="stat-figure text-primary">
          <div className="avatar placeholder bg-primary bg-opacity-10 p-3 rounded-full">
            <Package className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="stat-title text-base-content/70">Tổng sản phẩm</div>
        <div className="stat-value text-primary">{totalProducts}</div>
        <div className="stat-desc flex items-center gap-1">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-success">+12% so với tháng trước</span>
        </div>
      </div>

      <div className="stat bg-base-100 shadow-lg rounded-xl border border-base-300">
        <div className="stat-figure text-success">
          <div className="avatar placeholder bg-success bg-opacity-10 p-3 rounded-full">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
        </div>
        <div className="stat-title text-base-content/70">Đã xác minh</div>
        <div className="stat-value text-success">{verifiedProducts}</div>
        <div className="stat-desc flex items-center gap-1">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-success">+8% so với tháng trước</span>
        </div>
      </div>

      <div className="stat bg-base-100 shadow-lg rounded-xl border border-base-300">
        <div className="stat-figure text-warning">
          <div className="avatar placeholder bg-warning bg-opacity-10 p-3 rounded-full">
            <AlertCircle className="h-6 w-6 text-warning" />
          </div>
        </div>
        <div className="stat-title text-base-content/70">Chờ duyệt</div>
        <div className="stat-value text-warning">{pendingProducts}</div>
        <div className="stat-desc flex items-center gap-1">
          <TrendingDown className="h-4 w-4 text-error" />
          <span className="text-error">-5% so với tháng trước</span>
        </div>
      </div>

      <div className="stat bg-base-100 shadow-lg rounded-xl border border-base-300">
        <div className="stat-figure text-secondary">
          <div className="avatar placeholder bg-secondary bg-opacity-10 p-3 rounded-full">
            <BarChart3 className="h-6 w-6 text-secondary" />
          </div>
        </div>
        <div className="stat-title text-base-content/70">Tổng giá trị</div>
        <div className="stat-value text-secondary">
          {totalValue.toLocaleString('vi-VN')} ₫
        </div>
        <div className="stat-desc flex items-center gap-1">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-success">+15% so với tháng trước</span>
        </div>
      </div>
    </div>
  );
};

const AdvancedFilters = ({
  searchQuery,
  onSearch,
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
}: any) => {
  return (
    <div className="card bg-base-100 shadow-lg border border-base-300">
      <div className="card-body">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-lg">Bộ lọc nâng cao</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="form-control">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-base-content/50" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="input input-bordered pl-10"
              />
            </div>
          </div>

          <div className="form-control">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="select select-bordered">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="verified">Đã xác minh</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="form-control">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="select select-bordered">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="electronics">Điện tử</SelectItem>
                <SelectItem value="clothing">Thời trang</SelectItem>
                <SelectItem value="books">Sách</SelectItem>
                <SelectItem value="home">Nhà cửa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="form-control">
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="select select-bordered">
                <SelectValue placeholder="Khoảng giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả giá</SelectItem>
                <SelectItem value="0-100000">Dưới 100.000 ₫</SelectItem>
                <SelectItem value="100000-500000">100.000 ₫ - 500.000 ₫</SelectItem>
                <SelectItem value="500000-1000000">500.000 ₫ - 1.000.000 ₫</SelectItem>
                <SelectItem value="1000000+">Trên 1.000.000 ₫</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailModal = ({
  product,
  isOpen,
  onClose,
  onVerify,
  onReject,
}: {
  product: any;
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Hoạt động';
      case 'DRAFT':
        return 'Bản nháp';
      case 'INACTIVE':
        return 'Không hoạt động';
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Package className="h-5 w-5 text-primary" />
            Chi tiết sản phẩm
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về sản phẩm {product.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Hình ảnh sản phẩm */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-base-300">
              <img
                src={product.thumbnail}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            {product.productImages && product.productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.productImages.slice(0, 4).map((image: string, index: number) => (
                  <div key={index} className="aspect-square overflow-hidden rounded border border-base-300">
                    <img
                      src={image}
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
              <h3 className="text-xl font-bold text-base-content">{product.name}</h3>
              <p className="text-base-content/70">{product.shortDescription}</p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="font-medium">Giá:</span>
                <span className="text-lg font-bold text-success">
                  {product.currentPrice.toLocaleString('vi-VN')} ₫
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-secondary" />
                <span className="font-medium">Số lượng:</span>
                <div className={`badge ${
                  product.quantity > 10 ? 'badge-success' : 
                  product.quantity > 0 ? 'badge-warning' : 'badge-error'
                }`}>
                  {product.quantity}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-accent" />
                <span className="font-medium">Người bán:</span>
                <span className="text-base-content/80">{product.sellerShopName}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Thương hiệu:</span>
                <div className="badge badge-outline">{product.brand}</div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Model:</span>
                <span className="text-base-content/80">{product.model}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Tình trạng:</span>
                <div className="badge badge-outline">{getConditionText(product.condition)}</div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Trạng thái:</span>
                <div className="badge badge-outline">{getStatusText(product.status)}</div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Xác minh:</span>
                <div className={`badge ${product.verified ? 'badge-success' : 'badge-warning'}`}>
                  {product.verified ? 'Đã xác minh' : 'Chờ duyệt'}
                </div>
              </div>

              {product.warrantyExpiryDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-info" />
                  <span className="font-medium">Bảo hành đến:</span>
                  <span className="text-base-content/80">
                    {new Date(
                      product.warrantyExpiryDate[0],
                      product.warrantyExpiryDate[1] - 1,
                      product.warrantyExpiryDate[2],
                    ).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-info" />
                <span className="font-medium">Ngày tạo:</span>
                <span className="text-base-content/80">{new Date(product.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            {/* Danh mục */}
            <div>
              <h4 className="font-medium mb-2">Danh mục:</h4>
              <div className="flex flex-wrap gap-1">
                {product.categories.map((cat: any) => (
                  <div key={cat.id} className="badge badge-outline badge-sm">
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag: string, index: number) => (
                    <div key={index} className="badge badge-secondary badge-sm">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div className="border-t border-base-300 pt-4">
          <h4 className="font-medium mb-2">Mô tả chi tiết:</h4>
          <p className="text-sm text-base-content/70 whitespace-pre-wrap">{product.description}</p>
        </div>

        {/* Nút duyệt/không duyệt */}
        {!product.verified && (
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="btn btn-success btn-outline"
              onClick={() => onVerify && onVerify(product.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Duyệt
            </button>
            <button
              className="btn btn-error btn-outline"
              onClick={() => onReject && onReject(product.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Không duyệt
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ProductActions = ({ product, onView }: any) => {
  return (
    <div className="flex items-center gap-2">
      <button className="btn btn-primary btn-sm btn-outline" onClick={() => onView(product)}>
        <Eye className="h-4 w-4" />
        Xem
      </button>
    </div>
  );
};

export default function ProductManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const {
    products = [],
    page,
    maxPage,
    totalProducts,
    loading,
    error,
    refetch,
    goToPage,
    searchProducts,
    verifyProduct,
    unverifyProduct,
  } = useProductManager();

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchProducts(query);
  };

  const handlePageChange = (newPage: number) => {
    goToPage(newPage, searchQuery);
  };

  const handleVerify = async (productId: string) => {
    const result = await verifyProduct(productId);
    if (result.success) {
      setDeleteSuccess('Xác minh sản phẩm thành công!');
    } else {
      setDeleteError(result.message || 'Lỗi xác minh sản phẩm');
    }
  };

  const handleReject = async (productId: string) => {
    const result = await unverifyProduct(productId);
    if (result.success) {
      setDeleteSuccess('Hủy xác minh sản phẩm thành công!');
    } else {
      setDeleteError(result.message || 'Lỗi hủy xác minh sản phẩm');
    }
  };

  const handleView = (product: any) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    console.log('Export products');
  };

  const filteredProducts = products.filter((product) => {
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'verified' && product.verified) ||
      (selectedStatus === 'pending' && !product.verified);

    const matchesCategory =
      selectedCategory === 'all' ||
      product.categories.some((cat: any) =>
        cat.name.toLowerCase().includes(selectedCategory.toLowerCase()),
      );

    const matchesPrice =
      priceRange === 'all' ||
      (() => {
        const price = product.currentPrice;
        switch (priceRange) {
          case '0-100000':
            return price < 100000;
          case '100000-500000':
            return price >= 100000 && price < 500000;
          case '500000-1000000':
            return price >= 500000 && price < 1000000;
          case '1000000+':
            return price >= 1000000;
          default:
            return true;
        }
      })();

    return matchesStatus && matchesCategory && matchesPrice;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg p-8">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold">Quản lý sản phẩm</h1>
            <p className="py-6">Quản lý và duyệt sản phẩm từ người bán</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button className="btn btn-outline btn-secondary" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Xuất dữ liệu
        </button>
        <button className="btn btn-outline btn-primary" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Success Display */}
      {deleteSuccess && (
        <div className="alert alert-success shadow-lg">
          <CheckCircle className="h-6 w-6" />
          <div>
            <h3 className="font-bold">Thành công!</h3>
            <div className="text-xs">{deleteSuccess}</div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setDeleteSuccess(null)}
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Error Display */}
      {(error || deleteError) && (
        <div className="alert alert-error shadow-lg">
          <AlertCircle className="h-6 w-6" />
          <div>
            <h3 className="font-bold">Lỗi!</h3>
            <div className="text-xs">{error || deleteError}</div>
            {(error || deleteError)?.includes('đăng nhập') && (
              <div className="mt-2 text-sm">
                <p>
                  Vui lòng đảm bảo bạn đã đăng nhập với tài khoản admin và có quyền thực hiện thao
                  tác này.
                </p>
                <p className="mt-1 text-xs">
                  <strong>Lưu ý:</strong> Hệ thống sẽ tự động chuyển về trang đăng nhập sau 3
                  giây.
                </p>
              </div>
            )}
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setDeleteError(null)}
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Statistics */}
      <ProductStats products={products} />

      {/* Advanced Filters */}
      <AdvancedFilters
        searchQuery={searchQuery}
        onSearch={handleSearch}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      {/* Products Table */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body">
          {loading ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="min-w-[180px] max-w-[220px] truncate">Sản phẩm</th>
                    <th className="min-w-[120px] max-w-[140px] text-right">Giá</th>
                    <th className="min-w-[80px] max-w-[100px] text-center">Tồn kho</th>
                    <th className="min-w-[120px] max-w-[160px]">Người bán</th>
                    <th className="min-w-[120px] max-w-[160px]">Danh mục</th>
                    <th className="min-w-[100px] max-w-[120px] text-center">Trạng thái</th>
                    <th className="min-w-[120px] max-w-[140px] text-center">Ngày tạo</th>
                    <th className="text-center min-w-[120px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(6)].map((_, i) => (
                    <tr key={i}>
                      <td className="min-w-[180px] max-w-[220px] truncate">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-10 h-10 rounded" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-24 mb-1" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </td>
                      <td className="min-w-[120px] max-w-[140px] text-right">
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </td>
                      <td className="min-w-[80px] max-w-[100px] text-center">
                        <Skeleton className="h-4 w-10 mx-auto" />
                      </td>
                      <td className="min-w-[120px] max-w-[160px]">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="min-w-[120px] max-w-[160px]">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="min-w-[100px] max-w-[120px] text-center">
                        <Skeleton className="h-4 w-16 mx-auto" />
                      </td>
                      <td className="min-w-[120px] max-w-[140px] text-center">
                        <Skeleton className="h-4 w-20 mx-auto" />
                      </td>
                      <td className="text-center min-w-[120px]">
                        <Skeleton className="h-8 w-24 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-base-content/50">
              <Package className="h-16 w-16 mb-4" />
              <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
              <p className="text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="min-w-[180px] max-w-[220px] truncate">Sản phẩm</th>
                    <th className="min-w-[120px] max-w-[140px] text-right">Giá</th>
                    <th className="min-w-[80px] max-w-[100px] text-center">Tồn kho</th>
                    <th className="min-w-[120px] max-w-[160px]">Người bán</th>
                    <th className="min-w-[120px] max-w-[160px]">Danh mục</th>
                    <th className="min-w-[100px] max-w-[120px] text-center">Trạng thái</th>
                    <th className="min-w-[120px] max-w-[140px] text-center">Ngày tạo</th>
                    <th className="text-center min-w-[120px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-base-200 transition-colors">
                      <td className="min-w-[180px] max-w-[220px] truncate">
                        <div className="flex items-center gap-3">
                          {product.thumbnail && (
                            <img
                              src={product.thumbnail}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium truncate max-w-[140px] text-base-content">
                              {product.name}
                            </div>
                            <div className="text-sm text-base-content/70 truncate max-w-[140px]">
                              {product.shortDescription}
                            </div>
                            <div className="text-xs text-base-content/50 truncate max-w-[140px]">
                              {product.brand} • {product.model}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="min-w-[120px] max-w-[140px] text-right">
                        <div className="font-medium text-base-content">
                          {product.currentPrice.toLocaleString('vi-VN')} ₫
                        </div>
                        {product.quantity > 0 ? (
                          <div className="text-sm text-success">Còn hàng</div>
                        ) : (
                          <div className="text-sm text-error">Hết hàng</div>
                        )}
                      </td>
                      <td className="min-w-[80px] max-w-[100px] text-center">
                        <div className={`badge ${
                          product.quantity > 10 ? 'badge-success' : 
                          product.quantity > 0 ? 'badge-warning' : 'badge-error'
                        }`}>
                          {product.quantity}
                        </div>
                      </td>
                      <td className="min-w-[120px] max-w-[160px]">
                        <div className="text-sm font-medium truncate max-w-[120px] text-base-content/80">
                          {product.sellerShopName}
                        </div>
                      </td>
                      <td className="min-w-[120px] max-w-[160px]">
                        <div className="flex flex-wrap gap-1">
                          {product.categories.slice(0, 2).map((cat: any) => (
                            <div key={cat.id} className="badge badge-outline badge-xs">
                              {cat.name}
                            </div>
                          ))}
                          {product.categories.length > 2 && (
                            <div className="badge badge-outline badge-xs">
                              +{product.categories.length - 2}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="min-w-[100px] max-w-[120px] text-center">
                        <div className={`badge ${product.verified ? 'badge-success' : 'badge-warning'}`}>
                          {product.verified ? 'Đã xác minh' : 'Chờ duyệt'}
                        </div>
                      </td>
                      <td className="min-w-[120px] max-w-[140px] text-center text-sm text-base-content/70">
                        {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="text-center min-w-[120px]">
                        <ProductActions product={product} onView={handleView} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-base-content/70">
                Hiển thị {products.length} sản phẩm trên trang {page} / {maxPage} (Tổng cộng{' '}
                {totalProducts} sản phẩm)
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Trước
                </button>
                <span className="text-sm text-base-content/70">
                  Trang {page} / {maxPage}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === maxPage}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProduct(null);
        }}
        onVerify={async (id: string) => {
          const result = await verifyProduct(id);
          if (result.success) setDeleteSuccess('Xác minh sản phẩm thành công!');
          else setDeleteError(result.message || 'Lỗi xác minh sản phẩm');
          setIsDetailModalOpen(false);
          setSelectedProduct(null);
          refetch();
        }}
        onReject={async (id: string) => {
          const result = await unverifyProduct(id);
          if (result.success) setDeleteSuccess('Hủy xác minh sản phẩm thành công!');
          else setDeleteError(result.message || 'Lỗi hủy xác minh sản phẩm');
          setIsDetailModalOpen(false);
          setSelectedProduct(null);
          refetch();
        }}
      />
    </div>
  );
}
