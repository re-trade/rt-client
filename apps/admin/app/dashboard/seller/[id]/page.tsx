'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  approveSeller,
  banSeller,
  getIdCardImage,
  getSeller,
  type TSellerProfile,
} from '@/services/seller.api';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Badge,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Store,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function SellerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sellerId = params.id as string;

  const [seller, setSeller] = useState<TSellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idCardImages, setIdCardImages] = useState<{
    front: string | null;
    back: string | null;
  }>({ front: null, back: null });
  const [loadingImages, setLoadingImages] = useState(false);
  const [showIdCardWarning, setShowIdCardWarning] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSellerDetail();
  }, [sellerId]);

  const fetchSellerDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSeller(sellerId);
      if (response.success) {
        setSeller(response.content);
      } else {
        setError('Không thể tải thông tin người bán');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải thông tin người bán');
    } finally {
      setLoading(false);
    }
  };

  const loadIdCardImages = async () => {
    if (!seller) return;

    setShowIdCardWarning(true);
  };

  const confirmLoadImages = async () => {
    if (!seller) return;

    setLoadingImages(true);
    setShowIdCardWarning(false);
    try {
      const [frontImage, backImage] = await Promise.all([
        getIdCardImage(seller.id, 'FRONT'),
        getIdCardImage(seller.id, 'BACK'),
      ]);

      setIdCardImages({
        front: frontImage,
        back: backImage,
      });
      toast.success('Đã tải ảnh CCCD/CMND thành công');
    } catch (err) {
      toast.error('Không thể tải ảnh CCCD/CMND');
    } finally {
      setLoadingImages(false);
    }
  };

  const handleVerifyAccount = async () => {
    if (!seller) return;

    setActionLoading(true);
    try {
      const result = await approveSeller(seller.id, true, false);
      if (result?.success) {
        toast.success('Xác minh tài khoản thành công!');
        await fetchSellerDetail();
      } else {
        toast.error('Không thể xác minh tài khoản');
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi xác minh tài khoản');
    } finally {
      setActionLoading(false);
      setShowVerifyDialog(false);
    }
  };

  const handleRejectAccount = async () => {
    if (!seller) return;

    if (!rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }

    setActionLoading(true);
    try {
      const isIdentityVerified = seller.identityVerifiedStatus === 'VERIFIED';
      const result = await approveSeller(seller.id, false, isIdentityVerified, rejectReason);
      if (result?.success) {
        toast.success('Từ chối người bán thành công!');
        await fetchSellerDetail(); // Refresh data
      } else {
        toast.error('Không thể từ chối người bán');
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi từ chối người bán');
    } finally {
      setActionLoading(false);
      setShowRejectDialog(false);
      setRejectReason('');
    }
  };

  const handleBanAccount = async () => {
    if (!seller) return;

    setActionLoading(true);
    try {
      const result = await banSeller(seller.id);
      if (result?.success) {
        toast.success('Khóa tài khoản thành công!');
        await fetchSellerDetail();
      } else {
        toast.error('Không thể khóa tài khoản');
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi khóa tài khoản');
    } finally {
      setActionLoading(false);
      setShowBanDialog(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  const getVerificationStatus = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return {
          icon: <ShieldCheck className="h-4 w-4" />,
          text: 'Đã xác minh',
          color: 'bg-green-100 text-green-800',
        };
      case 'PENDING':
        return {
          icon: <Clock className="h-4 w-4" />,
          text: 'Chờ xác minh',
          color: 'bg-yellow-100 text-yellow-800',
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="h-4 w-4" />,
          text: 'Bị từ chối',
          color: 'bg-red-100 text-red-800',
        };
      default:
        return {
          icon: <ShieldAlert className="h-4 w-4" />,
          text: 'Chưa xác minh',
          color: 'bg-gray-100 text-gray-800',
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              router.push('/dashboard/seller');
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết người bán</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Có lỗi xảy ra</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSellerDetail}
                className="border-red-200 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const verificationStatus = getVerificationStatus(seller.identityVerifiedStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              router.push('/dashboard/seller');
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết người bán</h1>
            <p className="text-gray-600 mt-1">Thông tin chi tiết và quản lý người bán</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={fetchSellerDetail}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Thao tác
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {!seller.verified ? (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setShowVerifyDialog(true)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Xác minh tài khoản
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Từ chối
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={() => setShowBanDialog(true)}
                >
                  <ShieldOff className="h-4 w-4 mr-2" />
                  Khóa tài khoản
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shop Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-orange-600" />
                Thông tin người bán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
                  {seller.avatarUrl ? (
                    <Image
                      src={seller.avatarUrl}
                      alt={seller.shopName}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{seller.shopName}</h3>
                    {seller.verified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Đã xác minh</span>
                      </>
                    ) : seller.rejectReason ? (
                      <>
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">Đã bị từ chối</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-600">Chờ xác minh</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {seller.description || 'Chưa có mô tả cửa hàng'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Tham gia {formatDate(seller.createdAt)}
                    </div>
                    {seller.businessType && (
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {seller.businessType}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-orange-600" />
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 flex-1 p-2 bg-gray-50 rounded-lg">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{seller.email}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(seller.email, 'email')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 flex-1 p-2 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{seller.phoneNumber}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(seller.phoneNumber, 'số điện thoại')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                <div className="flex items-start gap-2">
                  <div className="flex items-start gap-2 flex-1 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <p>{seller.addressLine}</p>
                      <p className="text-gray-600">
                        {seller.ward}, {seller.district}, {seller.state}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `${seller.addressLine}, ${seller.ward}, ${seller.district}, ${seller.state}`,
                        'địa chỉ',
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identity Verification */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Badge className="h-5 w-5 text-orange-600" />
                  Xác minh danh tính
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadIdCardImages}
                  disabled={loadingImages}
                >
                  {loadingImages ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  Xem CCCD/CMND
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${verificationStatus.color}`}>
                    {verificationStatus.icon}
                  </div>
                  <div>
                    <p className="font-medium">{verificationStatus.text}</p>
                    <p className="text-sm text-gray-600">
                      Cập nhật lần cuối: {formatDate(seller.updatedAt)}
                    </p>
                  </div>
                </div>

                {(idCardImages.front || idCardImages.back) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {idCardImages.front && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mặt trước</label>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={idCardImages.front}
                            alt="CCCD/CMND mặt trước"
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}
                    {idCardImages.back && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mặt sau</label>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={idCardImages.back}
                            alt="CCCD/CMND mặt sau"
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!seller.verified ? (
                <>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setShowVerifyDialog(true)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Xác minh tài khoản
                  </Button>
                  <Button
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    variant="outline"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Từ chối
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  variant="outline"
                  onClick={() => setShowBanDialog(true)}
                >
                  <ShieldOff className="h-4 w-4 mr-2" />
                  Khóa tài khoản
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chi tiết tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ID tài khoản</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {seller.accountId}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(seller.accountId, 'ID tài khoản')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ID người bán</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{seller.id}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(seller.id, 'ID người bán')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Trạng thái</span>
                  <div className="flex items-center gap-1">
                    {seller.verified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Đã xác minh</span>
                      </>
                    ) : seller.rejectReason ? (
                      <>
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">Đã bị từ chối</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-600">Chờ xác minh</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ngày tạo</span>
                  <span className="text-sm">{formatDate(seller.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cập nhật cuối</span>
                  <span className="text-sm">{formatDate(seller.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ID Card Warning Dialog */}
      <Dialog open={showIdCardWarning} onOpenChange={setShowIdCardWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              Cảnh báo bảo mật
            </DialogTitle>
            <DialogDescription className="space-y-2 pt-2">
              <p className="font-medium text-gray-900">
                Bạn sắp xem thông tin nhạy cảm (CCCD/CMND) của người bán.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-2">
                <p className="text-sm text-yellow-800 font-medium">⚠️ LƯU Ý QUAN TRỌNG:</p>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>NGHIÊM CẤM chụp ảnh, screenshot hoặc lưu trữ hình ảnh</li>
                  <li>Chỉ được xem để xác minh danh tính</li>
                  <li>Vi phạm sẽ bị xử lý nghiêm khắc theo quy định</li>
                  <li>Mọi hành động đều được ghi log và giám sát</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                Bằng cách tiếp tục, bạn xác nhận đã hiểu và tuân thủ các quy định trên.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowIdCardWarning(false)}>
              Hủy bỏ
            </Button>
            <Button
              onClick={confirmLoadImages}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Tôi hiểu, tiếp tục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Account Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Shield className="h-5 w-5" />
              Xác minh tài khoản
            </DialogTitle>
            <DialogDescription className="pt-2">
              <p>
                Bạn có chắc chắn muốn xác minh tài khoản của <strong>{seller?.shopName}</strong>?
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Sau khi xác minh, người bán sẽ có thể sử dụng đầy đủ các tính năng của hệ thống.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowVerifyDialog(false)}
              disabled={actionLoading}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleVerifyAccount}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {actionLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Xác minh'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Account Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="text-center pb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Từ chối người bán
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Từ chối duyệt người bán <strong>{seller?.shopName}</strong>
            </DialogDescription>
          </DialogHeader>

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
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ví dụ: Thông tin không chính xác, tài liệu không rõ ràng, vi phạm chính sách..."
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-red-500 resize-none"
              />
              <p className="text-xs text-gray-500">
                Lý do này sẽ được gửi đến người bán để họ có thể khắc phục và nộp lại hồ sơ.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectReason('');
              }}
              disabled={actionLoading}
              className="px-6"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleRejectAccount}
              disabled={actionLoading}
              className="px-6 bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Xác nhận từ chối
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban Account Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <ShieldOff className="h-5 w-5" />
              Khóa tài khoản
            </DialogTitle>
            <DialogDescription className="pt-2">
              <p>
                Bạn có chắc chắn muốn khóa tài khoản của <strong>{seller?.shopName}</strong>?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                <p className="text-sm text-red-800 font-medium">⚠️ Hậu quả:</p>
                <ul className="text-sm text-red-700 mt-1 space-y-1 list-disc list-inside">
                  <li>Người bán sẽ không thể đăng nhập</li>
                  <li>Tất cả sản phẩm sẽ bị ẩn</li>
                  <li>Không thể thực hiện giao dịch</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowBanDialog(false)}
              disabled={actionLoading}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleBanAccount}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {actionLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Khóa tài khoản'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
