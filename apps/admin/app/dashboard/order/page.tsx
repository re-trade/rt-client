'use client';

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
import { useOrderManager } from '@/hooks/use-order-manager';

import {
  AlertCircle,
  Ban,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Filter,
  Loader,
  Package,
  RefreshCw,
  RotateCcw,
  Search,
  Truck,
  Undo2,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

const OrderStats = ({ orders }: { orders: any[] }) => {
  const totalOrders = orders.length;

  const completedOrder = orders.filter((o) =>
    o.orderCombos?.some((combo: any) => combo.status === 'Completed'),
  ).length;
  const pendingOrders = orders.filter((o) => o.status === 'Peding').length;
  const paymentConfirmationOrders = orders.filter(
    (o) => o.status === 'PAYMENT_CONFIRMATION',
  ).length;
  const paymentFailedOrders = orders.filter(
    (o) => o.orderCombos.status === 'PAYMENT_FAILED',
  ).length;
  const paymentCancelledOrders = orders.filter(
    (o) => o.orderCombos.status === 'PAYMENT_CANCELLED',
  ).length;
  const unpaidOrders = orders.filter((o) => o.orderCombos.status === 'UNPAID').length;
  const preparingOrders = orders.filter((o) => o.orderCombos.status === 'PREPARING').length;
  const deliveringOrders = orders.filter((o) => o.orderCombos.status === 'DELIVERING').length;
  const deliveredOrders = orders.filter((o) => o.orderCombos.status === 'DELIVERED').length;
  const completedOrders = orders.filter((o) => o.orderCombos.status === 'COMPLETED').length;
  const cancelledOrders = orders.filter((o) => o.orderCombos.status === 'CANCELLED').length;
  const returnRequestedOrders = orders.filter(
    (o) => o.orderCombos.status === 'RETURN_REQUESTED',
  ).length;
  const returnApprovedOrders = orders.filter(
    (o) => o.orderCombos.status === 'RETURN_APPROVED',
  ).length;
  const returnRejectedOrders = orders.filter(
    (o) => o.orderCombos.status === 'RETURN_REJECTED',
  ).length;
  const returningOrders = orders.filter((o) => o.orderCombos.status === 'RETURNING').length;
  const returnedOrders = orders.filter((o) => o.orderCombos.status === 'RETURNED').length;
  const refundedOrders = orders.filter((o) => o.orderCombos.status === 'REFUNDED').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng số đơn hàng</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <Package className="h-8 w-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Chờ xử lý</p>
            <p className="text-2xl font-bold">{pendingOrders}</p>
          </div>
          <Clock className="h-8 w-8 text-yellow-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã xác nhận thanh toán</p>
            <p className="text-2xl font-bold">{paymentConfirmationOrders}</p>
          </div>
          <CreditCard className="h-8 w-8 text-indigo-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Thanh toán thất bại</p>
            <p className="text-2xl font-bold">{paymentFailedOrders}</p>
          </div>
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Chưa thanh toán</p>
            <p className="text-2xl font-bold">{unpaidOrders}</p>
          </div>
          <DollarSign className="h-8 w-8 text-orange-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đang chuẩn bị</p>
            <p className="text-2xl font-bold">{pendingOrders}</p>
          </div>
          <Loader className="h-8 w-8 text-cyan-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đang giao hàng</p>
            <p className="text-2xl font-bold">{deliveringOrders}</p>
          </div>
          <Truck className="h-8 w-8 text-amber-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã giao hàng</p>
            <p className="text-2xl font-bold">{deliveredOrders}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-lime-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Hoàn tất</p>
            <p className="text-2xl font-bold">{completedOrder}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã huỷ</p>
            <p className="text-2xl font-bold">{cancelledOrders}</p>
          </div>
          <Ban className="h-8 w-8 text-red-600" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Yêu cầu hoàn trả</p>
            <p className="text-2xl font-bold">{returnRequestedOrders}</p>
          </div>
          <Undo2 className="h-8 w-8 text-pink-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã chấp nhận trả</p>
            <p className="text-2xl font-bold">{returnApprovedOrders}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Từ chối trả</p>
            <p className="text-2xl font-bold">{returnRejectedOrders}</p>
          </div>
          <XCircle className="h-8 w-8 text-rose-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đang hoàn trả</p>
            <p className="text-2xl font-bold">{returningOrders}</p>
          </div>
          <RotateCcw className="h-8 w-8 text-sky-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã hoàn trả</p>
            <p className="text-2xl font-bold">{returnedOrders}</p>
          </div>
          <RotateCcw className="h-8 w-8 text-violet-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã hoàn tiền</p>
            <p className="text-2xl font-bold">{refundedOrders}</p>
          </div>
          <DollarSign className="h-8 w-8 text-green-500" />
        </div>
      </Card>
    </div>
  );
};

