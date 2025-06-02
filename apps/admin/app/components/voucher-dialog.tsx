'use client';

import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { useState } from 'react';

interface VoucherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voucher?: any; // Replace with proper type
}

export function VoucherDialog({ open, onOpenChange, voucher }: VoucherDialogProps) {
  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    type: string;
    value: string;
    maxDiscount: string;
    minOrder: string;
    usageLimit: string;
    startDate: string;
    endDate: string;
    customerGroups: string[];
    productGroups: string[];
    isActive: boolean;
  }>({
    code: voucher?.code || '',
    name: voucher?.name || '',
    type: voucher?.type || 'percentage',
    value: voucher?.value || '',
    maxDiscount: voucher?.maxDiscount || '',
    minOrder: voucher?.minOrder || '',
    usageLimit: voucher?.usage?.total || '',
    startDate: voucher?.startDate || '',
    endDate: voucher?.endDate || '',
    customerGroups: voucher?.conditions?.customerGroups || ['all'],
    productGroups: voucher?.conditions?.productGroups || ['all'],
    isActive: voucher?.status === 'active' || true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{voucher ? 'Chỉnh sửa voucher' : 'Tạo voucher mới'}</DialogTitle>
          <DialogDescription>
            {voucher
              ? 'Cập nhật thông tin voucher'
              : 'Tạo một voucher mới cho chương trình khuyến mãi'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã voucher</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Nhập mã voucher"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Tên chương trình</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên chương trình"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hình thức giảm giá</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hình thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                    <SelectItem value="fixed">Số tiền cố định</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">
                  {formData.type === 'percentage' ? 'Phần trăm giảm' : 'Số tiền giảm'}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder={formData.type === 'percentage' ? 'Nhập %' : 'Nhập số tiền'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Giảm tối đa (VNĐ)</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  placeholder="Nhập số tiền tối đa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minOrder">Đơn tối thiểu (VNĐ)</Label>
                <Input
                  id="minOrder"
                  type="number"
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                  placeholder="Nhập số tiền tối thiểu"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Số lượt sử dụng</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  placeholder="Nhập số lượt sử dụng"
                />
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: Boolean(checked) })
                    }
                  />
                  <Label>{formData.isActive ? 'Đang hoạt động' : 'Tạm dừng'}</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nhóm khách hàng áp dụng</Label>
              <Select
                value={formData.customerGroups[0]}
                onValueChange={(value) => setFormData({ ...formData, customerGroups: [value] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm khách hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả khách hàng</SelectItem>
                  <SelectItem value="new">Khách hàng mới</SelectItem>
                  <SelectItem value="vip">Khách hàng VIP</SelectItem>
                  <SelectItem value="loyal">Khách hàng thân thiết</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nhóm sản phẩm áp dụng</Label>
              <Select
                value={formData.productGroups[0]}
                onValueChange={(value) => setFormData({ ...formData, productGroups: [value] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                  <SelectItem value="fashion">Thời trang</SelectItem>
                  <SelectItem value="electronics">Điện tử</SelectItem>
                  <SelectItem value="beauty">Mỹ phẩm</SelectItem>
                  <SelectItem value="home">Nhà cửa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{voucher ? 'Cập nhật' : 'Tạo mới'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
