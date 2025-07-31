'use client';

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
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

const ProductStats = ({ products }: { products: any[] }) => {
  const totalProducts = products.length;
  const verifiedProducts = products.filter((p) => p.verified).length;
  const pendingProducts = products.filter((p) => !p.verified).length;
  const totalValue = products.reduce((sum, p) => sum + p.currentPrice * p.quantity, 0);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-green-600">+12% so với tháng trước</span>
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
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-green-600">+8% so với tháng trước</span>
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
          <div className="flex items-center gap-1 text-sm">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span className="text-red-600">-5% so với tháng trước</span>
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
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-green-600">+15% so với tháng trước</span>
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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-blue-600" />
        <h3 className="font-medium text-lg text-gray-800">Bộ lọc nâng cao</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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

        <div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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

        <div>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg border border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Package className="h-5 w-5 text-blue-600" />
            Chi tiết sản phẩm
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Thông tin chi tiết về sản phẩm {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Hình ảnh sản phẩm */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
              <img
                src={product.thumbnail}
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
                  ${product.brand}
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
                <span className="font-medium text-gray-700">Trạng thái:</span>
                <div className="px-2 py-1 border border-gray-300 rounded text-xs">
                  {getStatusText(product.status)}
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
                    {new Date(
                      product.warrantyExpiryDate[0],
                      product.warrantyExpiryDate[1] - 1,
                      product.warrantyExpiryDate[2],
                    ).toLocaleDateString('vi-VN')}
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
                {product.categories.map((cat: any) => (
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
            <button
              className="px-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-colors"
              onClick={() => onVerify && onVerify(product.id)}
            >
              <CheckCircle className="h-4 w-4 inline mr-2" />
              Duyệt
            </button>
            <button
              className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
              onClick={() => onReject && onReject(product.id)}
            >
              <XCircle className="h-4 w-4 inline mr-2" />
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
      <button
        className="px-3 py-1 text-sm border border-blue-500 text-blue-600 rounded hover:bg-blue-500 hover:text-white transition-colors"
        onClick={() => onView(product)}
      >
        <Eye className="h-4 w-4 inline mr-1" />
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-blue-500 text-white rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Quản lý sản phẩm</h1>
        <p className="text-lg opacity-90">Quản lý và duyệt sản phẩm từ người bán</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Xuất dữ liệu
        </button>
        <button
          className="px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Success Display */}
      {deleteSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Thành công!</h3>
              <p className="text-sm text-green-600">{deleteSuccess}</p>
            </div>
            <button
              className="ml-auto p-1 hover:bg-green-100 rounded transition-colors"
              onClick={() => setDeleteSuccess(null)}
            >
              <XCircle className="h-4 w-4 text-green-600" />
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {(error || deleteError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800">Lỗi!</h3>
              <p className="text-sm text-red-600">{error || deleteError}</p>
              {(error || deleteError)?.includes('đăng nhập') && (
                <div className="mt-2 text-sm">
                  <p className="text-red-600">
                    Vui lòng đảm bảo bạn đã đăng nhập với tài khoản admin và có quyền thực hiện thao
                    tác này.
                  </p>
                  <p className="mt-1 text-xs text-red-500">
                    <strong>Lưu ý:</strong> Hệ thống sẽ tự động chuyển về trang đăng nhập sau 3
                    giây.
                  </p>
                </div>
              )}
            </div>
            <button
              className="ml-auto p-1 hover:bg-red-100 rounded transition-colors"
              onClick={() => setDeleteError(null)}
            >
              <XCircle className="h-4 w-4 text-red-600" />
            </button>
          </div>
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
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-6 py-3 text-gray-700 font-semibold min-w-[180px] max-w-[220px]">
                      Sản phẩm
                    </th>
                    <th className="text-right px-6 py-3 text-gray-700 font-semibold min-w-[120px] max-w-[140px]">
                      Giá
                    </th>
                    <th className="text-center px-6 py-3 text-gray-700 font-semibold min-w-[80px] max-w-[100px]">
                      Tồn kho
                    </th>
                    <th className="text-left px-6 py-3 text-gray-700 font-semibold min-w-[120px] max-w-[160px]">
                      Người bán
                    </th>
                    <th className="text-left px-6 py-3 text-gray-700 font-semibold min-w-[120px] max-w-[160px]">
                      Danh mục
                    </th>
                    <th className="text-center px-6 py-3 text-gray-700 font-semibold min-w-[100px] max-w-[120px]">
                      Trạng thái
                    </th>
                    <th className="text-center px-6 py-3 text-gray-700 font-semibold min-w-[120px] max-w-[140px]">
                      Ngày tạo
                    </th>
                    <th className="text-center px-6 py-3 text-gray-700 font-semibold min-w-[120px]">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(6)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-6 py-4 min-w-[180px] max-w-[220px]">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right min-w-[120px] max-w-[140px]">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 text-center min-w-[80px] max-w-[100px]">
                        <div className="h-4 bg-gray-200 rounded w-10 mx-auto animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 min-w-[120px] max-w-[160px]">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 min-w-[120px] max-w-[160px]">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 text-center min-w-[100px] max-w-[120px]">
                        <div className="h-4 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 text-center min-w-[120px] max-w-[140px]">
                        <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 text-center min-w-[120px]">
                        <div className="h-8 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Package className="h-16 w-16 mb-4" />
              <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
              <p className="text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-6 py-3 text-gray-700 font-semibold min-w-[180px] max-w-[220px]">
                      Sản phẩm
                    </th>
                    <th className="text-right px-6 py-3 text-gray-700 font-semibold min-w-[120px] max-w-[140px]">
                      Giá
                    </th>
                    <th className="text-center px-6 py-3 text-gray-700 font-semibold min-w-[80px] max-w-[100px]">
                      Tồn kho
                    </th>
                    <th className="text-left px-6 py-3 text-gray-700 font-semibold min-w-[120px] max-w-[160px]">
                      Người bán
                    </th>
                    <th className="text-left px-6 py-3 text-gray-700 font-semibold min-w-[120px] max-w-[160px]">
                      Danh mục
                    </th>
                    <th className="text-center px-6 py-3 text-gray-700 font-semibold min-w-[100px] max-w-[120px]">
                      Trạng thái
                    </th>
                    <th className="text-center px-6 py-3 text-gray-700 font-semibold min-w-[120px] max-w-[140px]">
                      Ngày tạo
                    </th>
                    <th className="text-center px-6 py-3 text-gray-700 font-semibold min-w-[120px]">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 min-w-[180px] max-w-[220px]">
                        <div className="flex items-center gap-3">
                          {product.thumbnail && (
                            <img
                              src={product.thumbnail}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium truncate max-w-[140px] text-gray-800">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-600 truncate max-w-[140px]">
                              {product.shortDescription}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-[140px]">
                              {product.brand} • {product.model}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right min-w-[120px] max-w-[140px]">
                        <div className="font-medium text-gray-800">
                          {product.currentPrice.toLocaleString('vi-VN')} ₫
                        </div>
                        {product.quantity > 0 ? (
                          <div className="text-sm text-green-600">Còn hàng</div>
                        ) : (
                          <div className="text-sm text-red-600">Hết hàng</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center min-w-[80px] max-w-[100px]">
                        <div
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            product.quantity > 10
                              ? 'bg-green-100 text-green-700'
                              : product.quantity > 0
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 min-w-[120px] max-w-[160px]">
                        <div className="text-sm font-medium truncate max-w-[120px] text-gray-600">
                          {product.sellerShopName}
                        </div>
                      </td>
                      <td className="px-6 py-4 min-w-[120px] max-w-[160px]">
                        <div className="flex flex-wrap gap-1">
                          {product.categories.slice(0, 2).map((cat: any) => (
                            <div
                              key={cat.id}
                              className="px-2 py-1 border border-gray-300 rounded text-xs"
                            >
                              {cat.name}
                            </div>
                          ))}
                          {product.categories.length > 2 && (
                            <div className="px-2 py-1 border border-gray-300 rounded text-xs">
                              +{product.categories.length - 2}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center min-w-[100px] max-w-[120px]">
                        <div
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            product.verified
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {product.verified ? 'Đã xác minh' : 'Chờ duyệt'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center min-w-[120px] max-w-[140px] text-sm text-gray-600">
                        {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-center min-w-[120px]">
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
              <div className="text-sm text-gray-600">
                Hiển thị {products.length} sản phẩm trên trang {page} / {maxPage} (Tổng cộng{' '}
                {totalProducts} sản phẩm)
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Trước
                </button>
                <span className="text-sm text-gray-600">
                  Trang {page} / {maxPage}
                </span>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
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