const AdvancedFilters = ({ searchQuery, onSearch, selectedCategory, setSelectedCategory }: any) => {
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

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            <SelectItem value="PENDING">Chờ xử lý</SelectItem>
            <SelectItem value="PAYMENT_CONFIRMATION">Đã xác nhận thanh toán</SelectItem>
            <SelectItem value="PAYMENT_FAILED">Thanh toán thất bại</SelectItem>
            <SelectItem value="UNPAID">Chưa thanh toán</SelectItem>
            <SelectItem value="PREPARING">Đang chuẩn bị</SelectItem>
            <SelectItem value="DELIVERING">Đang giao hàng</SelectItem>
            <SelectItem value="DELIVERED">Đã giao hàng</SelectItem>
            <SelectItem value="completed">Hoàn tất</SelectItem>
            <SelectItem value="CANCELLED">Đã huỷ</SelectItem>
            <SelectItem value="RETURN_REQUESTED">Yêu cầu hoàn trả</SelectItem>
            <SelectItem value="RETURN_APPROVED">Đã chấp nhận trả</SelectItem>
            <SelectItem value="RETURN_REJECTED">Từ chối trả</SelectItem>
            <SelectItem value="RETURNING">Đang hoàn trả</SelectItem>
            <SelectItem value="RETURNED">Đã hoàn trả</SelectItem>
            <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};

