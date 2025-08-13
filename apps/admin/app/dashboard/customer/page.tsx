'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { useCustomerManager } from '@/hooks/use-customer-manager';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Eye,
  Filter,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Shield,
  ShieldOff,
  User,
  UserCheck,
  Users,
  UserX,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const CustomerStats = ({ customers }: { customers: any[] }) => {
  const totalCustomers = customers.length;
  const verifiedCustomers = customers.filter((p) => p.enabled).length;
  const blockedCustomers = customers.filter((p) => !p.enabled).length;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700 mb-1">Tổng số khách hàng</p>
            <p className="text-3xl font-bold text-blue-900">{totalCustomers}</p>
            <p className="text-xs text-blue-600 mt-1">Tất cả người dùng</p>
          </div>
          <div className="p-3 bg-blue-500 rounded-full">
            <Users className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-700 mb-1">Đang hoạt động</p>
            <p className="text-3xl font-bold text-green-900">{verifiedCustomers}</p>
            <p className="text-xs text-green-600 mt-1">Tài khoản bình thường</p>
          </div>
          <div className="p-3 bg-green-500 rounded-full">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-700 mb-1">Bị khóa</p>
            <p className="text-3xl font-bold text-red-900">{blockedCustomers}</p>
            <p className="text-xs text-red-600 mt-1">Tài khoản bị vô hiệu</p>
          </div>
          <div className="p-3 bg-red-500 rounded-full">
            <UserX className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>
    </div>
  );
};

