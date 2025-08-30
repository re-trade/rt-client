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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useSellerManager } from '@/hooks/use-seller-manager';
import { approveSeller, getIdCardImage, TSellerProfile } from '@/services/seller.api';
import {
  AlertCircle,
  AlertTriangle,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  ExternalLink,
  Eye,
  Filter,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  RefreshCw,
  Search,
  Shield,
  ShieldOff,
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

// AdvancedFilters component (updated to match customer styling)
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

// Warning Dialog for ID Card (unchanged)
const IdCardWarningDialog = ({
  isOpen,
  onClose,
  onConfirm,
  cardType,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cardType: 'FRONT' | 'BACK';
}) => {
  const getCardTypeText = (type: 'FRONT' | 'BACK') => {
    return type === 'FRONT' ? 'Mặt trước' : 'Mặt sau';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="h-5 w-5" />
            Cảnh báo bảo mật
          </DialogTitle>
          <DialogDescription>
            Bạn sắp xem hình ảnh CCCD {getCardTypeText(cardType)} của người bán. Đây là thông tin
            nhạy cảm và được bảo vệ theo quy định pháp luật.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">Lưu ý quan trọng:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Không được phép tải xuống, sao chép hoặc chia sẻ hình ảnh CCCD</li>
                  <li>• Chỉ xem để mục đích xác minh danh tính người bán</li>
                  <li>• Tuân thủ quy định bảo mật thông tin cá nhân</li>
                  <li>• Hành vi vi phạm sẽ bị xử lý theo quy định pháp luật</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={onConfirm} className="bg-yellow-600 hover:bg-yellow-700">
              Tôi hiểu và muốn xem
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ID Card Image Modal (unchanged)
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
      <DialogContent
        className="max-w-2xl"
        onContextMenu={(e) => e.preventDefault()}
        style={{ userSelect: 'none' }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            CCCD - {getCardTypeText(cardType)}
          </DialogTitle>
          <DialogDescription>
            Hình ảnh CCCD của người bán - Chỉ xem để xác minh danh tính
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {imageUrl ? (
            <>
              <div
                className="relative w-full max-h-[500px] overflow-hidden rounded-lg border"
                onContextMenu={(e) => e.preventDefault()}
                style={{ userSelect: 'none' }}
              >
                <img
                  src={imageUrl}
                  alt={`CCCD ${getCardTypeText(cardType)}`}
                  className="w-full h-auto object-contain"
                  style={{
                    userSelect: 'none',
                    pointerEvents: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                      <p className="font-medium mb-1">Thông tin bảo mật:</p>
                      <p>
                        Hình ảnh CCCD được hiển thị chỉ để xác minh danh tính. Vui lòng tuân thủ quy
                        định bảo mật thông tin cá nhân.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>
                    Đóng
                  </Button>
                </div>
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

// Confirmation Dialog (unchanged)
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

// SellerDetailModal (updated styling to match customer)
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
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<'FRONT' | 'BACK'>('FRONT');
  const [isLoadingIdCard, setIsLoadingIdCard] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [showFallbackAvatar, setShowFallbackAvatar] = useState(false);

  if (!seller) return null;

  const getStatusText = (status: boolean) => {
    return status ? 'Đã xác minh' : 'Chờ duyệt';
  };

  const getIdentityStatusText = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'Đã xác minh';
      case 'WAITING':
        return 'Chờ xác minh';
      case 'FAILED':
        return 'Xác minh thất bại';
      case 'INIT':
        return 'Chưa bắt đầu';
      case 'PENDING':
        return 'Đang chờ xác minh';
      case 'REJECTED':
        return 'Bị từ chối';
      case 'UNVERIFIED':
        return 'Chưa xác minh';
      default:
        return 'Chưa xác minh';
    }
  };

  const getIdentityStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'UNVERIFIED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewIdCard = async (cardType: 'FRONT' | 'BACK') => {
    setSelectedCardType(cardType);
    setIsWarningDialogOpen(true);
  };

  const handleConfirmViewIdCard = async () => {
    setIsLoadingIdCard(true);
    setIsWarningDialogOpen(false);

    try {
      const imageUrl = await getIdCardImage(seller.id, selectedCardType);
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
        <DialogContent className="max-w-[90vw] sm:max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6 border-b">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Store className="h-6 w-6 text-blue-600" />
              </div>
              Thông tin chi tiết người bán
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Xem và quản lý thông tin chi tiết của người bán
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-8 py-6">
            {/* Avatar và thông tin cơ bản */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                {seller.avatarUrl && !showFallbackAvatar ? (
                  <img
                    src={seller.avatarUrl}
                    alt={`${seller.shopName}'s avatar`}
                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={() => setShowFallbackAvatar(true)}
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-lg">
                    <Store className="h-16 w-16 text-blue-500" />
                  </div>
                )}
                <Badge
                  className={`absolute -bottom-2 -right-2 px-3 py-1 ${
                    seller.verified
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {getStatusText(seller.verified)}
                </Badge>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{seller.shopName}</h2>
                <p className="text-gray-500">ID: {seller.id}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Thông tin cửa hàng */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  Thông tin cửa hàng
                </h3>
                <div className="space-y-5">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-gray-600">Tên cửa hàng:</p>
                      <p className="text-gray-900 font-semibold text-lg">{seller.shopName}</p>
                    </div>
                  </div>
                  {seller.description && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Mô tả:</p>
                        <p className="text-gray-900 text-sm leading-relaxed">
                          {seller.description}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                      <div className="p-2 bg-gray-500 rounded-lg">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      Ngày khởi tạo và cập nhật
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Ngày tạo:</p>
                          <p className="text-gray-900 font-medium">
                            {new Date(seller.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(seller.createdAt).toLocaleTimeString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Cập nhật lần cuối:</p>
                          <p className="text-gray-900 font-medium">
                            {new Date(seller.updatedAt).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(seller.updatedAt).toLocaleTimeString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Thông tin liên hệ */}
              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  Thông tin liên hệ
                </h3>

                <div className="space-y-5">
                  {/* Email */}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-600">Email:</p>
                      <p className="text-gray-900 font-medium">{seller.email}</p>
                    </div>
                  </div>

                  {/* Số điện thoại */}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-600">Số điện thoại:</p>
                      <p className="text-gray-900 font-medium">{seller.phoneNumber}</p>
                    </div>
                  </div>

                  {/* Địa chỉ */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-base">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      Địa chỉ
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs font-medium text-gray-600">Địa chỉ chi tiết:</p>
                        <p className="text-gray-900 text-sm">{seller.addressLine}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs font-medium text-gray-600">Phường/Xã:</p>
                        <p className="text-gray-900 text-sm">{seller.ward}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs font-medium text-gray-600">Quận/Huyện:</p>
                        <p className="text-gray-900 text-sm">{seller.district}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs font-medium text-gray-600">Tỉnh/Thành phố:</p>
                        <p className="text-gray-900 text-sm">{seller.state}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Verification Status */}
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                Trạng thái xác minh
              </h3>
              <div className="space-y-4 ">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-gray-600" />
                      <p className="text-sm font-medium text-gray-600">Trạng thái cửa hàng:</p>
                    </div>
                    <Badge
                      className={`${
                        seller.verified
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-orange-100 text-orange-800 border-orange-200'
                      } font-medium`}
                      variant="outline"
                    >
                      {getStatusText(seller.verified)}
                    </Badge>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <p className="text-sm font-medium text-gray-600">Trạng thái CCCD:</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${getIdentityStatusColor(seller.identityVerifiedStatus)} font-medium`}
                        variant="outline"
                      >
                        {getIdentityStatusText(seller.identityVerifiedStatus)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewIdCard('FRONT')}
                        disabled={isLoadingIdCard}
                        className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Xem mặt trước
                        {isLoadingIdCard && selectedCardType === 'FRONT' && (
                          <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewIdCard('BACK')}
                        disabled={isLoadingIdCard}
                        className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Xem mặt sau
                        {isLoadingIdCard && selectedCardType === 'BACK' && (
                          <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Separator />

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="outline" onClick={onClose} className="px-6 bg-transparent">
              Đóng
            </Button>
            {seller.verified ? (
              <Button
                variant="destructive"
                onClick={() => handleApproveAction('reject')}
                disabled={isLoadingAction}
                className="bg-red-600 hover:bg-red-700 px-6"
              >
                {isLoadingAction ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ShieldOff className="h-4 w-4 mr-2" />
                )}
                Vô hiệu hóa người bán
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => handleApproveAction('approve')}
                disabled={isLoadingAction}
                className="bg-green-600 hover:bg-green-700 px-6"
              >
                {isLoadingAction ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4 mr-2" />
                )}
                Duyệt người bán
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ID Card Warning Dialog */}
      <IdCardWarningDialog
        isOpen={isWarningDialogOpen}
        onClose={() => setIsWarningDialogOpen(false)}
        onConfirm={handleConfirmViewIdCard}
        cardType={selectedCardType}
      />

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

  const handleRefresh = () => {
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    goToPage(newPage, searchQuery);
  };

  const handleVerify = async (sellerId: string) => {
    try {
      const result = await handleUnbanSeller(sellerId);
      if (result) {
        toast.success('Xác minh người bán thành công!', { position: 'top-right' });
        setDeleteSuccess('Xác minh người bán thành công!');
      } else {
        toast.error('Lỗi xác minh người bán', { position: 'top-right' });
        setDeleteError('Lỗi xác minh người bán');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Lỗi xác minh người bán';
      toast.error(errorMessage, { position: 'top-right' });
      setDeleteError(errorMessage);
    }
  };

  const handleReject = async (sellerId: string) => {
    try {
      const result = await handleBanSeller(sellerId);
      if (result) {
        toast.success('Hủy xác minh người bán thành công!', { position: 'top-right' });
        setDeleteSuccess('Hủy xác minh người bán thành công!');
      } else {
        toast.error(result || 'Lỗi hủy xác minh người bán', { position: 'top-right' });
        setDeleteError(result || 'Lỗi hủy xác minh người bán');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Lỗi hủy xác minh người bán';
      toast.error(errorMessage, { position: 'top-right' });
      setDeleteError(errorMessage);
    }
  };

  const handleView = (seller: TSellerProfile) => {
    setSelectedSeller(seller);
    setIsDetailModalOpen(true);
  };

  // Apply filters
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

        {/* Seller Table */}
        <Card className="shadow-sm border-0 bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Danh sách người bán ({filteredSellers.length})
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : sellers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Store className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy người bán</h3>
                <p className="text-gray-500">Thử điều chỉnh bộ lọc hoặc tìm kiếm để xem kết quả</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">ID</TableHead>
                        <TableHead className="font-semibold text-gray-900">Cửa hàng</TableHead>
                        <TableHead className="font-semibold text-gray-900">Liên hệ</TableHead>
                        <TableHead className="font-semibold text-gray-900">Địa chỉ</TableHead>
                        <TableHead className="font-semibold text-gray-900">Trạng thái</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-right">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredSellers.map((seller, index) => (
                        <TableRow
                          key={seller.id}
                          className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                          }`}
                          onClick={() => window.open(`/dashboard/seller/${seller.id}`, '_blank')}
                        >
                          <TableCell className="font-mono text-sm text-gray-600">
                            {seller.id.slice(0, 8)}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-3">
                              {seller.avatarUrl ? (
                                <img
                                  src={seller.avatarUrl}
                                  alt={`${seller.shopName}'s avatar`}
                                  className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div
                                className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm"
                                style={{ display: seller.avatarUrl ? 'none' : 'flex' }}
                              >
                                <Store className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{seller.shopName}</p>
                                <p className="text-xs text-gray-500">
                                  {seller.businessType || 'Chưa phân loại'}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-900">{seller.phoneNumber}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-600">{seller.email}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="max-w-48">
                              <p className="text-sm text-gray-900 truncate">{seller.addressLine}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {seller.ward}, {seller.district}, {seller.state}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge
                              className={`${
                                seller.verified
                                  ? 'bg-green-100 text-green-800 border-green-200'
                                  : 'bg-orange-100 text-orange-800 border-orange-200'
                              } font-medium`}
                              variant="outline"
                            >
                              {seller.verified ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Đã xác minh
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Chờ duyệt
                                </div>
                              )}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-gray-100"
                                  title="Thao tác"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleView(seller);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Xem chi tiết (Modal)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`/dashboard/seller/${seller.id}`, '_blank');
                                  }}
                                  className="cursor-pointer"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Mở trang chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Add verification logic here
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Xác minh tài khoản
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Add ban logic here
                                  }}
                                  className="cursor-pointer text-red-600 focus:text-red-600"
                                >
                                  <ShieldOff className="h-4 w-4 mr-2" />
                                  Khóa tài khoản
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {!loading && sellers.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Hiển thị <span className="font-medium">{sellers.length}</span> người bán
                        trên trang <span className="font-medium">{page}</span> /{' '}
                        <span className="font-medium">{maxPage}</span> (Tổng cộng{' '}
                        <span className="font-medium">{totalSellers}</span> người bán)
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
                                className={`w-10 h-8 ${
                                  page === pageNum
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
