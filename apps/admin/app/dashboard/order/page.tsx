'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';

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
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useOrderManager } from '@/hooks/use-order-manager';
import type { TOrder } from '@/services/order.api';
import {
  AlertCircle,
  Ban,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  Filter,
  Hash,
  Package,
  Phone,
  RefreshCw,
  ShoppingCart,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

const OrderStats = ({ orders }: { orders: TOrder[] }) => {
  const { stats, loading, error } = useDashboardStats();

  const completedOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'COMPLETED'),
  ).length;
  const pendingOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'PENDING'),
  ).length;
  const paymentConfirmationOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'PAYMENT_CONFIRMATION'),
  ).length;
  const paymentFailedOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'PAYMENT_FAILED'),
  ).length;
  const paymentCancelledOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'PAYMENT_CANCELLED'),
  ).length;
  const unpaidOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'UNPAID'),
  ).length;
  const preparingOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'PREPARING'),
  ).length;
  const deliveringOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'DELIVERING'),
  ).length;
  const deliveredOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'DELIVERED'),
  ).length;
  const cancelledOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'CANCELLED'),
  ).length;
  const returnRequestedOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'RETURN_REQUESTED'),
  ).length;
  const returnApprovedOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'RETURN_APPROVED'),
  ).length;
  const returnRejectedOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'RETURN_REJECTED'),
  ).length;
  const returningOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'RETURNING'),
  ).length;
  const returnedOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'RETURNED'),
  ).length;
  const refundedOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === 'REFUNDED'),
  ).length;

  if (loading) {
    return (
      <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-50 to-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-600">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="font-medium">Đang tải thống kê...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-25 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-700">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold">Có lỗi xảy ra</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-50 to-white">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-slate-500">
            <Package className="h-12 w-12 mb-3 opacity-50" />
            <p className="font-medium">Không có dữ liệu thống kê</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-25 hover:shadow-md transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-700">Tổng số đơn hàng</p>
              <p className="text-3xl font-bold text-blue-900">
                {stats.totalOrders.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdvancedFilters = ({
  searchQuery,
  onSearch,
  selectedCategory,
  setSelectedCategory,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  updatedAfter,
  setUpdatedAfter,
}: {
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  updatedAfter: string;
  setUpdatedAfter: (date: string) => void;
}) => {
  const handleClearFilters = () => {
    onSearch('');
    setSelectedCategory('all');
    setSortField('orderId');
    setSortOrder('asc');
    setUpdatedAfter('');
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Filter className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Bộ lọc nâng cao</h3>
              <p className="text-sm text-slate-500">Tìm kiếm và sắp xếp đơn hàng</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="text-slate-600 border-slate-200 hover:bg-slate-50 bg-transparent"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200"
            />
          </div> */}
          <Select value={sortField} onValueChange={setSortField}>
            <SelectTrigger className="border-slate-200 focus:border-blue-300 focus:ring-blue-200">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orderId">ID</SelectItem>
              <SelectItem value="customerId">ID Khách hàng</SelectItem>
              <SelectItem value="customerName">Tên Khách hàng</SelectItem>
              <SelectItem value="phone">Số điện thoại</SelectItem>
              {/* <SelectItem value="status">Tình trạng</SelectItem> */}
              <SelectItem value="createdAt">Ngày tạo</SelectItem>
              <SelectItem value="updatedAt">Ngày cập nhật</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="border-slate-200 focus:border-blue-300 focus:ring-blue-200">
              <SelectValue placeholder="Thứ tự" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Tăng dần</SelectItem>
              <SelectItem value="desc">Giảm dần</SelectItem>
            </SelectContent>
          </Select>
          <div className="space-y-2">
            <Input
              id="updatedAfter"
              type="date"
              value={updatedAfter}
              onChange={(e) => setUpdatedAfter(e.target.value)}
              className="border-slate-200 focus:border-blue-300 focus:ring-blue-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const OrderDetailModal = ({
  order,
  isOpen,
  onClose,
  onVerify,
}: {
  order: TOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (id: string) => void;
}) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            Thông tin đơn hàng
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Thông tin chi tiết về đơn hàng và trạng thái xử lý
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-slate-200 bg-slate-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Hash className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">ID Đơn hàng</p>
                      <p className="font-mono text-sm bg-white px-2 py-1 rounded border max-w-[200px] truncate">
                        {order.orderId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Khách hàng</p>
                      <p className="font-semibold text-slate-900">{order.customerName}</p>
                      <p className="text-sm text-slate-600">ID: {order.customerId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Số điện thoại</p>
                      <p className="font-medium text-slate-900">{order.destination.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Ngày tạo</p>
                      <p className="font-medium text-slate-900">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Cập nhật lần cuối</p>
                      <p className="font-medium text-slate-900">
                        {new Date(order.updatedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {order.status === 'PENDING' && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button
              variant="destructive"
              onClick={() => onVerify && onVerify(order.orderId)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Ban className="h-4 w-4 mr-2" />
              Hủy đơn hàng
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default function OrderManagementPage() {
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('orderId');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [updatedAfter, setUpdatedAfter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<{
    [orderId: string]: { combos: boolean; items: boolean };
  }>({});

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    searchOrders(query);
    goToPage(1, query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    goToPage(1, searchQuery);
  };

  const handleSortFieldChange = (field: string) => {
    setSortField(field);
    setCurrentPage(1);
    goToPage(1, searchQuery);
  };

  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
    setCurrentPage(1);
    goToPage(1, searchQuery);
  };

  const handleUpdatedAfterChange = (date: string) => {
    setUpdatedAfter(date);
    setCurrentPage(1);
    goToPage(1, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    goToPage(newPage, searchQuery);
  };

  const handleCancel = async (orderId: string) => {
    const result = await cancelOrder(orderId);
    if (result.success) {
      setDeleteSuccess('Hủy đơn hàng thành công!');
    } else {
      setDeleteError(result.message || 'Lỗi hủy đơn hàng');
    }
  };

  const handleView = (order: TOrder) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
        setExpandedSections((prevSections) => {
          const newSections = { ...prevSections };
          delete newSections[orderId];
          return newSections;
        });
      } else {
        newSet.add(orderId);
        setExpandedSections((prevSections) => ({
          ...prevSections,
          [orderId]: { combos: false, items: false },
        }));
      }
      return newSet;
    });
  };

  const toggleSection = (orderId: string, section: 'combos' | 'items') => {
    setExpandedSections((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [section]: !prev[orderId]?.[section],
      },
    }));
  };

  const sortedOrders = [...orders].sort((a: TOrder, b: TOrder) => {
    let valueA: any;
    let valueB: any;
    switch (sortField) {
      case 'orderId':
        valueA = a.orderId.toLowerCase();
        valueB = b.orderId.toLowerCase();
        break;
      case 'customerId':
        valueA = a.customerId.toLowerCase();
        valueB = b.customerId.toLowerCase();
        break;
      case 'customerName':
        valueA = a.customerName.toLowerCase();
        valueB = b.customerName.toLowerCase();
        break;
      case 'phone':
        valueA = a.destination.phone.toLowerCase();
        valueB = b.destination.phone.toLowerCase();
        break;
      case 'grandTotal':
        valueA = a.grandTotal;
        valueB = b.grandTotal;
        break;
      case 'status':
        valueA = a.orderCombos[0]?.status?.toLowerCase() || '';
        valueB = b.orderCombos[0]?.status?.toLowerCase() || '';
        break;
      case 'createdAt':
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        valueA = new Date(a.updatedAt).getTime();
        valueB = new Date(b.updatedAt).getTime();
        break;
      default:
        return 0;
    }
    if (valueA === valueB) return 0;
    if (!valueA) return 1;
    if (!valueB) return -1;
    return sortOrder === 'asc' ? (valueA < valueB ? -1 : 1) : valueA > valueB ? -1 : 1;
  });

  const filteredOrders = sortedOrders.filter((order: TOrder) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      order.orderCombos.some((combo) =>
        combo.status.toLowerCase().includes(selectedCategory.toLowerCase()),
      );
    const orderLastUpdate = new Date(order.updatedAt);
    const matchesLastUpdate = !updatedAfter || orderLastUpdate >= new Date(updatedAfter);
    return matchesCategory && matchesLastUpdate;
  });

  const getStatusColor = (status?: string): string => {
    switch (status ?? 'PENDING') {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'PAYMENT_CONFIRMATION':
      case 'PREPARING':
      case 'DELIVERING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
      case 'RETURNED':
      case 'REFUNDED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PAYMENT_FAILED':
      case 'CANCELLED':
      case 'RETURN_REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'DELIVERED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status ?? 'PENDING') {
      case 'PENDING':
        return <Clock className="h-3 w-3" />;
      case 'COMPLETED':
        return <CheckCircle className="h-3 w-3" />;
      case 'CANCELLED':
        return <Ban className="h-3 w-3" />;
      case 'DELIVERING':
        return <Truck className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-8 p-6 bg-slate-50 min-h-screen">
      {deleteSuccess && (
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="p-2 bg-emerald-100 rounded-full">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Thành công!</p>
                <p className="text-sm text-emerald-600">{deleteSuccess}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteSuccess(null)}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(error || deleteError) && (
        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-rose-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 text-red-700">
              <div className="p-2 bg-red-100 rounded-full mt-0.5">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Có lỗi xảy ra</p>
                <p className="text-sm text-red-600 mb-2">{error || deleteError}</p>
                {(error || deleteError)?.includes('đăng nhập') && (
                  <div className="text-sm space-y-1">
                    <p className="text-red-600">
                      Vui lòng đảm bảo bạn đã đăng nhập với tài khoản admin và có quyền thực hiện
                      thao tác này.
                    </p>
                    <p className="text-xs text-red-500 bg-red-50 p-2 rounded">
                      <strong>Lưu ý:</strong> Hệ thống sẽ tự động chuyển về trang đăng nhập sau 3
                      giây.
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteError(null)}
                className="text-red-600 hover:text-red-700 hover:bg-red-100"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <OrderStats orders={orders} />

      <AdvancedFilters
        searchQuery={searchQuery}
        onSearch={handleSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
        sortField={sortField}
        setSortField={handleSortFieldChange}
        sortOrder={sortOrder}
        setSortOrder={handleSortOrderChange}
        updatedAfter={updatedAfter}
        setUpdatedAfter={handleUpdatedAfterChange}
      />

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Package className="h-5 w-5 text-slate-600" />
            </div>
            Danh sách đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 text-slate-600">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span className="font-medium">Đang tải đơn hàng...</span>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <div className="p-4 bg-slate-100 rounded-full mb-4">
                <Package className="h-12 w-12" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Không tìm thấy đơn hàng</h3>
              <p className="text-sm text-center max-w-md">
                Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="hover:bg-slate-50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="font-semibold text-slate-700">ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">ID khách hàng</TableHead>
                    <TableHead className="font-semibold text-slate-700">Tên khách hàng</TableHead>
                    <TableHead className="font-semibold text-slate-700">Số điện thoại</TableHead>
                    {/* <TableHead className="font-semibold text-slate-700">Tình trạng</TableHead> */}
                    <TableHead className="font-semibold text-slate-700">Ngày tạo</TableHead>
                    <TableHead className="font-semibold text-slate-700">Ngày cập nhật</TableHead>
                    <TableHead className=" font-semibold text-slate-700">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order: TOrder) => (
                    <>
                      <TableRow key={order.orderId} className="hover:bg-slate-50 transition-colors">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpandOrder(order.orderId)}
                            className="h-8 w-8 p-0 hover:bg-slate-100"
                          >
                            {expandedOrders.has(order.orderId) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-mono text-sm max-w-[150px] truncate">
                          {order.orderId}
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">
                          {order.customerId}
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">
                          {order.customerName}
                        </TableCell>
                        <TableCell className="font-medium text-slate-700 max-w-[150px] truncate">
                          {order.destination.phone}
                        </TableCell>
                        {/* <TableCell>
                          <Badge className={`${getStatusColor(order.status)} font-medium border`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status ?? "Pending"}</span>
                          </Badge>
                        </TableCell> */}
                        <TableCell className="text-slate-600">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {new Date(order.updatedAt).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(order)}
                            className="border-slate-200 hover:bg-slate-50"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedOrders.has(order.orderId) && (
                        <TableRow>
                          <TableCell colSpan={10} className="p-0">
                            <div className="bg-slate-50 border-t border-slate-200">
                              <div className="p-8 space-y-8">
                                <div>
                                  <div className="flex items-center mb-6">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleSection(order.orderId, 'combos')}
                                      className="mr-3 p-0 hover:bg-slate-100"
                                    >
                                      {expandedSections[order.orderId]?.combos ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                      <Package className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-lg text-slate-900">
                                        Danh sách Order Combos
                                      </h4>
                                      <p className="text-sm text-slate-500">
                                        Chi tiết các combo trong đơn hàng
                                      </p>
                                    </div>
                                    <Badge
                                      variant="secondary"
                                      className="ml-4 bg-blue-100 text-blue-700 border-blue-200"
                                    >
                                      {order.orderCombos.length} combo(s)
                                    </Badge>
                                  </div>

                                  {expandedSections[order.orderId]?.combos && (
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                      {order.orderCombos.map((combo) => (
                                        <Card
                                          key={combo.comboId}
                                          className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                          <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                <Hash className="h-4 w-4 text-slate-500" />
                                                <span className="font-mono">{combo.comboId}</span>
                                              </CardTitle>
                                              <Badge
                                                className={`${getStatusColor(combo.status)} flex items-center gap-1 border font-medium`}
                                              >
                                                {getStatusIcon(combo.status)}
                                                {combo.status}
                                              </Badge>
                                            </div>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                              <div className="space-y-1">
                                                <p className="text-slate-500 flex items-center gap-1">
                                                  <User className="h-3 w-3" />
                                                  Seller ID
                                                </p>
                                                <p className="font-medium text-slate-900 truncate font-mono text-xs">
                                                  {combo.sellerId}
                                                </p>
                                              </div>
                                              <div className="space-y-1">
                                                <p className="text-slate-500">Tên Seller</p>
                                                <p className="font-medium text-slate-900 truncate">
                                                  {combo.sellerName}
                                                </p>
                                              </div>
                                            </div>

                                            <Separator />

                                            <div className="flex items-center justify-between">
                                              <div>
                                                <p className="text-slate-500 text-sm flex items-center gap-1 mb-1">
                                                  <DollarSign className="h-3 w-3" />
                                                  Số tiền
                                                </p>
                                                <p className="font-bold text-lg text-emerald-600">
                                                  {combo.grandPrice?.toLocaleString('vi-VN')} ₫
                                                </p>
                                              </div>
                                              <div className="text-right">
                                                <p className="text-slate-500 text-sm mb-1">Items</p>
                                                <Badge
                                                  variant="outline"
                                                  className="border-slate-300"
                                                >
                                                  {combo.itemIds.length} sản phẩm
                                                </Badge>
                                              </div>
                                            </div>

                                            {combo.itemIds.length > 0 && (
                                              <div className="space-y-2">
                                                <p className="text-slate-500 text-xs font-medium">
                                                  Item IDs:
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                  {combo.itemIds
                                                    .slice(0, 3)
                                                    .map((itemId, index) => (
                                                      <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="text-xs font-mono bg-slate-100 text-slate-700"
                                                      >
                                                        {itemId}
                                                      </Badge>
                                                    ))}
                                                  {combo.itemIds.length > 3 && (
                                                    <Badge
                                                      variant="secondary"
                                                      className="text-xs bg-slate-200 text-slate-600"
                                                    >
                                                      +{combo.itemIds.length - 3} more
                                                    </Badge>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <div className="flex items-center mb-6">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleSection(order.orderId, 'items')}
                                      className="mr-3 p-0 hover:bg-slate-100"
                                    >
                                      {expandedSections[order.orderId]?.items ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                                      <ShoppingCart className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-lg text-slate-900">
                                        Danh sách Items
                                      </h4>
                                      <p className="text-sm text-slate-500">
                                        Chi tiết sản phẩm trong đơn hàng
                                      </p>
                                    </div>
                                    <Badge
                                      variant="secondary"
                                      className="ml-4 bg-emerald-100 text-emerald-700 border-emerald-200"
                                    >
                                      {order.items.length} item(s)
                                    </Badge>
                                  </div>

                                  {expandedSections[order.orderId]?.items && (
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                      {order.items.map((item) => (
                                        <Card
                                          key={item.productId}
                                          className="border-l-4 border-l-emerald-500 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                        >
                                          <CardContent className="p-0">
                                            <div className="flex p-6 pb-4">
                                              <div className="flex-shrink-0 mr-4">
                                                <div className="relative">
                                                  <img
                                                    src={
                                                      item.productThumbnail || '/placeholder.svg'
                                                    }
                                                    alt={item.productName}
                                                    className="w-16 h-16 object-cover rounded-xl border-2 border-slate-200 shadow-sm"
                                                    onError={(e) => {
                                                      e.currentTarget.src =
                                                        '/placeholder.svg?height=64&width=64';
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-slate-900 truncate mb-2 leading-tight">
                                                  {item.productName}
                                                </h4>
                                                <p className="text-xs text-slate-500 mb-2 font-mono bg-slate-100 px-2 py-1 rounded">
                                                  ID: {item.productId}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                  <div className="p-1 bg-slate-100 rounded">
                                                    <User className="h-3 w-3 text-slate-500" />
                                                  </div>
                                                  <p className="text-xs text-slate-600 truncate font-medium">
                                                    {item.sellerName}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>

                                            <Separator />

                                            <div className="p-6 pt-4">
                                              <div className="grid grid-cols-3 gap-4">
                                                <div className="text-center">
                                                  <p className="text-xs text-slate-500 mb-2 font-medium">
                                                    Số lượng
                                                  </p>
                                                  <Badge
                                                    variant="outline"
                                                    className="text-blue-700 border-blue-300 bg-blue-50 font-semibold"
                                                  >
                                                    {item.quantity}
                                                  </Badge>
                                                </div>
                                                <div className="text-center">
                                                  <p className="text-xs text-slate-500 mb-2 font-medium">
                                                    Đơn giá
                                                  </p>
                                                  <p className="font-semibold text-sm text-slate-900">
                                                    {item.unitPrice?.toLocaleString('vi-VN')} ₫
                                                  </p>
                                                </div>
                                                <div className="text-center">
                                                  <p className="text-xs text-slate-500 mb-2 font-medium">
                                                    Tổng tiền
                                                  </p>
                                                  <p className="font-bold text-sm text-emerald-600">
                                                    {item.totalPrice?.toLocaleString('vi-VN')} ₫
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {!loading && orders.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Hiển thị <span className="font-semibold">{filteredOrders.length}</span> đơn hàng
                trên trang <span className="font-semibold">{page}</span> /{' '}
                <span className="font-semibold">{maxPage}</span> (Tổng cộng{' '}
                <span className="font-semibold">{totalOrders}</span> đơn hàng)
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="border-slate-300 hover:bg-slate-100"
                >
                  Trước
                </Button>
                <span className="text-sm text-slate-600 px-3 py-1 bg-white rounded border">
                  Trang {page} / {maxPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === maxPage}
                  className="border-slate-300 hover:bg-slate-100"
                >
                  Sau
                </Button>
              </div>
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
