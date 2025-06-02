'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onAdd: (data: Address) => void;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export default function AddAddressDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    name: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false,
  });

  const handleCreate = () => {
    const newAddress: Address = {
      id: Date.now().toString(),
      ...formData,
    };
    onAdd(newAddress);
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: '',
      isDefault: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm địa chỉ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm địa chỉ mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {['name', 'phone', 'address', 'ward', 'district', 'city'].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>
                {field === 'name'
                  ? 'Họ và tên'
                  : field === 'phone'
                    ? 'Số điện thoại'
                    : field === 'city'
                      ? 'Tỉnh/Thành phố'
                      : field}
              </Label>
              <Input
                id={field}
                value={(formData as any)[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Switch
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
            />
            <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
          </div>
          <Button onClick={handleCreate} className="w-full">
            Thêm địa chỉ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
