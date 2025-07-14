'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  ArrowUpDown,
  BarChart3,
  Calendar,
  CheckCircle,
  Download,
  Edit,
  Eye,
  Filter,
  Package,
  RefreshCw,
  Search,
  Store,
  Tag,
  Trash2,
  User,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

// Thống kê sản phẩm
const ProductStats = ({ products }: { products: any[] }) => {
  const totalProducts = products.length;
  const verifiedProducts = products.filter((p) => p.verified).length;
  const pendingProducts = products.filter((p) => !p.verified).length;
  const totalValue = products.reduce((sum, p) => sum + p.currentPrice * p.quantity, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng sản phẩm</p>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
          <Package className="h-8 w-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã xác minh</p>
            <p className="text-2xl font-bold text-green-600">{verifiedProducts}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Chờ duyệt</p>
            <p className="text-2xl font-bold text-orange-600">{pendingProducts}</p>
          </div>
          <AlertCircle className="h-8 w-8 text-orange-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng giá trị</p>
            <p className="text-2xl font-bold text-purple-600">
              {totalValue.toLocaleString('vi-VN')} ₫
            </p>
          </div>
          <BarChart3 className="h-8 w-8 text-purple-500" />
        </div>
      </Card>
    </div>
  );
};

// Filter nâng cao
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
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4" />
        <h3 className="font-medium">Bộ lọc nâng cao</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="verified">Đã xác minh</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
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

        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
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
    </Card>
  );
};