const AdvancedFilters = ({
  searchQuery,
  onSearch,
  selectedStatus,
  setSelectedStatus,
  selectedGender,
  setSelectedGender,
  updatedAfter,
  setUpdatedAfter,
}: {
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
  updatedAfter: string;
  setUpdatedAfter: (date: string) => void;
}) => {
  const handleClearFilters = () => {
    onSearch('');
    setSelectedStatus('all');
    setSelectedGender('all');
    setUpdatedAfter('');
  };

  const activeFiltersCount = [
    searchQuery,
    selectedStatus !== 'all' ? selectedStatus : '',
    selectedGender !== 'all' ? selectedGender : '',
    updatedAfter,
  ].filter(Boolean).length;

  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Filter className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Bộ lọc nâng cao</h3>
            <p className="text-sm text-gray-500">
              {activeFiltersCount > 0
                ? `${activeFiltersCount} bộ lọc đang áp dụng`
                : 'Không có bộ lọc nào'}
            </p>
          </div>
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tìm kiếm</label>
          <Input
            placeholder="Tên, email, số điện thoại..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="border-gray-200 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Trạng thái tài khoản</label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="border-gray-200 focus:border-blue-500">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="verified">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Đang hoạt động
                </div>
              </SelectItem>
              <SelectItem value="pending">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Bị khóa
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Giới tính</label>
          <Select value={selectedGender} onValueChange={setSelectedGender}>
            <SelectTrigger className="border-gray-200 focus:border-blue-500">
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả giới tính</SelectItem>
              <SelectItem value="0">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  Nam
                </div>
              </SelectItem>
              <SelectItem value="1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-pink-500" />
                  Nữ
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Cập nhật sau ngày</label>
          <Input
            type="date"
            value={updatedAfter}
            onChange={(e) => setUpdatedAfter(e.target.value)}
            className="border-gray-200 focus:border-blue-500"
          />
        </div>
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

  const isEnabled = customer.enabled;
  const getCustomerInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            Thông tin chi tiết khách hàng
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Xem và quản lý thông tin chi tiết của khách hàng
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-8 py-6">
          {/* Avatar và thông tin cơ bản */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              {customer.avatarUrl ? (
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarFallback className='text-5xl font-medium bg-orange-500 text-white'>
                    {getCustomerInitials(customer.firstName + ' ' + customer.lastName)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-lg">
                  <User className="h-16 w-16 text-blue-500" />
                </div>
              )}
              <Badge
                className={`absolute -bottom-2 -right-2 px-3 py-1 ${isEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
              >
                {isEnabled ? 'Hoạt động' : 'Bị khóa'}
              </Badge>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {customer.shopName || `${customer.firstName} ${customer.lastName}`}
              </h2>
              <p className="text-gray-500">ID: {customer.id}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Thông tin cá nhân - Enhanced layout */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                Thông tin cá nhân
              </h3>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-600 mb-1">Họ</p>
                    <p className="text-gray-900 font-semibold text-lg">{customer.firstName}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-600 mb-1">Tên</p>
                    <p className="text-gray-900 font-semibold text-lg">{customer.lastName}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-600 mb-2">Giới tính</p>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {customer.gender === '0' ? '👨 Nam' : '👩 Nữ'}
                  </Badge>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-600 mb-1">Ngày sinh</p>
                  <p className="text-gray-900 font-semibold">{customer.dob}</p>
                </div>
              </div>
            </Card>

            {/* Thông tin liên hệ - Enhanced with better icons */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                Thông tin liên hệ
              </h3>
              <div className="space-y-5">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Email: </p>
                    <p className="text-gray-900 font-medium">{customer.email}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Số điện thoại</p>
                  </div>
                  <p className="text-gray-900 font-medium ml-11">
                    {customer.phoneNumber || customer.phone}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <MapPin className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Địa chỉ</p>
                  </div>
                  <p className="text-gray-900 font-medium ml-11">
                    {customer.address || 'Không có thông tin'}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Mô tả */}
          {customer.description && (
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Mô tả thêm</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-700 leading-relaxed">{customer.description}</p>
              </div>
            </Card>
          )}
        </div>

        <Separator />

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <Button variant="outline" onClick={onClose} className="px-6 bg-transparent">
            Đóng
          </Button>
          {isEnabled ? (
            <Button
              variant="destructive"
              onClick={() => onReject && onReject(customer.id)}
              className="bg-red-600 hover:bg-red-700 px-6"
            >
              <ShieldOff className="h-4 w-4 mr-2" />
              Vô hiệu hóa tài khoản
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={() => onVerify && onVerify(customer.id)}
              className="bg-green-600 hover:bg-green-700 px-6"
            >
              <Shield className="h-4 w-4 mr-2" />
              Kích hoạt tài khoản
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default function CustomerManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [updatedAfter, setUpdatedAfter] = useState<string>('');
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

  const handlePageChange = (newPage: number) => {
    goToPage(newPage, searchQuery);
  };

    const getCustomerInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleVerify = async (customerId: string) => {
    try {
      const result = await handleUnbanCustomer(customerId);
      if (result) {
        toast.success('Kích hoạt tài khoản thành công!', { position: 'top-right' });
        setDeleteSuccess('Kích hoạt tài khoản thành công!');
      } else {
        toast.error('Lỗi kích hoạt tài khoản', { position: 'top-right' });
        setDeleteError('Lỗi kích hoạt tài khoản');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Lỗi kích hoạt tài khoản';
      toast.error(errorMessage, { position: 'top-right' });
      setDeleteError(errorMessage);
    }
  };

  const handleReject = async (customerId: string) => {
    try {
      const result = await handleBanCustomer(customerId);
      if (result) {
        toast.success('Vô hiệu hóa tài khoản thành công!', { position: 'top-right' });
        setDeleteSuccess('Vô hiệu hóa tài khoản thành công!');
      } else {
        toast.error(result || 'Lỗi vô hiệu hóa tài khoản', { position: 'top-right' });
        setDeleteError(result || 'Lỗi vô hiệu hóa tài khoản');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Lỗi vô hiệu hóa tài khoản';
      toast.error(errorMessage, { position: 'top-right' });
      setDeleteError(errorMessage);
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

    const normalizedGender = String(customer.gender);
    const matchesGender = selectedGender === 'all' || normalizedGender === selectedGender;

    const customerLastUpdate = new Date(customer.lastUpdate);
    const matchesLastUpdate = !updatedAfter || customerLastUpdate > new Date(updatedAfter);

    return matchesStatus && matchesGender && matchesLastUpdate;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý khách hàng</h1>
              <p className="text-gray-600 mt-2">Theo dõi và quản lý thông tin khách hàng của bạn</p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {deleteSuccess && (
          <Card className="p-4 border-green-200 bg-green-50 shadow-sm">
            <div className="flex items-center gap-3 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <div className="flex-1">
                <span className="font-medium">Thành công!</span> {deleteSuccess}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteSuccess(null)}
                className="text-green-600 hover:text-green-700"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Error Message */}
        {(error || deleteError) && (
          <Card className="p-4 border-red-200 bg-red-50 shadow-sm">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <div className="flex-1">
                <span className="font-medium">Có lỗi xảy ra!</span> {error || deleteError}
                {(error || deleteError)?.includes('đăng nhập') && (
                  <div className="mt-2 text-sm">
                    <p>
                      Vui lòng đảm bảo bạn đã đăng nhập với tài khoản admin và có quyền thực hiện
                      thao tác này.
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
                onClick={() => setDeleteError(null)}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Stats */}
        <CustomerStats customers={customers} />

        {/* Filters */}
        <AdvancedFilters
          searchQuery={searchQuery}
          onSearch={handleSearch}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          updatedAfter={updatedAfter}
          setUpdatedAfter={setUpdatedAfter}
        />

        {/* Customer Table */}
        <Card className="shadow-sm border-0 bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Danh sách khách hàng ({filteredCustomers.length})
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : customers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Package className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy khách hàng
                </h3>
                <p className="text-gray-500">Thử điều chỉnh bộ lọc hoặc tìm kiếm để xem kết quả</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">ID</TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Thông tin cá nhân
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">Liên hệ</TableHead>
                        <TableHead className="font-semibold text-gray-900">Địa chỉ</TableHead>
                        <TableHead className="font-semibold text-gray-900">Trạng thái</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-right">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredCustomers.map((customer, index) => (
                        <TableRow
                          key={customer.id}
                          className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                            }`}
                        >
                          <TableCell className="font-mono text-sm text-gray-600">
                            #{customer.id}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-3">
                              {customer.avatarUrl ? (
                                <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                  <AvatarFallback className="text-xs font-medium bg-orange-500 text-white">
                                    {getCustomerInitials(customer.firstName + ' ' + customer.lastName)}
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-500" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {customer.firstName} {customer.lastName}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-900">{customer.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-600">{customer.email}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="max-w-48">
                              <p className="text-sm text-gray-900 truncate">{customer.address}</p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge
                              className={`${customer.enabled
                                  ? 'bg-green-100 text-green-800 border-green-200'
                                  : 'bg-red-100 text-red-800 border-red-200'
                                } font-medium`}
                              variant="outline"
                            >
                              {customer.enabled ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Hoạt động
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <XCircle className="h-3 w-3" />
                                  Bị khóa
                                </div>
                              )}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(customer)}
                              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {!loading && customers.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Hiển thị <span className="font-medium">{customers.length}</span> khách hàng
                        trên trang <span className="font-medium">{page}</span> /{' '}
                        <span className="font-medium">{maxPage}</span> (Tổng cộng{' '}
                        <span className="font-medium">{totalCustomers}</span> khách hàng)
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1}
                          className="flex items-center gap-2"
                        >
                          ← Trang trước
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, maxPage) }, (_, i) => {
                            const pageNum = Math.max(1, Math.min(maxPage - 4, page - 2)) + i;
                            return pageNum <= maxPage ? (
                              <Button
                                key={pageNum}
                                variant={page === pageNum ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-10 h-8 ${page === pageNum
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                              >
                                {pageNum}
                              </Button>
                            ) : null;
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === maxPage}
                          className="flex items-center gap-2"
                        >
                          Trang sau →
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Customer Detail Modal */}
        <CustomerDetailModal
          customer={selectedCustomer}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedCustomer(null);
          }}
          onVerify={async (id: string) => {
            const result = await handleUnbanCustomer(id);
            if (result) {
              toast.success('Kích hoạt tài khoản thành công!', { position: 'top-right' });
              setDeleteSuccess('Kích hoạt tài khoản thành công!');
            } else {
              toast.error(result || 'Lỗi kích hoạt tài khoản', { position: 'top-right' });
              setDeleteError(result || 'Lỗi kích hoạt tài khoản');
            }
            setIsDetailModalOpen(false);
            setSelectedCustomer(null);
            refetch();
          }}
          onReject={async (id: string) => {
            const result = await handleBanCustomer(id);
            if (result) {
              toast.success('Vô hiệu hóa tài khoản thành công!', { position: 'top-right' });
              setDeleteSuccess('Vô hiệu hóa tài khoản thành công!');
            } else {
              toast.error(result || 'Lỗi vô hiệu hóa tài khoản', { position: 'top-right' });
              setDeleteError(result || 'Lỗi vô hiệu hóa tài khoản');
            }
            setIsDetailModalOpen(false);
            setSelectedCustomer(null);
            refetch();
          }}
        />
      </div>
    </div>
  );
}
