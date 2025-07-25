// components/dialog-common/add/WithdrawDialog.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Wallet, CreditCard, Smartphone, ArrowRight, CheckCircle, Car } from 'lucide-react';
import { useState } from 'react';
import { BankInfor, walletApi, WithdrawCreate } from '@/service/wallet.api';
import { SelectBankInfo } from './SelectBankInfo';


interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: number;
  onWithdraw: (amount: number, method: string, bankInfo?: string) => void;
  onOpenAddBankForm: () => void;
}

export function WithdrawDialog({
  open,
  onOpenChange,
  availableBalance,
  onWithdraw,
  onOpenAddBankForm,
}: WithdrawDialogProps) {

  const [withdrawMethod, setWithdrawMethod] = useState('');

  const [bankInfo, setBankInfo] = useState('');
  const [selectedBank, setSelectedBank] = useState<any>(null);

  const [withdrawData, setWithdrawData] = useState<WithdrawCreate>({
    amount: 0,
    bankProfileId: '',
    content: '',
  });
  const MIN_WITHDRAW = 100000;
  const MAX_WITHDRAW = availableBalance;
  const TRANSACTION_FEE = 5000; // Phí giao dịch cố định


  // Tính toán số tiền thực nhận
  const actualAmount = Math.max(0, Number(withdrawData.amount) - TRANSACTION_FEE);

  // Kiểm tra tính hợp lệ của form
  const isValidAmount = Number(withdrawData.amount) >= MIN_WITHDRAW && Number(withdrawData.amount) <= MAX_WITHDRAW;

  const isFormValid = withdrawData.amount && withdrawMethod && isValidAmount &&
    (withdrawMethod !== 'bank' || selectedBank);

  // Định dạng số tiền
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  // Xử lý nhập số tiền với định dạng
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setWithdrawData(prev => ({
      ...prev,
      amount: Number(value),
    }));
  };


  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9À-ỹà-ỹ\s]/g, '');
    setWithdrawData(prev => ({
      ...prev,
      content: value.slice(0, 140),
    }));
  };

  // Chọn số tiền nhanh
  const quickAmounts = [500000, 1000000, 2000000, 5000000];

  const handleQuickAmount = (amount: number) => {
    if (amount <= MAX_WITHDRAW) {
      setWithdrawData(prev => ({
        ...prev,
        amount: amount,
      }));
    }
  };

  const handleConfirm = () => {
    if (!selectedBank) return;
    const newData = {
      ...withdrawData,
      bankProfileId: selectedBank.id,
    };
    const response = walletApi.createWithdraw(newData);
    console.log('Xác nhận rút tiền:', newData);
    console.log('Rút tiền thành công:', response);
    onWithdraw(withdrawData.amount, withdrawMethod, bankInfo);
    setWithdrawMethod('');
    setBankInfo('');
    setSelectedBank(null);
    onOpenChange(false);
  };

  // Lấy icon cho phương thức thanh toán
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank':
        return <CreditCard className="w-4 h-4" />;
      case 'momo':
        return <Smartphone className="w-4 h-4" />;
      case 'zalopay':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            Rút tiền từ ví
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin số dư */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-600">Số dư khả dụng</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(availableBalance)}
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Nhập số tiền */}
          <div className="space-y-4">
            <Label htmlFor="amount" className="text-base font-semibold text-gray-900">
              Số tiền muốn rút
            </Label>

            <div className="relative">
              <Input
                id="amount"
                placeholder="0"
                value={withdrawData.amount ? Number(withdrawData.amount).toLocaleString('vi-VN') : ''}
                onChange={handleAmountChange}
                className="text-xl font-bold text-right pr-12 h-14"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                ₫
              </span>
            </div>

            {/* Chọn nhanh số tiền */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Chọn nhanh:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickAmounts.map((amount) => (
                  <Button
                    value={withdrawData?.amount || 0}
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(amount)}
                    disabled={amount > MAX_WITHDRAW}
                    className="justify-center text-sm"
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Thông báo giới hạn */}
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-700">
                <p className="font-medium">Giới hạn rút tiền:</p>
                <p>Tối thiểu: {formatCurrency(MIN_WITHDRAW)} | Tối đa: {formatCurrency(MAX_WITHDRAW)}</p>
              </div>
            </div>
          </div>

          {/* Phương thức rút tiền */}
          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-900">
              Phương thức rút tiền
            </Label>

            <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
              <SelectTrigger className="h-14">
                <SelectValue placeholder="Chọn phương thức thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank" className="py-3">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Chuyển khoản ngân hàng</p>
                      <p className="text-xs text-gray-500">Miễn phí - 1-3 ngày làm việc</p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="momo" className="py-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-pink-600" />
                    <div>
                      <p className="font-medium">Ví MoMo</p>
                      <p className="text-xs text-gray-500">Phí 5,000₫ - Tức thì</p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="zalopay" className="py-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">ZaloPay</p>
                      <p className="text-xs text-gray-500">Phí 5,000₫ - Tức thì</p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Chọn tài khoản ngân hàng */}
          {withdrawMethod === 'bank' && (
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-900">
                Chọn tài khoản ngân hàng
              </Label>
              <SelectBankInfo
                onCloseWithdrawDialog={() => onOpenChange(false)}
                onOpenAddBankForm={onOpenAddBankForm}
                onSelectBank={setSelectedBank}
              />
            </div>
          )}

          <Label className="text-base font-semibold text-gray-900">
            Nội dung giao dịch
          </Label>
          <Input
            placeholder="Nhập nội dung giao dịch"
            value={withdrawData.content}
            onChange={handleContentChange}
            className="h-14 truncate overflow-hidden whitespace-nowrap"
          />

          {/* Tóm tắt giao dịch */}
          {withdrawData.amount && withdrawMethod && (
            <>
              <Separator />
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Tóm tắt giao dịch
                </h4>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền rút:</span>
                    <span className="font-medium">{formatCurrency(Number(withdrawData.amount))}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Nội dung:</span>
                    <span className="font-medium truncate overflow-hidden whitespace-nowrap">{withdrawData.content}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí giao dịch:</span>
                    <span className="font-medium">
                      {withdrawMethod === 'bank' ? 'Miễn phí' : formatCurrency(TRANSACTION_FEE)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức:</span>
                    <div className="flex items-center gap-2">
                      {getMethodIcon(withdrawMethod)}
                      <span className="font-medium capitalize">
                        {withdrawMethod === 'bank' ? 'Ngân hàng' :
                          withdrawMethod === 'momo' ? 'MoMo' :
                            withdrawMethod === 'zalopay' ? 'ZaloPay' : withdrawMethod}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-gray-900">Số tiền thực nhận:</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(withdrawMethod === 'bank' ? Number(withdrawData.amount) : actualAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Nút hành động */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 h-12"
              onClick={() => onOpenChange(false)}
            >
              Hủy bỏ
            </Button>
            <Button
              className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              onClick={handleConfirm}
              disabled={!isFormValid}
            >
              <div className="flex items-center gap-2">
                <span>Xác nhận rút tiền</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Button>
          </div>

          {/* Lưu ý */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Lưu ý quan trọng:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Giao dịch rút tiền không thể hoàn tác sau khi xác nhận</li>
              <li>Thời gian xử lý có thể thay đổi tùy theo phương thức thanh toán</li>
              <li>Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}