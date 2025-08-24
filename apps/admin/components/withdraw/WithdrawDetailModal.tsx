'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { TWithdrawDetail, TWithdrawListItem } from '@/services/withdraw.api';
import {
  AlertTriangle,
  Badge,
  Building,
  Check,
  CreditCard,
  Eye,
  Landmark,
  PauseCircle,
  Search,
  Store,
  User,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const formatVietnameseDate = (dateInput: any): string => {
  if (!dateInput) return 'N/A';

  let date: Date;
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return 'Invalid Date';
  }

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface WithdrawDetailModalProps {
  withdraw: TWithdrawListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (withdrawId: string, imageReview?: File) => Promise<boolean>;
  onReject: (withdrawId: string, rejectReason: string) => Promise<boolean>;
  fetchWithdrawQr: (withdrawId: string) => Promise<Blob | null>;
  fetchWithdrawDetail?: (withdrawId: string) => Promise<TWithdrawDetail | null>;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export default function WithdrawDetailModal({
  withdraw,
  isOpen,
  onClose,
  onApprove,
  onReject,
  fetchWithdrawQr,
  fetchWithdrawDetail,
  isApproving = false,
  isRejecting = false,
}: WithdrawDetailModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'details' | 'approve' | 'reject'>('details');
  const [withdrawDetails, setWithdrawDetails] = useState<TWithdrawDetail | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const loadWithdrawDetails = useCallback(async () => {
    if (!withdraw) return;

    if (fetchWithdrawDetail) {
      try {
        const details = await fetchWithdrawDetail(withdraw.id);
        if (details) {
          setWithdrawDetails(details);
        } else {
          setWithdrawDetails(null);
        }
      } catch (err) {
        setWithdrawDetails(null);
      }
    }
  }, [withdraw, fetchWithdrawDetail]);

  const loadQrCode = useCallback(async () => {
    if (withdraw && withdraw.status !== '0' && withdraw.status !== 'COMPLETED') {
      try {
        const qrBlob = await fetchWithdrawQr(withdraw.id);
        if (!qrBlob) {
          throw new Error('Không nhận được dữ liệu mã QR');
        }
        const url = URL.createObjectURL(qrBlob);
        setQrCodeUrl(url);
      } catch (err: any) {
        setQrError(err.message || 'Không thể tải mã QR');
      }
    }
  }, [withdraw, fetchWithdrawQr]);

  useEffect(() => {
    if (isOpen && withdraw) {
      setCurrentStep('details');
      setQrCodeUrl(null);
      setQrError(null);
      setSelectedFile(null);
      setFilePreview(null);
      setRejectReason('');
      setWithdrawDetails(null);
      loadWithdrawDetails();
      loadQrCode();
    }

    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [isOpen, withdraw, loadQrCode, loadWithdrawDetails]);

  const handleDialogClose = () => {
    if (qrCodeUrl) {
      URL.revokeObjectURL(qrCodeUrl);
      setQrCodeUrl(null);
    }
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    setQrError(null);
    setSelectedFile(null);
    setRejectReason('');
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApproveSubmit = async () => {
    if (!withdraw || !selectedFile) return;

    const success = await onApprove(withdraw.id, selectedFile);
    if (success) {
      handleDialogClose();
    }
  };

  const handleRejectSubmit = async () => {
    if (!withdraw || !rejectReason.trim()) return;

    const success = await onReject(withdraw.id, rejectReason);
    if (success) {
      handleDialogClose();
    }
  };

  if (!withdraw) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-[90%] md:max-w-[80%] lg:max-w-[1000px] xl:max-w-[1200px] w-full max-h-[95vh] overflow-y-auto bg-white rounded-xl">
        <DialogHeader className="space-y-4 pb-8 border-b border-orange-100">
          <DialogTitle className="text-4xl font-extrabold text-slate-800 flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <Store className="w-7 h-7 text-white" />
            </div>
            Chi tiết yêu cầu rút tiền
          </DialogTitle>
          <DialogDescription className="text-xl text-slate-500 pl-1">
            Thông tin chi tiết và trạng thái của yêu cầu rút tiền
          </DialogDescription>
        </DialogHeader>

        {(withdrawDetails?.status || withdraw?.status) === 'PENDING' && (
          <div className="flex justify-center mb-12 pt-6">
            <div className="flex items-center space-x-3 bg-slate-100 p-2 rounded-full">
              <div
                className={`p-4 rounded-full cursor-pointer transition-all duration-200 flex items-center gap-2 ${
                  currentStep === 'details'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
                onClick={() => currentStep !== 'details' && setCurrentStep('details')}
              >
                <Eye className="h-5 w-5" />
                <span className="font-medium">Chi tiết</span>
              </div>
              <div className="h-0.5 w-10 bg-slate-300"></div>
              <div
                className={`p-4 rounded-full cursor-pointer transition-all duration-200 flex items-center gap-2 ${
                  currentStep === 'approve'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
                onClick={() => currentStep !== 'approve' && setCurrentStep('approve')}
              >
                <Check className="h-5 w-5" />
                <span className="font-medium">Duyệt</span>
              </div>
              <div className="h-0.5 w-10 bg-slate-300"></div>
              <div
                className={`p-4 rounded-full cursor-pointer transition-all duration-200 flex items-center gap-2 ${
                  currentStep === 'reject'
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
                onClick={() => currentStep !== 'reject' && setCurrentStep('reject')}
              >
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Từ chối</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-12 pt-6">
          {/* Status and Amount Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-10 bg-gradient-to-br from-orange-50 to-slate-50 rounded-2xl border border-orange-100">
            <div className="flex items-center gap-8 mb-6 md:mb-0">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Store className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-xl font-medium text-slate-600 mb-2">Số tiền yêu cầu</p>
                <div className="flex items-baseline">
                  <p className="text-6xl font-extrabold text-orange-600">
                    {withdrawDetails?.amount?.toLocaleString() ||
                      withdraw?.amount?.toLocaleString() ||
                      '0'}
                  </p>
                  <span className="text-3xl font-bold text-orange-600 ml-2">₫</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Ngày tạo:{' '}
                  {formatVietnameseDate(
                    withdrawDetails?.createdDate || withdraw?.createdDate || '',
                  )}
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xl font-medium text-slate-600 mb-4">Trạng thái hiện tại</p>
              <div
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-xl font-bold ${
                  (withdrawDetails?.status || withdraw?.status) === 'PENDING'
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : (withdrawDetails?.status || withdraw?.status) === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : (withdrawDetails?.status || withdraw?.status) === 'REJECTED'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : (withdrawDetails?.status || withdraw?.status) === 'COMPLETED'
                          ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                          : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                {(withdrawDetails?.status || withdraw?.status) === 'PENDING' && (
                  <>
                    <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
                    <span>⏳ Đang chờ xử lý</span>
                  </>
                )}
                {(withdrawDetails?.status || withdraw?.status) === 'APPROVED' && (
                  <>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span>✅ Đã duyệt yêu cầu</span>
                  </>
                )}
                {(withdrawDetails?.status || withdraw?.status) === 'REJECTED' && (
                  <>
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <span>❌ Đã từ chối</span>
                  </>
                )}
                {(withdrawDetails?.status || withdraw?.status) === 'COMPLETED' && (
                  <>
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span>✅ Đã thanh toán</span>
                  </>
                )}
              </div>
              {withdrawDetails?.processedDate && (
                <p className="text-sm text-orange-500 mt-3">
                  Xử lý lúc: {formatVietnameseDate(withdrawDetails.processedDate)}
                </p>
              )}
            </div>
          </div>

          {currentStep === 'details' && (
            <>
              {/* Request Information */}
              <Card className="border border-orange-200 bg-white overflow-hidden rounded-xl">
                <div className="p-8 border-b border-orange-200 bg-orange-50">
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    Thông tin chi tiết yêu cầu
                  </h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-lg font-medium text-slate-700">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        </div>
                        Mã yêu cầu
                      </div>
                      <div className="flex items-center">
                        <p className="font-mono text-lg bg-slate-50 p-4 rounded-xl border border-orange-100 break-all w-full">
                          {withdrawDetails?.id || withdraw?.id || ''}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-lg font-medium text-slate-700">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <PauseCircle className="h-5 w-5 text-orange-500" />
                        </div>
                        Ngày tạo yêu cầu
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-orange-100">
                        <p className="font-semibold text-slate-700 text-xl">
                          {formatVietnameseDate(
                            withdrawDetails?.createdDate || withdraw?.createdDate || '',
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {withdrawDetails?.cancelReason && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-lg font-medium text-slate-700">
                          <div className="p-2 bg-rose-50 rounded-lg">
                            <X className="h-5 w-5 text-rose-500" />
                          </div>
                          Lý do từ chối
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <p className="text-slate-700 text-lg">{withdrawDetails.cancelReason}</p>
                        </div>
                      </div>
                    )}

                    {withdrawDetails?.username && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-lg font-medium text-slate-700">
                          <div className="p-2 bg-indigo-50 rounded-lg">
                            <User className="h-5 w-5 text-indigo-500" />
                          </div>
                          Tên người dùng
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <p className="font-medium text-slate-700 text-xl">
                            @{withdrawDetails.username}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Bank Information */}
              <Card className="border border-orange-200 bg-white overflow-hidden rounded-xl">
                <div className="p-8 border-b border-orange-200 bg-orange-50">
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    Thông tin ngân hàng
                  </h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <p className="text-xl font-medium text-slate-700 mb-2">Tên ngân hàng</p>
                        <div className="flex items-center gap-3">
                          <Landmark className="h-6 w-6 text-emerald-600" />
                          <p className="font-bold text-3xl text-slate-700">
                            {withdrawDetails?.bankName || withdraw?.bankName || ''}
                          </p>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <p className="text-xl font-medium text-slate-700 mb-2">Mã BIN</p>
                        <div className="flex items-center gap-2">
                          <Badge className="h-5 w-5 text-emerald-600" />
                          <p className="font-mono text-xl bg-white p-4 rounded-xl border border-slate-200 inline-block">
                            {withdrawDetails?.bankBin || withdraw?.bankBin || ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <p className="text-xl font-medium text-slate-700 mb-4">Logo ngân hàng</p>
                      {withdrawDetails?.bankUrl || withdraw?.bankUrl ? (
                        <div className="flex items-center justify-center p-8 bg-white border border-dashed border-slate-200 rounded-xl">
                          <img
                            src={
                              withdrawDetails?.bankUrl || withdraw?.bankUrl || '/placeholder.svg'
                            }
                            alt={`${withdrawDetails?.bankName || withdraw?.bankName || 'Bank'} Logo`}
                            className="max-w-[180px] max-h-[90px] object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center p-8 bg-white border border-dashed border-slate-200 rounded-xl">
                          <div className="text-center">
                            <Building className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-400">Không có logo</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Customer Information */}
              {withdrawDetails?.customerName && (
                <Card className="border border-orange-200 bg-white overflow-hidden rounded-xl">
                  <div className="p-8 border-b border-orange-200 bg-orange-50">
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      Thông tin khách hàng
                    </h3>
                  </div>
                  <div className="p-8 bg-white">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                      {withdrawDetails?.customerAvatarUrl && (
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-orange-100">
                          <img
                            src={withdrawDetails?.customerAvatarUrl || ''}
                            alt="Customer Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-3xl font-extrabold text-slate-800">
                          {withdrawDetails?.customerName || ''}
                        </p>
                        {withdrawDetails?.username && (
                          <p className="text-xl text-orange-500 mt-1">
                            @{withdrawDetails?.username}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                      {withdrawDetails?.customerPhone && (
                        <div className="bg-slate-50 p-6 rounded-xl border border-orange-100">
                          <p className="text-md text-orange-500 mb-2 flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            Số điện thoại
                          </p>
                          <p className="text-xl font-medium text-slate-700">
                            {withdrawDetails?.customerPhone || ''}
                          </p>
                        </div>
                      )}
                      {withdrawDetails?.customerEmail && (
                        <div className="bg-white p-6 rounded-xl border-2 border-purple-200">
                          <p className="text-md text-purple-500 mb-2 flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            Email
                          </p>
                          <p className="text-xl font-medium text-purple-700 break-all">
                            {withdrawDetails?.customerEmail || ''}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Seller Information */}
              {withdrawDetails?.sellerName && (
                <Card className="border border-orange-200 bg-white overflow-hidden rounded-xl">
                  <div className="p-8 border-b border-orange-200 bg-orange-50">
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <Store className="h-6 w-6 text-white" />
                      </div>
                      Thông tin người bán
                    </h3>
                  </div>
                  <div className="p-8 bg-white">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                      {withdrawDetails?.sellerAvatarUrl && (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-200">
                          <img
                            src={withdrawDetails?.sellerAvatarUrl || ''}
                            alt="Seller Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-3xl font-extrabold text-amber-700">
                          {withdrawDetails?.sellerName || ''}
                        </p>
                        <p className="text-lg text-amber-600 mt-1">Người bán</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                      {withdrawDetails?.sellerPhone && (
                        <div className="bg-white p-6 rounded-xl border-2 border-purple-200">
                          <p className="text-md text-purple-500 mb-2 flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            Số điện thoại
                          </p>
                          <p className="text-xl font-medium text-amber-700">
                            {withdrawDetails?.sellerPhone || ''}
                          </p>
                        </div>
                      )}
                      {withdrawDetails?.sellerEmail && (
                        <div className="bg-white p-6 rounded-xl border-2 border-amber-200">
                          <p className="text-md text-amber-500 mb-2 flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            Email
                          </p>
                          <p className="text-xl font-medium text-amber-700 break-all">
                            {withdrawDetails?.sellerEmail || ''}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* QR Code Section */}
              <Card className="border border-orange-200 bg-white overflow-hidden rounded-xl">
                <div className="p-8 border-b border-orange-200 bg-orange-50">
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <Search className="h-6 w-6 text-white" />
                    </div>
                    Mã QR thanh toán
                  </h3>
                </div>
                <div className="p-8 bg-white">
                  {(withdrawDetails?.status || withdraw?.status) === 'COMPLETED' ? (
                    <div className="flex items-center justify-center p-16 bg-orange-50 border border-dashed border-orange-200 rounded-xl">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                          <Check className="h-12 w-12 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-slate-800">Đã thanh toán</p>
                        <p className="text-lg text-slate-600 mt-2">
                          Giao dịch đã được hoàn tất thành công
                        </p>
                      </div>
                    </div>
                  ) : qrError ? (
                    <div className="flex flex-col md:flex-row items-start gap-6 p-8 bg-orange-50 border-2 border-orange-200 rounded-xl">
                      <div className="w-16 h-16 bg-orange-400 rounded-2xl flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                        <AlertTriangle className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-center md:text-left">
                        <p className="font-bold text-orange-700 text-xl mb-2">Lỗi khi tải mã QR</p>
                        <p className="text-md text-orange-600 mt-2 bg-white p-4 rounded-lg border border-orange-200">
                          {qrError === 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                            ? qrError
                            : qrError || 'Không thể tải mã QR'}
                        </p>
                      </div>
                    </div>
                  ) : qrCodeUrl ? (
                    <div className="flex justify-center">
                      <div className="p-10 bg-white border-3 border-indigo-200 rounded-2xl">
                        <p className="text-center text-lg font-medium text-indigo-600 mb-4">
                          Mã QR cho giao dịch này
                        </p>
                        <div className="bg-indigo-50 p-4 rounded-xl">
                          <img
                            src={qrCodeUrl || '/placeholder.svg'}
                            alt="QR Code thanh toán"
                            className="max-w-[500px] rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-16 bg-indigo-50 border-3 border-dashed border-indigo-200 rounded-2xl">
                      <div className="text-center">
                        <div className="relative mx-auto mb-6 w-20 h-20">
                          <div className="animate-ping absolute inset-0 rounded-full bg-indigo-300 opacity-75"></div>
                          <div className="animate-spin relative rounded-full h-20 w-20 border-b-4 border-t-4 border-indigo-500"></div>
                        </div>
                        <p className="text-xl font-medium text-indigo-700">Đang tải mã QR...</p>
                        <p className="text-md text-indigo-500 mt-2">Vui lòng đợi trong giây lát</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}

          {/* Approve Step */}
          {currentStep === 'approve' && (
            <Card className="border border-orange-200 bg-white rounded-xl">
              <div className="p-8 border-b border-orange-200 bg-orange-50">
                <h3 className="text-3xl font-bold text-slate-800 flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  Xác nhận duyệt yêu cầu rút tiền
                </h3>
              </div>
              <div className="p-8">
                <div className="max-w-3xl mx-auto">
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-8 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xl font-medium text-slate-700">
                          Bạn đang duyệt yêu cầu rút tiền với số tiền
                          <span className="ml-2 text-2xl font-extrabold text-orange-600">
                            {withdrawDetails?.amount?.toLocaleString() ||
                              withdraw?.amount?.toLocaleString() ||
                              '0'}{' '}
                            ₫
                          </span>
                        </p>
                        <p className="text-md text-slate-600 mt-1">
                          Vui lòng tải lên hình ảnh xác nhận chuyển khoản để hoàn tất quy trình.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <p className="text-xl font-medium text-green-700 mb-4 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Tải lên ảnh xác nhận chuyển khoản
                      </p>
                      <div className="border-3 border-dashed border-green-200 bg-green-50 rounded-2xl p-12 text-center">
                        {filePreview ? (
                          <div className="space-y-6">
                            <div className="bg-white p-4 rounded-xl border-2 border-green-200">
                              <img
                                src={filePreview}
                                alt="Preview"
                                className="max-h-[400px] mx-auto rounded-lg"
                              />
                            </div>
                            <div className="text-center">
                              <p className="text-green-600 font-medium mb-3">
                                Ảnh đã được tải lên thành công
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                className="mt-2 border-2 border-green-300 text-green-500 hover:bg-green-50 px-6 py-3 text-lg font-medium"
                                onClick={() => {
                                  if (filePreview) {
                                    URL.revokeObjectURL(filePreview);
                                  }
                                  setFilePreview(null);
                                  setSelectedFile(null);
                                }}
                              >
                                <X className="w-5 h-5 mr-2" />
                                Xóa ảnh và chọn lại
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex flex-col items-center justify-center p-6">
                              <label
                                htmlFor="image-upload"
                                className="flex flex-col items-center justify-center cursor-pointer group"
                              >
                                <div className="w-32 h-32 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-100 transition-all duration-200 border-2 border-green-200 group-hover:scale-105">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                  </svg>
                                </div>
                                <p className="text-xl font-medium text-green-700 mb-2 group-hover:text-green-600">
                                  Nhấp để tải ảnh lên
                                </p>
                                <p className="text-md text-green-400 max-w-md text-center">
                                  Tải lên ảnh chụp màn hình hoặc ảnh biên lai chuyển khoản để xác
                                  nhận giao dịch đã hoàn tất
                                </p>
                                <input
                                  id="image-upload"
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Reject Step */}
          {currentStep === 'reject' && (
            <Card className="border border-orange-200 bg-white rounded-xl">
              <div className="p-8 border-b border-orange-200 bg-orange-50">
                <h3 className="text-3xl font-bold text-slate-800 flex items-center gap-4">
                  <div className="p-8">
                    <div className="max-w-3xl mx-auto">
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
                        <p className="text-slate-700">
                          Bạn đang từ chối yêu cầu rút tiền với số tiền{' '}
                          <strong className="font-bold text-orange-600">
                            {withdrawDetails?.amount?.toLocaleString() ||
                              withdraw?.amount?.toLocaleString() ||
                              '0'}{' '}
                            ₫
                          </strong>
                          . Vui lòng cung cấp lý do từ chối để thông báo cho người dùng.
                        </p>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <p className="text-lg font-medium text-slate-700 mb-4">Lý do từ chối</p>
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full h-32 border border-orange-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                            placeholder="Nhập lý do từ chối yêu cầu rút tiền..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </h3>
              </div>
            </Card>
          )}
        </div>

        <div className="border-t border-orange-100 pt-8 mt-10">
          <DialogFooter className="gap-6">
            {currentStep === 'details' &&
              (withdrawDetails?.status || withdraw?.status) === 'PENDING' && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleDialogClose}
                    className="px-8 py-4 text-lg border border-orange-200 hover:bg-orange-50 text-slate-700"
                  >
                    Đóng
                  </Button>
                  <Button
                    onClick={() => setCurrentStep('reject')}
                    className="px-8 py-4 text-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  >
                    <AlertTriangle className="h-5 w-5 mr-3" />
                    Từ chối
                  </Button>
                  <Button
                    onClick={() => setCurrentStep('approve')}
                    className="px-8 py-4 text-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  >
                    <Check className="h-5 w-5 mr-3" />
                    Duyệt
                  </Button>
                </>
              )}

            {currentStep === 'details' &&
              (withdrawDetails?.status || withdraw?.status) !== 'PENDING' && (
                <Button
                  variant="outline"
                  onClick={handleDialogClose}
                  className="px-8 py-4 text-lg border border-orange-200 hover:bg-orange-50 text-slate-700"
                >
                  Đóng
                </Button>
              )}

            {currentStep === 'approve' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('details')}
                  className="px-8 py-4 text-lg border border-orange-200 hover:bg-orange-50 text-slate-700"
                >
                  Quay lại
                </Button>
                <Button
                  onClick={handleApproveSubmit}
                  disabled={isApproving || !selectedFile}
                  className="px-8 py-4 text-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold disabled:opacity-50"
                >
                  {isApproving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-3" />
                      Xác nhận duyệt
                    </>
                  )}
                </Button>
              </>
            )}

            {/* Reject step footer */}
            {currentStep === 'reject' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('details')}
                  className="px-8 py-4 text-lg border border-orange-200 hover:bg-orange-50 text-slate-700"
                >
                  Quay lại
                </Button>
                <Button
                  onClick={handleRejectSubmit}
                  disabled={isRejecting || !rejectReason.trim()}
                  className="px-8 py-4 text-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold disabled:opacity-50"
                >
                  {isRejecting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 mr-3" />
                      Xác nhận từ chối
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
