// ProductManagement.tsx
'use client';

import { CreateProductDialog } from '@/components/dialog-common/add/create-product-dialog';
import { EditProductDialog } from '@/components/dialog-common/view-update/edit-product-dialog';
import { ProductDetailsDialog } from '@/components/dialog-common/view-update/view-detail-product';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CreateProductDto, productApi, TProduct } from '@/service/product.api';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  ChevronDown,
  DollarSign,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Search,
  Star,
  Tags,
  Trash,
  TrendingUp,
  X,
  XCircle,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface FilterState {
  search: string;
  status: string;
  verified: string;
  category: string;
  brand: string;
  priceRange: string;
}

export default function ProductManagement() {
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [productList, setProductList] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    verified: '',
    category: '',
    brand: '',
    priceRange: '',
  });

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const brands = [...new Set(productList.map((p) => p.brand))];
    const categories = [...new Set(productList.flatMap((p) => p.categories.map((c) => c.name)))];

    return {
      brands,
      categories,
      priceRanges: [
        { label: 'Dưới 100,000đ', value: '0-100000' },
        { label: '100,000đ - 500,000đ', value: '100000-500000' },
        { label: '500,000đ - 1,000,000đ', value: '500000-1000000' },
        { label: '1,000,000đ - 5,000,000đ', value: '1000000-5000000' },
        { label: 'Trên 5,000,000đ', value: '5000000-999999999' },
      ],
    };
  }, [productList]);

  // Statistics
  const stats = useMemo(() => {
    const totalProducts = productList.length;
    const activeProducts = productList.filter((p) => p.status === 'ACTIVE').length;
    const verifiedProducts = productList.filter((p) => p.verified).length;
    const totalValue = productList.reduce((sum, p) => sum + p.currentPrice * p.quantity, 0);

    return {
      totalProducts,
      activeProducts,
      verifiedProducts,
      totalValue,
    };
  }, [productList]);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      // Search filter
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Status filter
      if (filters.status && product.status !== filters.status) {
        return false;
      }

      // Verified filter
      if (filters.verified) {
        const isVerified = filters.verified === 'true';
        if (product.verified !== isVerified) {
          return false;
        }
      }

      // Category filter
      if (filters.category && !product.categories.some((c) => c.name === filters.category)) {
        return false;
      }

      // Brand filter
      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (product.currentPrice < min || product.currentPrice > max) {
          return false;
        }
      }

      return true;
    });
  }, [productList, filters]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter((value) => value !== '').length;
  }, [filters]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productList = await productApi.getProducts();
        setProductList(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Lỗi khi tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const productList = await productApi.getProducts();
      setProductList(productList);
      toast.success('Đã làm mới danh sách sản phẩm');
    } catch (error) {
      console.error('Error refreshing products:', error);
      toast.error('Lỗi khi làm mới danh sách sản phẩm');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateProduct = () => {
    setIsCreateOpen(false);
  };

  const handleUpdateProduct = (updatedData: Partial<CreateProductDto>) => {
    if (!selectedProduct) return;

    const updatedProducts = productList.map((product) =>
      product.id === selectedProduct.id
        ? {
          ...product,
          ...updatedData,
          updatedAt: new Date().toISOString(),
        }
        : product,
    );
    setProductList(updatedProducts);
    setSelectedProduct(null);
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
      // Add your delete API call here
      // await productApi.deleteProduct(product.id);

      const updatedProducts = productList.filter((p) => p.id !== product.id);
      setProductList(updatedProducts);
      toast.success('Đã xoá sản phẩm thành công');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Lỗi khi xoá sản phẩm');
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      verified: '',
      category: '',
      brand: '',
      priceRange: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoạt động
          </Badge>
        );
      case 'INACTIVE':
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Ngưng hoạt động
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600">
            <AlertCircle className="w-3 h-3 mr-1" />
            Không xác định
          </Badge>
        );
    }
  };

  const getVerifiedBadge = (verified: boolean) => {
    return verified ? (
      <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
        <Star className="w-3 h-3 mr-1" />
        Đã xác minh
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
        <AlertCircle className="w-3 h-3 mr-1" />
        Chưa xác minh
      </Badge>
    );
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
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
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
                    value={filters.status}
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
                    value={filters.verified}
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
                    value={filters.category}
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
                    value={filters.brand}
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
                    value={filters.priceRange}
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
        {loading ? (
          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                  <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
                </div>
                <p className="text-slate-500 font-medium">Đang tải sản phẩm...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredProducts.length > 0 ? (
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200 bg-slate-50/50">
                      <TableHead className="w-20 font-semibold text-slate-700">Hình ảnh</TableHead>
                      <TableHead className="min-w-40 font-semibold text-slate-700">
                        Tên sản phẩm
                      </TableHead>
                      <TableHead className="w-32 font-semibold text-slate-700">Giá</TableHead>
                      <TableHead className="w-32 font-semibold text-slate-700">
                        Thương hiệu
                      </TableHead>
                      <TableHead className="w-20 font-semibold text-slate-700">Số lượng</TableHead>
                      <TableHead className="min-w-40 font-semibold text-slate-700">
                        Danh mục
                      </TableHead>
                      <TableHead className="w-36 font-semibold text-slate-700">
                        Trạng thái
                      </TableHead>
                      <TableHead className="w-36 font-semibold text-slate-700">Xác minh</TableHead>
                      <TableHead className="w-24 font-semibold text-slate-700">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product, index) => (
                      <TableRow
                        key={product.id}
                        className="hover:bg-slate-50/50 transition-colors border-slate-100"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell>
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm">
                            <Image
                              src={product.thumbnail || '/placeholder.svg'}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform hover:scale-110"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors">
                            {product.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                            {product.currentPrice.toLocaleString('vi-VN')}đ
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-700 font-medium">{product.brand}</span>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg text-center">
                            {product.quantity}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {product.categories.slice(0, 2).map((category) => (
                              <Badge
                                key={category.id}
                                className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-indigo-100"
                              >
                                <Tags className="w-3 h-3 mr-1" />
                                {category.name}
                              </Badge>
                            ))}
                            {product.categories.length > 2 && (
                              <Badge className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                                +{product.categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell>{getVerifiedBadge(product.verified)}</TableCell>
                        <TableCell>
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
                              <DropdownMenuLabel className="text-slate-700">
                                Thao tác
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handDetailsProduct(product)}
                                className="hover:bg-blue-50 hover:text-blue-700"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditProduct(product)}
                                className="hover:bg-amber-50 hover:text-amber-700"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteProduct(product)}
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center max-w-md">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto">
                    <Package className="w-10 h-10 text-slate-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Search className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-slate-500 mb-6">
                  {productList.length === 0
                    ? 'Chưa có sản phẩm nào. Hãy tạo sản phẩm đầu tiên của bạn!'
                    : 'Không có sản phẩm nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm khác.'}
                </p>
                {productList.length === 0 ? (
                  <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    Tạo sản phẩm mới
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="flex items-center gap-2 border-slate-200 hover:bg-slate-50"
                  >
                    <X className="w-4 h-4" />
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <CreateProductDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSuccess={() => {
            // Refresh product list after creation
            const fetchProducts = async () => {
              try {
                const productList = await productApi.getProducts();
                setProductList(productList);
              } catch (error) {
                console.error('Error fetching products:', error);
              }
            };
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
