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
import { useSellerManager } from '@/hooks/use-seller-manager';
import { TSellerProfile, approveSeller, getIdCardImage } from '@/services/seller.api';
import {
  AlertCircle,
  AlertTriangle,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Eye,
  Filter,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  Shield,
  User,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

const SellerStats = ({ sellers }: { sellers: TSellerProfile[] }) => {
  const totalSellers = sellers.length;
  const verifiedSellers = sellers.filter((p) => p.verified).length;
  const pendingSellers = sellers.filter((p) => !p.verified).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng số người bán</p>
            <p className="text-2xl font-bold">{totalSellers}</p>
          </div>
          <Package className="h-8 w-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã xác minh</p>
            <p className="text-2xl font-bold text-green-600">{verifiedSellers}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đang chờ duyệt</p>
            <p className="text-2xl font-bold text-orange-600">{pendingSellers}</p>
          </div>
          <AlertCircle className="h-8 w-8 text-orange-500" />
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
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
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
            placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
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

        <div className="relative">
          <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            placeholder="Từ ngày"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            placeholder="Đến ngày"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger>
            <SelectValue placeholder="Tỉnh/Thành phố" />
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

        {/* <Select value={sortField} onValueChange={setSortField}>
          <SelectTrigger>
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shopName">Tên người bán</SelectItem>
            <SelectItem value="createdAt">Ngày tạo</SelectItem>
            <SelectItem value="verified">Trạng thái</SelectItem>
          </SelectContent>
        </Select> */}

        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger>
            <SelectValue placeholder="Thứ tự" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Tăng dần</SelectItem>
            <SelectItem value="desc">Giảm dần</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={onClearFilters}>
          Xóa bộ lọc
        </Button>
      </div>
    </Card>
  );
};

