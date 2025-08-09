import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TProduct, TProductStatus } from '@/service/product.api';
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Star,
  Tags,
  Trash,
  XCircle,
} from 'lucide-react';

import ProductListEmpty from '@/components/product/ProductListEmpty';
import ProductListSkeleton from '@/components/product/ProductListSkeleton';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';

const getStatusBadge = (status: TProductStatus) => {
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

    case 'DELETED':
      return (
        <Badge className="bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200">
          <Trash className="w-3 h-3 mr-1" />
          Đã xóa
        </Badge>
      );

    case 'INIT':
      return (
        <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
          <Clock className="w-3 h-3 mr-1" />
          Khởi tạo
        </Badge>
      );

    case 'DRAFT':
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
          <FileText className="w-3 h-3 mr-1" />
          Bản nháp
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

interface ProductTableProps {
  products: TProduct[];
  loading: boolean;
  handDetailsProduct: (product: TProduct) => void;
  handleEditProduct: (product: TProduct) => void;
  handleDeleteProduct: (product: TProduct) => void;
  clearFilters: () => void;
  setIsCreateOpen: (isOpen: boolean) => void;
  refreshing: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  sort?: { field: string; direction: 'asc' | 'desc' | null };
  handleSortChange?: (field: string) => void;
}

const ProductTable = ({
  products,
  loading,
  handleDeleteProduct,
  handleEditProduct,
  handDetailsProduct,
  clearFilters,
  setIsCreateOpen,
  refreshing,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  handlePageChange,
  handlePageSizeChange,
  sort = { field: '', direction: null },
  handleSortChange,
}: ProductTableProps) => {
  if (loading) {
    return <ProductListSkeleton />;
  }
  if (products.length === 0) {
    return (
      <ProductListEmpty
        length={products.length}
        clearFilters={clearFilters}
        setIsCreateOpen={setIsCreateOpen}
      />
    );
  }
  return (
    <div>
      <Card className="border shadow bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 bg-slate-50/50 select-none">
                  <TableHead className="w-20 font-semibold text-slate-700">Hình ảnh</TableHead>
                  <TableHead
                    className="min-w-40 font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSortChange && handleSortChange('name')}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 group">
                            Tên sản phẩm
                            {sort.field === 'name' && sort.direction ? (
                              sort.direction === 'asc' ? (
                                <ChevronUp className="h-4 w-4 text-blue-600" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-blue-600" />
                              )
                            ) : (
                              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-50" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click để sắp xếp theo tên sản phẩm</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead
                    className="w-32 font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSortChange && handleSortChange('currentPrice')}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 group">
                            Giá
                            {sort.field === 'currentPrice' && sort.direction ? (
                              sort.direction === 'asc' ? (
                                <ChevronUp className="h-4 w-4 text-blue-600" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-blue-600" />
                              )
                            ) : (
                              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-50" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click để sắp xếp theo giá</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead
                    className="w-32 font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSortChange && handleSortChange('brand')}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 group">
                            Thương hiệu
                            {sort.field === 'brand' && sort.direction ? (
                              sort.direction === 'asc' ? (
                                <ChevronUp className="h-4 w-4 text-blue-600" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-blue-600" />
                              )
                            ) : (
                              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-50" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click để sắp xếp theo thương hiệu</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead
                    className="w-20 font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSortChange && handleSortChange('quantity')}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 group">
                            Số lượng
                            {sort.field === 'quantity' && sort.direction ? (
                              sort.direction === 'asc' ? (
                                <ChevronUp className="h-4 w-4 text-blue-600" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-blue-600" />
                              )
                            ) : (
                              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-50" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click để sắp xếp theo số lượng</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="min-w-40 font-semibold text-slate-700">Danh mục</TableHead>
                  <TableHead
                    className="w-36 font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSortChange && handleSortChange('status')}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 group">
                            Trạng thái
                            {sort.field === 'status' && sort.direction ? (
                              sort.direction === 'asc' ? (
                                <ChevronUp className="h-4 w-4 text-blue-600" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-blue-600" />
                              )
                            ) : (
                              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-50" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click để sắp xếp theo trạng thái</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead
                    className="w-36 font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSortChange && handleSortChange('verified')}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 group">
                            Xác minh
                            {sort.field === 'verified' && sort.direction ? (
                              sort.direction === 'asc' ? (
                                <ChevronUp className="h-4 w-4 text-blue-600" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-blue-600" />
                              )
                            ) : (
                              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-50" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click để sắp xếp theo trạng thái xác minh</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="w-24 font-semibold text-slate-700">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-slate-50/50 transition-colors border-slate-100"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableBody>
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm">
                        <Image
                          src={product.thumbnail || '/placeholder.svg'}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform hover:scale-110"
                        />
                      </div>
                    </TableBody>
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
                          <DropdownMenuLabel className="text-slate-700">Thao tác</DropdownMenuLabel>
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={loading || refreshing}
        pageSizeOptions={[10, 15, 20, 50]}
      />
    </div>
  );
};

export default ProductTable;
