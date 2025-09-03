'use client';

import { SellerDetailModal } from '@/components/seller/SellerDetailModal';
import { SellerTable } from '@/components/seller/SellerTable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSellerManager } from '@/hooks/use-seller-manager';
import { TSellerProfile } from '@/services/seller.api';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw,
  Search,
  Store,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// SellerStats component (updated styling)
const SellerStats = ({ sellers }: { sellers: TSellerProfile[] }) => {
  const totalSellers = sellers.length;
  const verifiedSellers = sellers.filter((p) => p.verified).length;
  const pendingSellers = sellers.filter((p) => !p.verified).length;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700 mb-1">Tổng số người bán</p>
            <p className="text-3xl font-bold text-blue-900">{totalSellers}</p>
            <p className="text-xs text-blue-600 mt-1">Tất cả cửa hàng</p>
          </div>
          <div className="p-3 bg-blue-500 rounded-full">
            <Store className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-700 mb-1">Đã xác minh</p>
            <p className="text-3xl font-bold text-green-900">{verifiedSellers}</p>
            <p className="text-xs text-green-600 mt-1">Đang hoạt động</p>
          </div>
          <div className="p-3 bg-green-500 rounded-full">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-700 mb-1">Đang chờ duyệt</p>
            <p className="text-3xl font-bold text-orange-900">{pendingSellers}</p>
            <p className="text-xs text-orange-600 mt-1">Chưa xác minh</p>
          </div>
          <div className="p-3 bg-orange-500 rounded-full">
            <Clock className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>
    </div>
  );
};

const AdvancedFilters = ({
  sellers,
  searchQuery,
  onSearch,
  selectedStatus,
  setSelectedStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedState,
  setSelectedState,
  onClearFilters,
}: {
  sellers: TSellerProfile[];
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  sortField: keyof TSellerProfile;
  setSortField: (field: keyof TSellerProfile) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  onClearFilters: () => void;
}) => {
  const states = Array.from(new Set(sellers.map((seller) => seller.state))).sort();

  const activeFiltersCount = [
    searchQuery,
    selectedStatus !== 'all' ? selectedStatus : '',
    startDate,
    endDate,
    selectedState !== 'all' ? selectedState : '',
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
            onClick={onClearFilters}
            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tìm kiếm</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tên cửa hàng, số điện thoại..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 border-gray-200 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Trạng thái</label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="border-gray-200 focus:border-blue-500">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="verified">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Đã xác minh
                </div>
              </SelectItem>
              <SelectItem value="pending">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  Chờ duyệt
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Từ ngày</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-9 border-gray-200 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Đến ngày</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-9 border-gray-200 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="border-gray-200 focus:border-blue-500">
              <SelectValue placeholder="Chọn tỉnh/thành" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tỉnh/thành</SelectItem>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

export default function SellerManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof TSellerProfile>('shopName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedSeller, setSelectedSeller] = useState<TSellerProfile | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const {
    sellers = [],
    page,
    maxPage,
    totalSellers,
    loading,
    error,
    refetch,
    goToPage,
    searchSellers,
    handleBanSeller,
    handleUnbanSeller,
  } = useSellerManager();

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setStartDate('');
    setEndDate('');
    setSelectedState('all');
    setSortField('shopName');
    setSortOrder('asc');
    searchSellers('');
    goToPage(1, '');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchSellers(query);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    goToPage(newPage, searchQuery);
  };

  const handleView = (seller: TSellerProfile) => {
    setSelectedSeller(seller);
    setIsDetailModalOpen(true);
  };

  const filteredSellers = sellers
    .filter((seller) => {
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'verified' && seller.verified) ||
        (selectedStatus === 'pending' && !seller.verified);

      const matchesState = selectedState === 'all' || seller.state === selectedState;

      const matchesDate =
        (!startDate || new Date(seller.createdAt) >= new Date(startDate)) &&
        (!endDate || new Date(seller.createdAt) <= new Date(endDate));

      return matchesStatus && matchesState && matchesDate;
    })
    .sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (sortField === 'createdAt') {
        return sortOrder === 'asc'
          ? new Date(fieldA as string).getTime() - new Date(fieldB as string).getTime()
          : new Date(fieldB as string).getTime() - new Date(fieldA as string).getTime();
      }
      if (sortField === 'verified') {
        return sortOrder === 'asc'
          ? Number(fieldA) - Number(fieldB)
          : Number(fieldB) - Number(fieldA);
      }
      return sortOrder === 'asc'
        ? String(fieldA).localeCompare(String(fieldB))
        : String(fieldB).localeCompare(String(fieldA));
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý người bán</h1>
              <p className="text-gray-600 mt-2">Theo dõi và quản lý thông tin người bán của bạn</p>
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
        <SellerStats sellers={sellers} />

        {/* Filters */}
        <AdvancedFilters
          sellers={sellers}
          searchQuery={searchQuery}
          onSearch={handleSearch}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onClearFilters={handleClearFilters}
        />

        <SellerTable
          sellers={sellers}
          filteredSellers={filteredSellers}
          loading={loading}
          page={page}
          maxPage={maxPage}
          totalSellers={totalSellers}
          onView={handleView}
          onPageChange={handlePageChange}
          refetch={refetch}
        />

        {/* Seller Detail Modal */}
        <SellerDetailModal
          seller={selectedSeller}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedSeller(null);
          }}
          onVerify={async (id: string) => {
            const result = await handleUnbanSeller(id);
            if (result) {
              toast.success('Xác minh người bán thành công!', { position: 'top-right' });
              setDeleteSuccess('Xác minh người bán thành công!');
            } else {
              toast.error(result || 'Lỗi xác minh người bán', { position: 'top-right' });
              setDeleteError(result || 'Lỗi xác minh người bán');
            }
            setIsDetailModalOpen(false);
            setSelectedSeller(null);
            refetch();
          }}
          onReject={async (id: string) => {
            const result = await handleBanSeller(id);
            if (result) {
              toast.success('Hủy xác minh người bán thành công!', { position: 'top-right' });
              setDeleteSuccess('Hủy xác minh người bán thành công!');
            } else {
              toast.error(result || 'Lỗi hủy xác minh người bán', { position: 'top-right' });
              setDeleteError(result || 'Lỗi hủy xác minh người bán');
            }
            setIsDetailModalOpen(false);
            setSelectedSeller(null);
            refetch();
          }}
        />
      </div>
    </div>
  );
}
