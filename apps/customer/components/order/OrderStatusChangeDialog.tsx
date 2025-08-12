'use client';

import Modal from '@/components/reusable/modal';
import { OrderCombo } from '@/services/order.api';
import { AlertTriangle, Ban, CheckCircle, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';

interface OrderStatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderCombo | null;
  onStatusChange: (action: 'cancel' | 'complete' | 'return', reason?: string) => Promise<void>;
}

export default function OrderStatusChangeDialog({
  isOpen,
  onClose,
  order,
  onStatusChange,
}: OrderStatusChangeDialogProps) {
  const [selectedAction, setSelectedAction] = useState<'cancel' | 'complete' | 'return' | null>(
    null,
  );
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    if (isSubmitting) return;
    setSelectedAction(null);
    setReason('');
    setError('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedAction) return;

    if ((selectedAction === 'cancel' || selectedAction === 'return') && !reason.trim()) {
      setError('Vui lòng nhập lý do');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onStatusChange(selectedAction, reason.trim() || undefined);
      handleClose();
    } catch (error: any) {
      setError(error.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableActions = () => {
    if (!order) return [];

    const actions = [];
    const status = order.orderStatus;

    if (status === 'PENDING' || status === 'PAYMENT_CONFIRMATION') {
      actions.push({
        key: 'cancel' as const,
        label: 'Hủy đơn hàng',
        description: 'Hủy đơn hàng này',
        icon: Ban,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        requiresReason: true,
      });
    }

    if (status === 'DELIVERED') {
      actions.push(
        {
          key: 'complete' as const,
          label: 'Hoàn thành đơn hàng',
          description: 'Xác nhận đã nhận hàng và hoàn thành đơn hàng',
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          requiresReason: false,
        },
        {
          key: 'return' as const,
          label: 'Yêu cầu trả hàng',
          description: 'Gửi yêu cầu trả hàng cho đơn hàng này',
          icon: RotateCcw,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          requiresReason: true,
        },
      );
    }

    return actions;
  };

  const availableActions = getAvailableActions();

  if (!order || availableActions.length === 0) {
    return null;
  }

  const selectedActionConfig = availableActions.find((action) => action.key === selectedAction);

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title="Thay đổi trạng thái đơn hàng"
      size="md"
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Đơn hàng #{order.comboId.slice(0, 8)}...
              </h3>
              <p className="text-sm text-gray-600">Chọn hành động bạn muốn thực hiện</p>
            </div>
          </div>
        </div>

        {!selectedAction ? (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Chọn hành động:</h4>
            {availableActions.map((action) => (
              <button
                key={action.key}
                onClick={() => setSelectedAction(action.key)}
                className={`w-full p-4 rounded-lg border-2 ${action.borderColor} ${action.bgColor} hover:shadow-md transition-all duration-200 text-left`}
                disabled={isSubmitting}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-white ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className={`font-medium ${action.color}`}>{action.label}</h5>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">{selectedActionConfig?.label}</h4>
              <button
                onClick={() => {
                  setSelectedAction(null);
                  setReason('');
                  setError('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedActionConfig?.requiresReason && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do {selectedAction === 'cancel' ? 'hủy đơn hàng' : 'trả hàng'} *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={`Nhập lý do ${selectedAction === 'cancel' ? 'hủy đơn hàng' : 'trả hàng'}...`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => {
                  setSelectedAction(null);
                  setReason('');
                  setError('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Quay lại
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (selectedActionConfig?.requiresReason && !reason.trim())}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                  isSubmitting || (selectedActionConfig?.requiresReason && !reason.trim())
                    ? 'bg-gray-400 cursor-not-allowed'
                    : selectedAction === 'cancel'
                      ? 'bg-red-600 hover:bg-red-700'
                      : selectedAction === 'complete'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
