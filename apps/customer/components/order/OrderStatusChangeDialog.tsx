'use client';

import Modal from '@/components/reusable/modal';
import { OrderCombo } from '@/services/order.api';
import { AlertTriangle, Ban, CheckCircle, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrderStatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderCombo | null;
  onStatusChange: (
    action: 'cancel' | 'complete' | 'return' | 'confirm',
    reason?: string,
  ) => Promise<void>;
}

export default function OrderStatusChangeDialog({
  isOpen,
  onClose,
  order,
  onStatusChange,
}: OrderStatusChangeDialogProps) {
  const [selectedAction, setSelectedAction] = useState<
    'cancel' | 'complete' | 'return' | 'confirm' | null
  >(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    setSelectedAction(null);
    setReason('');
    setError('');
    setDropdownOpen(false);
    setHoldProgress(0);
    setIsHolding(false);
    onClose();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHolding && selectedAction === 'cancel' && !isSubmitting) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            setIsHolding(false);
            handleSubmit();
            return 100;
          }
          return newProgress;
        });
      }, 20);
    } else {
      setHoldProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHolding, selectedAction, isSubmitting]);

  const handleMouseDown = () => {
    if (
      selectedAction === 'cancel' &&
      !isSubmitting &&
      !isHolding &&
      (!selectedActionConfig?.requiresReason || reason.trim())
    ) {
      setIsHolding(true);
      setHoldProgress(0);
    }
  };

  const handleMouseUp = () => {
    if (!isSubmitting) {
      setIsHolding(false);
      setHoldProgress(0);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAction || isSubmitting) return;

    if ((selectedAction === 'cancel' || selectedAction === 'return') && !reason.trim()) {
      setError('Vui lòng nhập lý do');
      return;
    }

    setIsSubmitting(true);
    setIsHolding(false);
    setHoldProgress(0);
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

    if (status === 'Pending' || status === 'Payment Confirmation') {
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

    if (status === 'Delivered') {
      actions.push({
        key: 'confirm' as const,
        label: 'Xác nhận đã nhận hàng',
        description: 'Xác nhận bạn đã nhận được đơn hàng này',
        icon: CheckCircle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        requiresReason: false,
      });
    }

    if (status === 'RETRIEVED') {
      actions.push(
        {
          key: 'complete' as const,
          label: 'Hoàn thành đơn hàng',
          description: 'Xác nhận đơn hàng đã hoàn tất',
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
      title="Quản lý đơn hàng"
      size="xl"
      closeOnClickOutside={!isSubmitting}
    >
      <div className="space-y-8 p-4 min-h-[500px]">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 border border-orange-200">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-10 h-10 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-gray-800 truncate">
                Đơn hàng #{order.comboId.slice(0, 8)}...
              </h3>
              <p className="text-base text-gray-600 mt-2">
                Chọn thao tác bạn muốn thực hiện với đơn hàng này
              </p>
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border border-orange-300 text-orange-700">
                Trạng thái hiện tại: {order.orderStatus}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-xl text-gray-800">Chọn hành động:</h4>

            <div className="relative">
              <div
                onClick={() => !isSubmitting && setDropdownOpen(!dropdownOpen)}
                className={`w-full p-5 text-lg border-2 rounded-xl bg-white cursor-pointer transition-all duration-200 ${
                  dropdownOpen
                    ? 'border-orange-500 ring-2 ring-orange-200'
                    : 'border-gray-300 hover:border-gray-400'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {selectedActionConfig ? (
                      <>
                        <div className={`p-2 rounded-full ${selectedActionConfig.bgColor}`}>
                          <selectedActionConfig.icon
                            className={`w-5 h-5 ${selectedActionConfig.color}`}
                          />
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">
                            {selectedActionConfig.label}
                          </span>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {selectedActionConfig.description}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-gray-100">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-500 font-medium">
                          Chọn hành động bạn muốn thực hiện
                        </span>
                      </div>
                    )}
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                  {availableActions.map((action, index) => (
                    <div
                      key={action.key}
                      onClick={() => {
                        setSelectedAction(action.key);
                        setDropdownOpen(false);
                      }}
                      className={`p-5 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        index !== availableActions.length - 1 ? 'border-b border-gray-100' : ''
                      } ${selectedAction === action.key ? 'bg-orange-50' : ''}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${action.bgColor} ${action.color}`}>
                          <action.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h5 className={`font-semibold text-base ${action.color} mb-1`}>
                            {action.label}
                          </h5>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {action.description}
                          </p>
                        </div>
                        {selectedAction === action.key && (
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {selectedAction && selectedActionConfig?.requiresReason && (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800">
                Lý do {selectedAction === 'cancel' ? 'hủy đơn hàng' : 'trả hàng'} *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Nhập lý do ${selectedAction === 'cancel' ? 'hủy đơn hàng' : 'trả hàng'}...`}
                className="w-full p-5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-base text-gray-800 placeholder-gray-500 bg-white"
                rows={6}
                disabled={isSubmitting}
              />
              <p className="text-base text-gray-600">
                Vui lòng cung cấp lý do chi tiết để chúng tôi có thể hỗ trợ bạn tốt hơn.
              </p>
            </div>
          </div>
        )}

        {selectedAction && !selectedActionConfig?.requiresReason && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h5 className="font-semibold text-lg text-blue-800">Xác nhận hành động</h5>
                <p className="text-base text-blue-700">
                  Bạn có chắc chắn muốn {selectedActionConfig?.label.toLowerCase()}?
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h5 className="font-semibold text-lg text-red-800">Có lỗi xảy ra</h5>
                <p className="text-base text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {selectedAction && (
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setSelectedAction(null);
                setReason('');
                setError('');
                setDropdownOpen(false);
              }}
              className="flex-1 px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-semibold text-lg"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            {selectedAction === 'cancel' ? (
              <div className="flex-1 relative">
                <button
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleMouseDown}
                  onTouchEnd={handleMouseUp}
                  disabled={
                    isSubmitting || (selectedActionConfig?.requiresReason && !reason.trim())
                  }
                  className={`w-full px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 relative overflow-hidden ${
                    isSubmitting || (selectedActionConfig?.requiresReason && !reason.trim())
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 hover:shadow-lg active:scale-95'
                  }`}
                >
                  {/* Progress bar background */}
                  <div
                    className="absolute inset-0 bg-red-800 transition-all duration-75 ease-out"
                    style={{ width: `${holdProgress}%` }}
                  />

                  {/* Button content */}
                  <div className="relative z-10 flex items-center justify-center space-x-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </>
                    ) : isHolding ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white rounded-full animate-pulse"></div>
                        <span>Giữ để hủy đơn hàng...</span>
                      </>
                    ) : (
                      <>
                        <Ban className="w-5 h-5" />
                        <span>Giữ để hủy đơn hàng</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Progress indicator */}
                {holdProgress > 0 && (
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-75 ease-out rounded-full"
                      style={{ width: `${holdProgress}%` }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (selectedActionConfig?.requiresReason && !reason.trim())}
                className={`flex-1 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 ${
                  isSubmitting || (selectedActionConfig?.requiresReason && !reason.trim())
                    ? 'bg-gray-400 cursor-not-allowed'
                    : selectedAction === 'complete'
                      ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
                      : 'bg-orange-600 hover:bg-orange-700 hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    {selectedAction === 'complete' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <RotateCcw className="w-5 h-5" />
                    )}
                    <span>Xác nhận</span>
                  </div>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
