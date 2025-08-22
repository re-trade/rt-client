'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BankInfor, walletApi, WithdrawCreate } from '@/service/wallet.api';
import { AlertCircle, ArrowRight, CheckCircle, CreditCard, Wallet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SelectBankInfo } from './SelectBankInfo';
interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: number;
  onWithdraw: (amount: number, bankInfo?: string) => void;
  onOpenAddBankForm: () => void;
}

export function WithdrawDialog({
  open,
  onOpenChange,
  availableBalance,
  onWithdraw,
  onOpenAddBankForm,
}: WithdrawDialogProps) {
  const [selectedBank, setSelectedBank] = useState<BankInfor | null>(null);
  const [withdrawData, setWithdrawData] = useState<WithdrawCreate>({
    amount: 0,
    bankProfileId: '',
    content: '',
  });
  const MIN_WITHDRAW = 1000;
  const MAX_WITHDRAW = availableBalance;
  const MAX_CONTENT_LENGTH = 50; // Giới hạn nội dung giao dịch

  const isValidAmount =
    Number(withdrawData.amount) >= MIN_WITHDRAW && Number(withdrawData.amount) <= MAX_WITHDRAW;

  const isFormValid = withdrawData.amount && selectedBank;

  // Định dạng số tiền
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  // Xử lý nhập số tiền với định dạng
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setWithdrawData((prev) => ({
      ...prev,
      amount: Number(value),
    }));
  };

  // Xử lý nhập nội dung giao dịch
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9À-ỹà-ỹ\s]/g, '');
    setWithdrawData((prev) => ({
      ...prev,
      content: value.slice(0, MAX_CONTENT_LENGTH),
    }));
  };

  // Chọn số tiền nhanh
  const quickAmounts = [500000, 1000000, 2000000, 5000000];

  const handleQuickAmount = (amount: number) => {
    if (amount <= MAX_WITHDRAW) {
      setWithdrawData((prev) => ({
        ...prev,
        amount: amount,
      }));
    }
  };

  // Ẩn số tài khoản (chỉ hiện 4 số cuối)
  // const maskAccountNumber = (accountNumber: string) => {
  //   if (accountNumber.length <= 4) return accountNumber;
  //   return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  // };

  const handleConfirm = () => {
    if (!selectedBank) {
      toast.error('Vui lòng chọn tài khoản để nhận');
      return;
    }
    if (withdrawData.amount < MIN_WITHDRAW || withdrawData.amount > MAX_WITHDRAW) {
      toast.error(
        `Số tiền rút phải từ ${formatCurrency(MIN_WITHDRAW)} đến ${formatCurrency(MAX_WITHDRAW)}`,
      );
      return;
    }

    const newData = {
      ...withdrawData,
      bankProfileId: selectedBank.id,
    };
    const response = walletApi.createWithdraw(newData);
    onWithdraw(withdrawData.amount, selectedBank.bankName);
    setSelectedBank(null);
    setWithdrawData({ amount: 0, bankProfileId: '', content: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            Rút tiền từ ví
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin số dư */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-600">Số dư khả dụng</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(availableBalance)}
                </p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-green-600" />
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
                value={
                  withdrawData.amount ? Number(withdrawData.amount).toLocaleString('vi-VN') : ''
                }
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
                <p>
                  Tối thiểu: {formatCurrency(MIN_WITHDRAW)} | Tối đa: {formatCurrency(MAX_WITHDRAW)}
                </p>
              </div>
            </div>
          </div>

          {/* Chọn tài khoản ngân hàng */}
          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-900">
              Chọn tài khoản ngân hàng
            </Label>
            <SelectBankInfo
              selectedBank={selectedBank}
              onCloseWithdrawDialog={() => onOpenChange(false)}
              onOpenAddBankForm={onOpenAddBankForm}
              onSelectBank={setSelectedBank}
            />
          </div>

          {/* Nhập nội dung giao dịch */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-900">Nội dung giao dịch</Label>
            <Input
              placeholder="Nhập nội dung giao dịch"
              value={withdrawData.content}
              onChange={handleContentChange}
              className="h-14 truncate overflow-hidden whitespace-nowrap"
              maxLength={MAX_CONTENT_LENGTH}
            />
            <p className="text-xs text-gray-500">Tối đa {MAX_CONTENT_LENGTH} ký tự</p>
          </div>

          {/* Tóm tắt giao dịch */}
          {withdrawData.amount !== 0 && selectedBank && (
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
                    <span className="font-medium">
                      {formatCurrency(Number(withdrawData.amount))}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Nội dung:</span>
                    <span className="font-medium truncate overflow-hidden whitespace-nowrap">
                      {withdrawData.content}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-medium">
                        {selectedBank.bankName} ({selectedBank.accountNumber})
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-gray-900">Số tiền thực nhận:</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(Number(withdrawData.amount))}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Nút hành động */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 h-12" onClick={() => onOpenChange(false)}>
              Hủy bỏ
            </Button>
            <Button
              className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
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
              <li>Thời gian xử lý có thể mất 1-3 ngày làm việc</li>
              <li>Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
