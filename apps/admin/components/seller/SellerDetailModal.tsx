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
import { Separator } from '@/components/ui/separator';
import { TSellerProfile, approveSeller, getIdCardImage } from '@/services/seller.api';
import {
  AlertCircle,
  AlertTriangle,
  Building,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Shield,
  ShieldOff,
  Store,
} from 'lucide-react';
import { useState } from 'react';

interface SellerDetailModalProps {
  seller: TSellerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (id: string) => void;
  onReject?: (id: string) => void;
}

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Cảnh báo bảo mật
          </DialogTitle>
          <DialogDescription>
            Bạn sắp xem thông tin CCCD - {cardType === 'FRONT' ? 'Mặt trước' : 'Mặt sau'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Thông tin CCCD là dữ liệu cá nhân nhạy cảm</li>
                  <li>Chỉ xem để mục đích xác minh danh tính</li>
                  <li>Không được chụp màn hình hoặc chia sẻ</li>
                  <li>Tuân thủ quy định bảo vệ dữ liệu cá nhân</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={onConfirm} className="bg-yellow-600 hover:bg-yellow-700">
            Tôi hiểu, tiếp tục
          </Button>
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
  action,
  reason,
  onReasonChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  action?: 'approve' | 'reject';
  reason?: string;
  onReasonChange?: (value: string) => void;
}) => {
  const handleConfirm = () => {
    if (action === 'reject' && !reason?.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-center pb-6">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              action === 'approve'
                ? 'bg-gradient-to-br from-green-100 to-green-200'
                : 'bg-gradient-to-br from-red-100 to-red-200'
            }`}
          >
            {action === 'approve' ? (
              <Shield className="h-8 w-8 text-green-600" />
            ) : (
              <ShieldOff className="h-8 w-8 text-red-600" />
            )}
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">{title}</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">{description}</DialogDescription>
        </DialogHeader>

        {action === 'reject' && (
          <div className="mb-6">
            <div className="text-center mb-4">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Lý do từ chối</h3>
              <p className="text-gray-600 text-sm">
                Vui lòng cho biết lý do tại sao bạn từ chối duyệt người bán này
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason || ''}
                onChange={(e) => onReasonChange?.(e.target.value)}
                placeholder="Ví dụ: Thông tin không chính xác, tài liệu không rõ ràng, vi phạm chính sách..."
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-red-500 resize-none"
              />
              <p className="text-xs text-gray-500">
                Lý do này sẽ được gửi đến người bán để họ có thể khắc phục và nộp lại hồ sơ.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="px-6">
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            className={`px-6 ${
              action === 'approve'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {action === 'approve' ? (
              <>
                <Shield className="h-4 w-4 mr-2" />
                {confirmText}
              </>
            ) : (
              <>
                <ShieldOff className="h-4 w-4 mr-2" />
                Xác nhận từ chối
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const SellerDetailModal = ({
  seller,
  isOpen,
  onClose,
  onVerify,
  onReject,
}: SellerDetailModalProps) => {
  const [idCardImageUrl, setIdCardImageUrl] = useState<string | null>(null);
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<'FRONT' | 'BACK'>('FRONT');
  const [isLoadingIdCard, setIsLoadingIdCard] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [showFallbackAvatar, setShowFallbackAvatar] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

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
      default:
        return 'Chưa xác minh';
    }
  };

  const getIdentityStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'WAITING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'INIT':
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
      const isIdentityVerified = seller.identityVerifiedStatus === 'VERIFIED';
      const result = await approveSeller(
        seller.id,
        confirmAction === 'approve',
        confirmAction === 'approve' ? false : isIdentityVerified, // Pass false to force when approving
        confirmAction === 'reject' ? rejectReason : undefined,
      );

      if (result && result.success) {
        if (confirmAction === 'approve') {
          onVerify && onVerify(seller.id);
        } else {
          onReject && onReject(seller.id);
        }
        setShowConfirmDialog(false);
        setRejectReason('');
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
                      <p className="text-sm font-medium text-gray-600">Email:</p>
                      <p className="text-gray-900 font-medium">{seller.email}</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-600">Số điện thoại:</p>
                      <p className="text-gray-900 font-medium">{seller.phoneNumber}</p>
                    </div>
                  </div>

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
              <>
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
                  Từ chối
                </Button>
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
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <IdCardWarningDialog
        isOpen={isWarningDialogOpen}
        onClose={() => setIsWarningDialogOpen(false)}
        onConfirm={handleConfirmViewIdCard}
        cardType={selectedCardType}
      />

      <IdCardImageModal
        isOpen={isIdCardModalOpen}
        onClose={handleCloseIdCardModal}
        imageUrl={idCardImageUrl}
        cardType={selectedCardType}
      />

      {confirmAction && (
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          onClose={() => {
            setShowConfirmDialog(false);
            setConfirmAction(null);
            setRejectReason('');
          }}
          onConfirm={handleConfirmAction}
          action={confirmAction}
          reason={rejectReason}
          onReasonChange={setRejectReason}
          {...getConfirmDialogConfig(confirmAction)}
        />
      )}
    </>
  );
};
