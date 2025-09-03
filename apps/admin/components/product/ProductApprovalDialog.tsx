'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TProduct } from '@/services/product.api';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface ProductApprovalDialogProps {
  product: TProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onDeny: (reason: string) => void;
  loading: boolean;
}

export const ProductApprovalDialog = ({
  product,
  isOpen,
  onClose,
  onApprove,
  onDeny,
  loading,
}: ProductApprovalDialogProps) => {
  const [selectedAction, setSelectedAction] = useState<'approve' | 'deny' | null>(null);
  const [reason, setReason] = useState('');

  const handleActionSelect = (action: 'approve' | 'deny') => {
    setSelectedAction(action);
    if (action === 'approve') {
      setReason('');
    }
  };

  const handleConfirm = () => {
    if (selectedAction === 'approve') {
      onApprove();
    } else if (selectedAction === 'deny') {
      if (!reason.trim()) {
        alert('Vui lòng nhập lý do từ chối');
        return;
      }
      if (reason.length > 100) {
        alert('Lý do không được vượt quá 100 ký tự');
        return;
      }
      onDeny(reason);
    }
  };

  const handleClose = () => {
    setSelectedAction(null);
    setReason('');
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-xl font-semibold text-gray-900">Duyệt sản phẩm</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Xem xét và quyết định duyệt sản phẩm <strong>{product.name}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Product Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.sellerShopName}</p>
              <p className="text-sm text-orange-600 font-medium">
                {product.currentPrice.toLocaleString('vi-VN')} VNĐ
              </p>
            </div>
          </div>
        </div>

        {/* Action Selection */}
        {selectedAction === null && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chọn hành động</h3>
              <p className="text-gray-600">Bạn muốn duyệt hay từ chối sản phẩm này?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleActionSelect('approve')}
                className="h-20 flex-col gap-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
                <span className="font-medium text-green-700">Duyệt sản phẩm</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleActionSelect('deny')}
                className="h-20 flex-col gap-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                <XCircle className="h-8 w-8 text-red-600" />
                <span className="font-medium text-red-700">Từ chối sản phẩm</span>
              </Button>
            </div>
          </div>
        )}

        {/* Approve Confirmation */}
        {selectedAction === 'approve' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Xác nhận duyệt sản phẩm</h3>
              <p className="text-gray-600">
                Sản phẩm sẽ được hiển thị công khai và có thể được mua bán
              </p>
            </div>
          </div>
        )}

        {/* Deny with Reason */}
        {selectedAction === 'deny' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Lý do từ chối</h3>
              <p className="text-gray-600 text-sm">
                Vui lòng cho biết lý do tại sao bạn từ chối sản phẩm này
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ví dụ: Hình ảnh không rõ ràng, thông tin sản phẩm không đầy đủ, vi phạm chính sách..."
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-red-500 resize-none"
                maxLength={100}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Lý do này sẽ được gửi đến người bán để họ có thể chỉnh sửa sản phẩm.
                </p>
                <span
                  className={`text-xs ${reason.length > 90 ? 'text-red-500' : 'text-gray-400'}`}
                >
                  {reason.length}/100
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedAction !== null && (
          <div className="flex justify-between items-center gap-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setSelectedAction(null)}
              disabled={loading}
              className="flex items-center gap-2"
            >
              ← Quay lại
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className={`flex items-center gap-2 px-6 ${
                selectedAction === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {selectedAction === 'approve' ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Duyệt sản phẩm
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Từ chối sản phẩm
                </>
              )}
            </Button>
          </div>
        )}

        {/* Initial Cancel Button */}
        {selectedAction === null && (
          <div className="flex justify-center pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={handleClose} className="px-8">
              Hủy bỏ
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
