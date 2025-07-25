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
import { useCustomerManager } from '@/hooks/use-customer-manager';
import {
  AlertCircle,
  CheckCircle,
  Eye,
  Filter,
  Package,
  RefreshCw,
  Search,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

const CustomerStats = ({ customers }: { customers: any[] }) => {
  const totalCustomers = customers.length;
  const verifiedCustomers = customers.filter((p) => p.verified).length;
  const pendingCustomers = customers.filter((p) => !p.verified).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng số khách hàng</p>
            <p className="text-2xl font-bold">{totalCustomers}</p>
          </div>
          <Package className="h-8 w-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã xác minh</p>
            <p className="text-2xl font-bold text-green-600">{verifiedCustomers}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đang chờ duyệt</p>
            <p className="text-2xl font-bold text-orange-600">{pendingCustomers}</p>
          </div>
          <AlertCircle className="h-8 w-8 text-orange-500" />
        </div>
      </Card>
    </div>
  );
};

const AdvancedFilters = ({ searchQuery, onSearch, selectedStatus, setSelectedStatus }: any) => {
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
            placeholder="Tìm kiếm người bán..."
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
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};

const CustomerDetailModal = ({
  customer,
  isOpen,
  onClose,
  onVerify,
  onReject,
}: {
  customer: any;
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (id: string) => void;
  onReject?: (id: string) => void;
}) => {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Thông tin người bán
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về người bán</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p>{customer.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tên người bán</p>
                <p>{customer.shopName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
                <p>{customer.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
                <p>{customer.addressLine}</p>
                <p className="text-sm text-muted-foreground">
                  {customer.ward}, {customer.district}, {customer.state}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                <p>{customer.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{customer.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                <p>{new Date(customer.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                <p>{new Date(customer.updatedAt).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {customer.verified ? (
            <Button
              variant="outline"
              className="text-red-600 border-red-600"
              onClick={() => onReject && onReject(customer.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Vô hiệu hóa người bán{' '}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-green-600 border-green-600"
              onClick={() => onVerify && onVerify(customer.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Xác thực người bán
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CustomerActions = ({ customer, onVerify, onPending, onView }: any) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={() => onView(customer)}>
        <Eye className="h-4 w-4" />
      </Button>

      {!customer.verified && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onVerify(customer.id)}
            className="text-green-600 hover:text-green-700"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPending(customer.id)}
            className="text-red-600 hover:text-red-700"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default function CustomerManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const {
    customers = [],
    page,
    maxPage,
    totalCustomers,
    loading,
    error,
    refetch,
    goToPage,
    searchCustomers,
    handleBanCustomer,
    handleUnbanCustomer,
  } = useCustomerManager();

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
    searchCustomers(query);
  };

  const statusColors: Record<string, string> = {
    true: 'bg-green-100 text-green-800',
    false: 'bg-orange-100 text-orange-800',
  };

  const statusLabels: Record<string, string> = {
    true: 'Đã xác minh',
    false: 'Chờ duyệt',
  };
  const handlePageChange = (newPage: number) => {
    goToPage(newPage, searchQuery);
  };

  const handleVerify = async (customerId: string) => {
    const result = await handleUnbanCustomer(customerId);
    if (result) {
      setDeleteSuccess('Xác minh người bán thành công!');
    } else {
      setDeleteError('Lỗi xác minh người bán');
    }
  };

  const handleReject = async (customerId: string) => {
    const result = await handleBanCustomer(customerId);
    if (result) {
      setDeleteSuccess('hủy xác minh người bán thành công!');
    } else {
      setDeleteError(result || 'Lỗi hủy xác minh người bán');
    }
  };

  const handleView = (customer: any) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'verified' && customer.enabled) ||
      (selectedStatus === 'pending' && !customer.enabled);

    return matchesStatus;
  });

  return (
    <div className="space-y-6">
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

      <CustomerStats customers={customers} />

      <AdvancedFilters
        searchQuery={searchQuery}
        onSearch={handleSearch}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <Card className="p-6">
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Đang tải ...</span>
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mb-4" />
              <p>Không tìm thấy người bán</p>
              <p className="text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Họ</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id}</TableCell>

                    <TableCell className="font-medium">{customer.firstName}</TableCell>
                    <TableCell>{customer.lastName}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{customer.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{customer.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[String(customer.enabled)]}`}
                      >
                        {statusLabels[String(customer.enabled)]}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleView(customer)}>
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {!loading && customers.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {customers.length} người bán trên trang {page} / {maxPage} (Tổng cộng{' '}
              {totalCustomers} người bán)
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

      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCustomer(null);
        }}
        onVerify={async (id: string) => {
          const result = await handleUnbanCustomer(id);
          if (result) setDeleteSuccess('Xác minh người bán thành công!');
          else setDeleteError(result || 'Lỗi xác minh người bán');
          setIsDetailModalOpen(false);
          setSelectedCustomer(null);
          refetch();
        }}
        onReject={async (id: string) => {
          const result = await handleBanCustomer(id);
          if (result) setDeleteSuccess('Hủy xác minh người bán thành công!');
          else setDeleteError(result || 'Lỗi hủy xác minh người bán');
          setIsDetailModalOpen(false);
          setSelectedCustomer(null);
          refetch();
        }}
      />
    </div>
  );
}