// Modal xem chi tiết sản phẩm
const ProductDetailModal = ({
  product,
  isOpen,
  onClose,
}: {
  product: any;
  isOpen: boolean;
  onClose: () => void;
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
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Chi tiết sản phẩm
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về sản phẩm {product.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Hình ảnh sản phẩm */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={product.thumbnail}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            {product.productImages && product.productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.productImages.slice(0, 4).map((image: string, index: number) => (
                  <div key={index} className="aspect-square overflow-hidden rounded border">
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

          {/* Thông tin sản phẩm */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{product.name}</h3>
              <p className="text-muted-foreground">{product.shortDescription}</p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Giá:</span>
                <span className="text-lg font-bold text-green-600">
                  {product.currentPrice.toLocaleString('vi-VN')} ₫
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Số lượng:</span>
                <Badge
                  variant={
                    product.quantity > 10
                      ? 'default'
                      : product.quantity > 0
                        ? 'secondary'
                        : 'destructive'
                  }
                >
                  {product.quantity}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Người bán:</span>
                <span>{product.sellerShopName}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Seller ID:</span>
                <span className="text-sm text-muted-foreground">{product.sellerId}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Thương hiệu:</span>
                <Badge variant="outline">{product.brand}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Model:</span>
                <span>{product.model}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Tình trạng:</span>
                <Badge variant="outline">{getConditionText(product.condition)}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Trạng thái:</span>
                <Badge variant="outline">{getStatusText(product.status)}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Xác minh:</span>
                <Badge
                  variant={product.verified ? 'default' : 'secondary'}
                  className={
                    product.verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }
                >
                  {product.verified ? 'Đã xác minh' : 'Chờ duyệt'}
                </Badge>
              </div>

              {product.warrantyExpiryDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Bảo hành đến:</span>
                  <span>
                    {new Date(
                      product.warrantyExpiryDate[0],
                      product.warrantyExpiryDate[1] - 1,
                      product.warrantyExpiryDate[2],
                    ).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Ngày tạo:</span>
                <span>{new Date(product.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            {/* Danh mục */}
            <div>
              <h4 className="font-medium mb-2">Danh mục:</h4>
              <div className="flex flex-wrap gap-1">
                {product.categories.map((cat: any) => (
                  <Badge key={cat.id} variant="outline" className="text-xs">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Mô tả chi tiết:</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{product.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Actions cho sản phẩm
const ProductActions = ({ product, onVerify, onReject, onView, onEdit, onDelete }: any) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={() => onView(product)}>
        <Eye className="h-4 w-4" />
      </Button>

      {!product.verified && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onVerify(product.id)}
            className="text-green-600 hover:text-green-700"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onReject(product.id)}
            className="text-red-600 hover:text-red-700"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}

      <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
        <Edit className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="icon" onClick={() => onDelete(product.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
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
    products,
    page,
    maxPage,
    totalProducts,
    loading,
    error,
    refetch,
    goToPage,
    searchProducts,
    deleteProduct,
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
    // TODO: Implement verify product API
    console.log('Verify product:', productId);
    // Sau khi verify thành công, refresh lại danh sách
    refetch();
  };

  const handleReject = async (productId: string) => {
    // TODO: Implement reject product API
    console.log('Reject product:', productId);
    refetch();
  };

  const handleView = (product: any) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (product: any) => {
    // TODO: Open edit product modal
    console.log('Edit product:', product);
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        setDeleteError(null); // Clear previous errors
        setDeleteSuccess(null); // Clear previous success
        const result = await deleteProduct(productId);
        if (result.success) {
          // Show success message
          setDeleteSuccess(result.message);
          // Auto hide success message after 3 seconds
          setTimeout(() => {
            setDeleteSuccess(null);
          }, 3000);
        } else {
          // Show error message in UI
          setDeleteError(result.message);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setDeleteError('Có lỗi xảy ra khi xóa sản phẩm');
      }
    }
  };

  const handleExport = () => {
    // TODO: Export products to CSV/Excel
    console.log('Export products');
  };

  // Filter products based on local filters (status, category, price)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý và duyệt sản phẩm từ người bán</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
          <Button onClick={handleRefresh} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Success Display */}
      {deleteSuccess && (
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <div className="flex-1">
              <span className="font-medium">Thành công:</span> {deleteSuccess}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDeleteSuccess(null);
              }}
              className="text-green-600 hover:text-green-700"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Error Display */}
      {(error || deleteError) && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <div className="flex-1">
              <span className="font-medium">Lỗi:</span> {error || deleteError}
              {(error || deleteError)?.includes('đăng nhập') && (
                <div className="mt-2 text-sm">
                  <p>Vui lòng đảm bảo bạn đã đăng nhập với tài khoản admin và có quyền thực hiện thao tác này.</p>
                  <p className="mt-1 text-xs text-red-600">
                    <strong>Lưu ý:</strong> Hệ thống sẽ tự động chuyển về trang đăng nhập sau 3 giây.
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDeleteError(null);
              }}
              className="text-red-600 hover:text-red-700"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </Card>
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
      <Card className="p-6">
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Đang tải sản phẩm...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mb-4" />
              <p>Không tìm thấy sản phẩm</p>
              <p className="text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1"
                    >
                      Sản phẩm
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('price')}
                      className="flex items-center gap-1"
                    >
                      Giá
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('stock')}
                      className="flex items-center gap-1"
                    >
                      Tồn kho
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Người bán</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-1"
                    >
                      Ngày tạo
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {product.thumbnail && (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.shortDescription}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {product.brand} • {product.model}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {product.currentPrice.toLocaleString('vi-VN')} ₫
                      </div>
                      {product.quantity > 0 ? (
                        <div className="text-sm text-green-600">Còn hàng</div>
                      ) : (
                        <div className="text-sm text-red-600">Hết hàng</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.quantity > 10
                            ? 'default'
                            : product.quantity > 0
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {product.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{product.sellerShopName}</div>
                      <div className="text-xs text-muted-foreground">
                        ID: {product.sellerId.slice(0, 8)}...
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.categories.slice(0, 2).map((cat: any) => (
                          <Badge key={cat.id} variant="outline" className="text-xs">
                            {cat.name}
                          </Badge>
                        ))}
                        {product.categories.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.verified ? 'default' : 'secondary'}
                        className={
                          product.verified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }
                      >
                        {product.verified ? 'Đã xác minh' : 'Chờ duyệt'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(product.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="text-right">
                      <ProductActions
                        product={product}
                        onVerify={handleVerify}
                        onReject={handleReject}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {!loading && products.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {products.length} sản phẩm trên trang {page} / {maxPage} (Tổng cộng{' '}
              {totalProducts} sản phẩm)
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
              <span className="text-sm text-muted-foreground">
                Trang {page} / {maxPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === maxPage}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
