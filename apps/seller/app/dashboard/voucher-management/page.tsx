'use client';

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit } from "lucide-react"
import {CreateVoucherDialog} from"@/components/ui/dialog/add/create-voucher-dialog"


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

const mockVouchers: Voucher[] = [
  {
    id: '1',
    code: 'SALE20',
    name: 'Giảm giá 20%',
    type: 'percentage',
    value: 20,
    minOrder: 100000,
    maxDiscount: 50000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    usageLimit: 100,
    usedCount: 25,
    status: 'active',
  },
  {
    id: '2',
    code: 'FREESHIP',
    name: 'Miễn phí vận chuyển',
    type: 'fixed',
    value: 30000,
    minOrder: 200000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    usageLimit: 50,
    usedCount: 10,
    status: 'active',
  },
];

export default function VoucherManagement() {
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
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

  const handleCreateVoucher = (voucherData: Omit<Voucher, "id" | "usedCount">) => {
    const newVoucher: Voucher = {
      id: Date.now().toString(),
      usedCount: 0,
      ...voucherData,
    }
    setVouchers([...vouchers, newVoucher])
  }
    


  const handleUpdate = () => {
    if (!selectedVoucher) return;

    const updatedVouchers = vouchers.map((voucher) =>
      voucher.id === selectedVoucher.id
        ? {
            ...voucher,
            code: formData.code,
            name: formData.name,
            type: formData.type,
            value: Number(formData.value),
            minOrder: Number(formData.minOrder),
            maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
            startDate: formData.startDate,
            endDate: formData.endDate,
            usageLimit: Number(formData.usageLimit),
          }
        : voucher,
    );
    setVouchers(updatedVouchers);
    setIsDetailOpen(false);
    setSelectedVoucher(null);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      type: 'percentage',
      value: '',
      minOrder: '',
      maxDiscount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openDetailDialog = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
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
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Danh sách voucher</h2>
          <p className="text-muted-foreground">Quản lý tất cả voucher của bạn</p>
        </div>
       <CreateVoucherDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onCreateVoucher={handleCreateVoucher} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã voucher</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Đã sử dụng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell className="font-mono font-medium">{voucher.code}</TableCell>
                  <TableCell>{voucher.name}</TableCell>
                  <TableCell>{voucher.type === 'percentage' ? 'Phần trăm' : 'Cố định'}</TableCell>
                  <TableCell>
                    {voucher.type === 'percentage'
                      ? `${voucher.value}%`
                      : `${voucher.value.toLocaleString('vi-VN')}đ`}
                  </TableCell>
                  <TableCell>
                    {voucher.usedCount}/{voucher.usageLimit}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        voucher.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : voucher.status === 'expired'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {voucher.status === 'active'
                        ? 'Hoạt động'
                        : voucher.status === 'expired'
                          ? 'Hết hạn'
                          : 'Không hoạt động'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => openDetailDialog(voucher)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết voucher</DialogTitle>
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
            <Button onClick={handleUpdate} className="w-full">
              Cập nhật voucher
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