const IdCardImageModal = ({
  isOpen,
  onClose,
  imageUrl,
  cardType,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  cardType: 'FRONT' | 'BACK';
}) => {
  const getCardTypeText = (type: 'FRONT' | 'BACK') => {
    return type === 'FRONT' ? 'Mặt trước' : 'Mặt sau';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            CCCD - {getCardTypeText(cardType)}
          </DialogTitle>
          <DialogDescription>Hình ảnh CCCD của người bán</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {imageUrl ? (
            <>
              <div className="relative w-full max-h-[500px] overflow-hidden rounded-lg border">
                <img
                  src={imageUrl}
                  alt={`CCCD ${getCardTypeText(cardType)}`}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = imageUrl;
                    link.download = `cccd-${cardType.toLowerCase()}.jpg`;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Đóng
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Không thể tải hình ảnh CCCD</p>
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = 'Hủy',
  variant = 'default',
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SellerDetailModal = ({
  seller,
  isOpen,
  onClose,
  onVerify,
  onReject,
}: {
  seller: TSellerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (id: string) => void;
  onReject?: (id: string) => void;
}) => {
  const [idCardImageUrl, setIdCardImageUrl] = useState<string | null>(null);
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<'FRONT' | 'BACK'>('FRONT');
  const [isLoadingIdCard, setIsLoadingIdCard] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);

  if (!seller) return null;

  const getStatusText = (status: boolean) => {
    return status ? 'Hoạt động' : 'Không hoạt động';
  };

  const getIdentityStatusText = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'Đã xác minh';
      case 'PENDING':
        return 'Đang chờ xác minh';
      case 'REJECTED':
        return 'Bị từ chối';
      case 'UNVERIFIED':
        return 'Chưa xác minh';
      default:
        return 'Không xác định';
    }
  };

  const getIdentityStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'UNVERIFIED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewIdCard = async (cardType: 'FRONT' | 'BACK') => {
    setIsLoadingIdCard(true);
    setSelectedCardType(cardType);

    try {
      const imageUrl = await getIdCardImage(seller.id, cardType);
      setIdCardImageUrl(imageUrl);
      setIsIdCardModalOpen(true);
    } catch (error) {
      console.error('Error loading ID card image:', error);
    } finally {
      setIsLoadingIdCard(false);
    }
  };

  const handleCloseIdCardModal = () => {
    setIsIdCardModalOpen(false);
    setIdCardImageUrl(null);
  };

  const handleApproveAction = (action: 'approve' | 'reject') => {
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction || !seller) return;

    setIsLoadingAction(true);
    try {
      const result = await approveSeller(seller.id, confirmAction === 'approve', true);

      if (result) {
        if (confirmAction === 'approve') {
          onVerify && onVerify(seller.id);
        } else {
          onReject && onReject(seller.id);
        }
        setShowConfirmDialog(false);
        onClose();
      } else {
        console.error('Failed to update seller status');
      }
    } catch (error) {
      console.error('Error updating seller status:', error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const getConfirmDialogConfig = (action: 'approve' | 'reject') => {
    if (action === 'approve') {
      return {
        title: 'Xác nhận duyệt người bán',
        description: `Bạn có chắc chắn muốn duyệt người bán "${seller.shopName}"? Hành động này sẽ cho phép người bán hoạt động trên hệ thống.`,
        confirmText: 'Duyệt người bán',
        variant: 'default' as const,
      };
    } else {
      return {
        title: 'Xác nhận từ chối người bán',
        description: `Bạn có chắc chắn muốn từ chối người bán "${seller.shopName}"? Hành động này sẽ vô hiệu hóa người bán trên hệ thống.`,
        confirmText: 'Từ chối người bán',
        variant: 'destructive' as const,
      };
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Thông tin chi tiết người bán
            </DialogTitle>
            <DialogDescription>Thông tin đầy đủ về người bán</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            {/* Basic Information */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="font-mono text-sm">{seller.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account ID</p>
                  <p className="font-mono text-sm">{seller.accountId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tên cửa hàng</p>
                  <p className="font-medium">{seller.shopName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Loại kinh doanh</p>
                  <p>{seller.businessType || 'Chưa cập nhật'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
                  <p className="text-sm">{seller.description}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Thông tin liên hệ
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {seller.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {seller.phoneNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Địa chỉ
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
                  <p>{seller.addressLine}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phường/Xã</p>
                  <p>{seller.ward}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quận/Huyện</p>
                  <p>{seller.district}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tỉnh/Thành phố</p>
                  <p>{seller.state}</p>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Trạng thái xác minh
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái cửa hàng</p>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${
                      seller.verified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {getStatusText(seller.verified)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái CCCD</p>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${getIdentityStatusColor(
                      seller.identityVerifiedStatus,
                    )}`}
                  >
                    {getIdentityStatusText(seller.identityVerifiedStatus)}
                  </span>
                </div>
              </div>

              {/* ID Card Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleViewIdCard('FRONT')}
                  disabled={isLoadingIdCard}
                  className="flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Xem CCCD mặt trước
                  {isLoadingIdCard && selectedCardType === 'FRONT' && (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleViewIdCard('BACK')}
                  disabled={isLoadingIdCard}
                  className="flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Xem CCCD mặt sau
                  {isLoadingIdCard && selectedCardType === 'BACK' && (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}
                </Button>
              </div>
            </div>

            {/* Media URLs */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building className="h-5 w-5" />
                Hình ảnh
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avatar</p>
                  {seller.avatarUrl ? (
                    <a
                      href={seller.avatarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      Xem ảnh đại diện
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">Chưa có ảnh đại diện</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ảnh nền</p>
                  {seller.background ? (
                    <a
                      href={seller.background}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      Xem ảnh nền
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">Chưa có ảnh nền</p>
                  )}
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Thông tin thời gian
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                  <p>{new Date(seller.createdAt).toLocaleDateString('vi-VN')}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(seller.createdAt).toLocaleTimeString('vi-VN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                  <p>{new Date(seller.updatedAt).toLocaleDateString('vi-VN')}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(seller.updatedAt).toLocaleTimeString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            {seller.verified ? (
              <Button
                variant="outline"
                className="text-red-600 border-red-600"
                onClick={() => handleApproveAction('reject')}
                disabled={isLoadingAction}
              >
                {isLoadingAction ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Vô hiệu hóa người bán
              </Button>
            ) : (
              <Button
                variant="outline"
                className="text-green-600 border-green-600"
                onClick={() => handleApproveAction('approve')}
                disabled={isLoadingAction}
              >
                {isLoadingAction ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Duyệt người bán
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ID Card Image Modal */}
      <IdCardImageModal
        isOpen={isIdCardModalOpen}
        onClose={handleCloseIdCardModal}
        imageUrl={idCardImageUrl}
        cardType={selectedCardType}
      />

      {/* Confirmation Dialog */}
      {confirmAction && (
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          onClose={() => {
            setShowConfirmDialog(false);
            setConfirmAction(null);
          }}
          onConfirm={handleConfirmAction}
          {...getConfirmDialogConfig(confirmAction)}
        />
      )}
    </>
  );
};

const SellerActions = ({
  seller,
  onVerify,
  onPending,
  onView,
}: {
  seller: TSellerProfile;
  onVerify: (id: string) => void;
  onPending: (id: string) => void;
  onView: (seller: TSellerProfile) => void;
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={() => onView(seller)}>
        <Eye className="h-4 w-4" />
      </Button>

      {!seller.verified && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onVerify(seller.id)}
            className="text-green-600 hover:text-green-700"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPending(seller.id)}
            className="text-red-600 hover:text-red-700"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
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
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleVerify = async (sellerId: string) => {
    const result = await handleUnbanSeller(sellerId);
    if (result) {
      setDeleteSuccess('Xác minh người bán thành công!');
    } else {
      setDeleteError('Lỗi xác minh người bán');
    }
  };

  const handleReject = async (sellerId: string) => {
    const result = await handleBanSeller(sellerId);
    if (result) {
      setDeleteSuccess('Hủy xác minh người bán thành công!');
    } else {
      setDeleteError(result || 'Lỗi hủy xác minh người bán');
    }
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

      const matchesSearch =
        !searchQuery ||
        seller.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.phoneNumber.includes(searchQuery);

      return matchesStatus && matchesState && matchesDate && matchesSearch;
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
    <div className="space-y-6">
      {/* Success and Error Displays */}
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
              onClick={() => setDeleteSuccess(null)}
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
              onClick={() => setDeleteError(null)}
              className="text-red-600 hover:text-red-700"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      <SellerStats sellers={sellers} />

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

      <Card className="p-6">
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Đang tải ...</span>
            </div>
          ) : filteredSellers.length === 0 ? (
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
                  <TableHead>Người bán</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSellers.map((seller) => (
                  <TableRow key={seller.id}>
                    <TableCell
                      className="font-medium w-[150px] max-w-[150px] truncate"
                      title={seller.id}
                    >
                      {seller.id}
                    </TableCell>
                    <TableCell className="font-medium">{seller.shopName}</TableCell>
                    <TableCell>{seller.description}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{seller.addressLine}</div>
                        <div className="text-sm text-muted-foreground">
                          {seller.ward}, {seller.district}, {seller.state}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{seller.phoneNumber}</div>
                        <div className="text-sm text-muted-foreground">{seller.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium whitespace-nowrap ${statusColors[String(seller.verified)]}`}
                      >
                        {statusLabels[String(seller.verified)]}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleView(seller)}>
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {!loading && filteredSellers.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {filteredSellers.length} người bán trên trang {page} / {maxPage} (Tổng cộng{' '}
              {totalSellers} người bán)
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

      <SellerDetailModal
        seller={selectedSeller}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSeller(null);
        }}
        onVerify={async (id: string) => {
          const result = await handleUnbanSeller(id);
          if (result) setDeleteSuccess('Xác minh người bán thành công!');
          else setDeleteError(result || 'Lỗi xác minh người bán');
          setIsDetailModalOpen(false);
          setSelectedSeller(null);
          refetch();
        }}
        onReject={async (id: string) => {
          const result = await handleBanSeller(id);
          if (result) setDeleteSuccess('Hủy xác minh người bán thành công!');
          else setDeleteError(result || 'Lỗi hủy xác minh người bán');
          setIsDetailModalOpen(false);
          setSelectedSeller(null);
          refetch();
        }}
      />
    </div>
  );
}
