'use client';

import CreateBrandDialog from '@/components/dialog/CreateBrandDialog';
import ViewUpdateBrandDialog from '@/components/dialog/ViewUpdateBrandDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useBrandManager from '@/hooks/use-brand-manager';
import { TBrand } from '@/services/brand.api';
import {
  AlertCircle,
  Building2,
  Calendar,
  Edit,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

const BrandManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { brands, page, maxPage, totalBrands, loading, error, refetch, goToPage, fetchBrands } =
    useBrandManager();

  const handleSearch = () => {
    setSearchQuery(localSearchQuery);
    fetchBrands(localSearchQuery, 1);
  };

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    setSearchQuery('');
    fetchBrands('', 1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > maxPage) return;
    goToPage(newPage, searchQuery);
  };

  const handleView = (brand: any) => {
    setSelectedBrand(brand);
    setIsDetailModalOpen(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Get brand status badge
  const getStatusBadge = (brand: any) => {
    // Assuming brands have a status field or we determine based on some criteria
    const isActive = true; // Replace with actual logic
    return isActive ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
        Hoạt động
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
        Tạm dừng
      </Badge>
    );
  };
  // const BrandStats = ({ brand }: { brand: TBrand }) => {
  //   const totalSellers = brand.id.length;
  //   const totalStatusTrue = brand.filter((p) => p.status).length;
  //   const totalStatusFalse = brand.filter((p) => !p.status).length;

  //   return (
  //     <div className="grid gap-6 md:grid-cols-3">
  //       <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-sm font-medium text-blue-700 mb-1">Tổng số người bán</p>
  //             <p className="text-3xl font-bold text-blue-900">{totalSellers}</p>
  //             <p className="text-xs text-blue-600 mt-1">Tất cả cửa hàng</p>
  //           </div>
  //           <div className="p-3 bg-blue-500 rounded-full">
  //             <Store className="h-8 w-8 text-white" />
  //           </div>
  //         </div>
  //       </Card>

  //       <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-sm font-medium text-green-700 mb-1">Đã xác minh</p>
  //             <p className="text-3xl font-bold text-green-900">{verifiedSellers}</p>
  //             <p className="text-xs text-green-600 mt-1">Đang hoạt động</p>
  //           </div>
  //           <div className="p-3 bg-green-500 rounded-full">
  //             <UserCheck className="h-8 w-8 text-white" />
  //           </div>
  //         </div>
  //       </Card>

  //       <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-sm font-medium text-orange-700 mb-1">Đang chờ duyệt</p>
  //             <p className="text-3xl font-bold text-orange-900">{pendingSellers}</p>
  //             <p className="text-xs text-orange-600 mt-1">Chưa xác minh</p>
  //           </div>
  //           <div className="p-3 bg-orange-500 rounded-full">
  //             <Clock className="h-8 w-8 text-white" />
  //           </div>
  //         </div>
  //       </Card>
  //     </div>
  //   );
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header - Improved */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Quản lý nhãn hàng</h1>
                <p className="text-gray-600">
                  Hiện tại {brands.length} trong tổng số {totalBrands} nhãn hàng
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm nhãn hàng
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Có lỗi xảy ra</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="border-red-200 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Thử lại
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Section - Improved */}
        <Card className="mb-6 shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên nhãn hàng..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Tìm kiếm
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearSearch}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Xóa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Danh sách nhãn hàng
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {totalBrands > 0
                    ? `Quản lý và theo dõi ${totalBrands} nhãn hàng trong hệ thống`
                    : 'Không tìm thấy nhãn hàng nào'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-3">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                  <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : brands.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có nhãn hàng nào</h3>
                <p className="text-gray-600 mb-4">
                  Bắt đầu bằng cách thêm nhãn hàng đầu tiên của bạn
                </p>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm nhãn hàng đầu tiên
                </Button>
              </div>
            ) : (
              <>
                {/* Improved Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="font-semibold text-gray-700 py-4">Logo</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">
                          Tên nhãn hàng
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Danh mục</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Mô tả</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Ngày tạo
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 text-center">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {brands.map((brand) => (
                        <TableRow
                          key={brand.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          {/* Brand Info - Logo + Name */}
                          <TableCell className="py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                                {brand.imgUrl ? (
                                  <img
                                    src={brand.imgUrl}
                                    alt={`${brand.name} logo`}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400 text-xs font-semibold">
                                      {brand.name?.charAt(0) || '?'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="justify-center gap-2">
                              <span className="text-gray-900 font-semibold text-lg">
                                {brand.name}
                              </span>
                            </div>
                          </TableCell>

                          {/* Status */}
                          <TableCell className="py-4">
                            <div className="flex flex-wrap gap-1">
                              {brand.categories.slice(0, 2).map((category) => (
                                <Badge
                                  key={category.id}
                                  className="font-semibold text-orange-900 text-sm bg-orange-100 border border-orange-300"
                                >
                                  {category.name}
                                </Badge>
                              ))}
                              {brand.categories.length > 2 && (
                                <Badge className="text-xs font-medium text-orange-900 bg-orange-100 border border-orange-300">
                                  +{brand.categories.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="bg-gray-100 px-3 py-1.5 rounded-md text-sm text-gray-700 font-mono">
                              {brand.description
                                ? brand.description.length > 50
                                  ? brand.description.slice(0, 50) + '...'
                                  : brand.description
                                : 'Không có mô tả'}
                            </span>
                          </TableCell>
                          {/* Created Date */}
                          <TableCell className="py-4">
                            <span className="text-gray-600">{formatDate(brand.createdAt)}</span>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="py-4">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(brand)}
                                className="px-3 py-1 text-sm border border-blue-500 text-blue-600 rounded hover:bg-blue-500 hover:text-white transition-colors"
                                title="Xem chi tiết"
                              >
                                <Edit className="h-4 w-4 inline mr-1" />
                                Sửa
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="px-3 py-1 text-sm border border-red-500 text-red-600 rounded hover:bg-red-500 hover:text-white transition-colors"
                                title="Tùy chọn khác"
                              >
                                <Trash className="h-4 w-4 inline mr-1" />
                                Xoá
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Improved Pagination */}
                {maxPage > 1 && (
                  <div className="border-t border-gray-200 bg-white px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-gray-600">
                        Hiển thị <span className="font-medium">{brands.length}</span> trong tổng số{' '}
                        <span className="font-medium">{totalBrands}</span> nhãn hàng
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          ← Trước
                        </Button>

                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, maxPage) }, (_, i) => {
                            let pageNum;
                            if (maxPage <= 5) {
                              pageNum = i + 1;
                            } else {
                              const start = Math.max(1, page - 2);
                              const end = Math.min(maxPage, start + 4);
                              pageNum = start + i;
                              if (pageNum > end) return null;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={page === pageNum ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-8 h-8 p-0 ${page === pageNum
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }`}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === maxPage}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Tiếp →
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <CreateBrandDialog isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

        <ViewUpdateBrandDialog
          brand={selectedBrand}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedBrand(null);
          }}
        />
      </div>
    </div>
  );
};

export default BrandManagementPage;
