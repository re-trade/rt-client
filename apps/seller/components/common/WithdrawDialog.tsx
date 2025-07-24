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
import { useState } from 'react';
import { SelectBankInfo } from './SelectBankInfo';

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: number;
  onWithdraw: (amount: string, method: string, bankInfo?: string) => void;
  onOpenAddBankForm: () => void;
}

export function WithdrawDialog({
  open,
  onOpenChange,
  availableBalance,
  onWithdraw,
  onOpenAddBankForm,
}: WithdrawDialogProps) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [bankInfo, setBankInfo] = useState('');

  const handleConfirm = () => {
    onWithdraw(withdrawAmount, withdrawMethod, bankInfo);
    setWithdrawAmount('');
    setWithdrawMethod('');
    setBankInfo('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rút tiền</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600">Số dư khả dụng:</span>
              <span className="font-bold text-blue-600">
                {availableBalance.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="amount">Số tiền rút</Label>
            <Input
              id="amount"
              placeholder="Nhập số tiền"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Tối thiểu: 100,000₫ | Tối đa: {availableBalance.toLocaleString('vi-VN')}₫
            </p>
          </div>

          <div>
            <Label htmlFor="method">Phương thức rút tiền</Label>
            <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Ngân hàng</SelectItem>
                <SelectItem value="momo">Ví MoMo</SelectItem>
                <SelectItem value="zalopay">ZaloPay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {withdrawMethod === 'bank' && (
            <div>
              <Label htmlFor="bankInfo">Thông tin tài khoản ngân hàng</Label>
              {/* <Input
                id="bankInfo"
                placeholder="Số tài khoản - Tên ngân hàng"
                value={bankInfo}
                onChange={(e) => setBankInfo(e.target.value)}
              /> */}
              <SelectBankInfo
                onCloseWithdrawDialog={() => onOpenChange(false)} // Đóng dialog
                onOpenAddBankForm={onOpenAddBankForm} // Mở form thêm tài khoản
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleConfirm}>
              Xác nhận rút tiền
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
