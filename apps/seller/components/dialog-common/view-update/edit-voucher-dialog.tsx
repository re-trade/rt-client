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
import { useEffect, useState } from 'react';

interface Voucher {
  id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'inactive' | 'expired';
}

interface EditVoucherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voucher: Voucher | null;
  onUpdateVoucher: (voucher: Omit<Voucher, 'id' | 'usedCount'>) => void;
}

export function EditVoucherDialog({
  open,
  onOpenChange,
  voucher,
  onUpdateVoucher,
}: EditVoucherDialogProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    minOrder: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
  });

  useEffect(() => {
    if (voucher) {
      setFormData({
        code: voucher.code,
        name: voucher.name,
        type: voucher.type,
        value: voucher.value.toString(),
        minOrder: voucher.minOrder.toString(),
        maxDiscount: voucher.maxDiscount?.toString() || '',
        startDate: voucher.startDate,
        endDate: voucher.endDate,
        usageLimit: voucher.usageLimit.toString(),
      });
    }
  }, [voucher]);

  const handleSubmit = () => {
    const voucherData: Omit<Voucher, 'id' | 'usedCount'> = {
      code: formData.code,
      name: formData.name,
      type: formData.type,
      value: Number(formData.value),
      minOrder: Number(formData.minOrder),
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      usageLimit: Number(formData.usageLimit),
      status: 'active',
    };

    onUpdateVoucher(voucherData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa voucher</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-code">Mã voucher</Label>
            <Input
              id="edit-code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-name">Tên voucher</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-type">Loại giảm giá</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'percentage' | 'fixed') =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                <SelectItem value="fixed">Số tiền cố định (đ)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-value">Giá trị giảm</Label>
            <Input
              id="edit-value"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-minOrder">Đơn hàng tối thiểu</Label>
            <Input
              id="edit-minOrder"
              type="number"
              value={formData.minOrder}
              onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
            />
          </div>
          {formData.type === 'percentage' && (
            <div>
              <Label htmlFor="edit-maxDiscount">Giảm tối đa</Label>
              <Input
                id="edit-maxDiscount"
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="edit-startDate">Ngày bắt đầu</Label>
              <Input
                id="edit-startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-endDate">Ngày kết thúc</Label>
              <Input
                id="edit-endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-usageLimit">Giới hạn sử dụng</Label>
            <Input
              id="edit-usageLimit"
              type="number"
              value={formData.usageLimit}
              onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Cập nhật voucher
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