const OrderDetailModal = ({
  order,
  isOpen,
  onClose,
  onVerify,
  onReject,
}: {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (id: string) => void;
  onReject?: (id: string) => void;
  onPending?: (id: string) => void;
}) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Thông tin đơn hàng
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về đơn hàng</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p className="max-w-[150px] truncate overflow-hidden whitespace-nowrap">
                  {order.orderId}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID khách hàng</p>
                <p>{order.customerId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tên khách hàng</p>
                <p>{order.customerName}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                <p>{order.destination.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng số tiền</p>
                <p>{order.grandTotal}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                <p>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                <p>{new Date(order.resolutionDate).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>
        </div>

        {order.status === 'PENDING' && (
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="text-green-600 border-green-600"
              onClick={() => onVerify && onVerify(order.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Hủy đơn hàng
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default function OrderManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set()); // Track expanded orders
  const {
    orders = [],
    page,
    maxPage,
    totalOrders,
    loading,
    error,
    refetch,
    goToPage,
    searchOrders,
    cancelOrder,
  } = useOrderManager();

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
    searchOrders(query);
  };

  const handlePageChange = (newPage: number) => {
    goToPage(newPage, searchQuery);
  };

  const handleCancel = async (reportId: string) => {
    const result = await cancelOrder(reportId);
    if (result.success) {
      setDeleteSuccess('Hủy đơn hàng thành công!');
    } else {
      setDeleteError(result.message || 'Lỗi hủy đơn hàng');
    }
  };

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      order.orderCombos.some((combo) =>
        combo.status.toLowerCase().includes(selectedCategory.toLowerCase()),
      );
    return matchesCategory;
  });

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'PAYMENT_CONFIRMATION':
      case 'PREPARING':
      case 'DELIVERING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
      case 'RETURNED':
      case 'REFUNDED':
        return 'bg-green-100 text-green-800';
      case 'PAYMENT_FAILED':
      case 'CANCELLED':
      case 'RETURN_REJECTED':
        return 'bg-red-100 text-red-800';
      case 'DELIVERED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
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

      {(error || deleteError) && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <div className="flex-1">
              <span className="font-medium">Lỗi:</span> {error || deleteError}
              {(error || deleteError)?.includes('đăng nhập') && (
                <div className="mt-2 text-sm">
                  <p>
                    Vui lòng đảm bảo bạn đã đăng nhập với tài khoản admin và có quyền thực hiện thao
                    tác này.
                  </p>
                  <p className="mt-1 text-xs text-red-600">
                    <strong>Lưu ý:</strong> Hệ thống sẽ tự động chuyển về trang đăng nhập sau 3
                    giây.
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

      <OrderStats orders={orders} />

      {/* Advanced Filters */}
      <AdvancedFilters
        searchQuery={searchQuery}
        onSearch={handleSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <Card className="p-6">
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Đang tải ...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mb-4" />
              <p>Không tìm thấy đơn hàng</p>
              <p className="text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead> {/* Empty header for expand icon */}
                  <TableHead>ID</TableHead>
                  <TableHead>ID khách hàng</TableHead>
                  <TableHead>Tên khách hàng</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Tổng số tiền</TableHead>
                  <TableHead>Tình trạng</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Ngày cập nhật cuối</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <>
                    <TableRow key={order.orderId}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpandOrder(order.orderId)}
                        >
                          {expandedOrders.has(order.orderId) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium max-w-[150px] truncate overflow-hidden whitespace-nowrap">
                        {order.orderId}
                      </TableCell>
                      <TableCell className="font-medium">{order.customerId}</TableCell>
                      <TableCell className="font-medium">{order.customerName}</TableCell>
                      <TableCell className="font-medium max-w-[150px] truncate overflow-hidden whitespace-nowrap">
                        {order.destination.phone}
                      </TableCell>
                      <TableCell className="font-medium">{order.grandTotal}</TableCell>
                      <TableCell className="font-medium">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                            order.orderCombos[0]?.status,
                          )}`}
                        >
                          {order.orderCombos[0]?.status ?? '-'}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Date(order.updatedAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleView(order)}>
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedOrders.has(order.orderId) && (
                      <TableRow>
                        <TableCell colSpan={10}>
                          <div className="pl-8">
                            <h4 className="font-medium mb-2">Danh sách Order Combos</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Combo ID</TableHead>
                                  <TableHead>Seller ID</TableHead>
                                  <TableHead>Tên Seller</TableHead>
                                  <TableHead>Giá</TableHead>
                                  <TableHead>Tình trạng</TableHead>
                                  <TableHead>Item IDs</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.orderCombos.map((combo: any) => (
                                  <TableRow key={combo.comboId}>
                                    <TableCell>{combo.comboId}</TableCell>
                                    <TableCell>{combo.sellerId}</TableCell>
                                    <TableCell>{combo.sellerName}</TableCell>
                                    <TableCell>{combo.grandPrice}</TableCell>
                                    <TableCell>
                                      <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                                          combo.status,
                                        )}`}
                                      >
                                        {combo.status}
                                      </span>
                                    </TableCell>
                                    <TableCell>{combo.itemIds.join(', ')}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {!loading && orders.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {orders.length} tố cáo trên trang {page} / {maxPage} (Tổng cộng {totalOrders}{' '}
              tố cáo)
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

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        onVerify={async (id: string) => {
          const result = await cancelOrder(id);
          if (result.success) setDeleteSuccess('Hủy đơn hàng thành công!');
          else setDeleteError(result.message || 'Lỗi hủy đơn hàng');
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
          refetch();
        }}
      />
    </div>
  );
}
