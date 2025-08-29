'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlatformFee, PlatformFeeCreateUpdate } from '@/services/platform-fee.api';
import { useEffect, useState } from 'react';

interface PlatformFeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlatformFeeCreateUpdate) => Promise<void>;
  initialData?: PlatformFee;
  title: string;
}

export function PlatformFeeDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: PlatformFeeDialogProps) {
  const [formData, setFormData] = useState<PlatformFeeCreateUpdate>({
    minPrice: 0,
    maxPrice: null,
    feeRate: 0,
    description: '',
  });

  const [errors, setErrors] = useState({
    minPrice: '',
    maxPrice: '',
    feeRate: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        minPrice: initialData.minPrice,
        maxPrice: initialData.maxPrice,
        feeRate: initialData.feeRate,
        description: initialData.description || '',
      });
    } else if (isOpen) {
      setFormData({
        minPrice: 0,
        maxPrice: null,
        feeRate: 0,
        description: '',
      });
    }
    setErrors({
      minPrice: '',
      maxPrice: '',
      feeRate: '',
      description: '',
    });
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'minPrice' || name === 'maxPrice' || name === 'feeRate') {
      if (name === 'maxPrice' && (value === '' || value === '0')) {
        setFormData((prev) => ({
          ...prev,
          [name]: null,
        }));
      } else {
        const numValue = parseFloat(parseFloat(value).toFixed(2));
        setFormData((prev) => ({
          ...prev,
          [name]: isNaN(numValue) ? 0 : numValue,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      minPrice: '',
      maxPrice: '',
      feeRate: '',
      description: '',
    };

    let isValid = true;

    if (formData.minPrice < 0) {
      newErrors.minPrice = 'Giá tối thiểu không thể là số âm';
      isValid = false;
    }

    if (formData.maxPrice !== null && formData.maxPrice <= formData.minPrice) {
      newErrors.maxPrice = 'Giá tối đa phải lớn hơn giá tối thiểu';
      isValid = false;
    }

    if (formData.feeRate < 0 || formData.feeRate > 100) {
      newErrors.feeRate = 'Tỉ lệ phí phải nằm trong khoảng từ 0 đến 100';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">{title}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Cập nhật thông tin cấu hình phí nền tảng.'
              : 'Tạo mới cấu hình phí nền tảng.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minPrice" className="text-gray-700">
                  Giá tối thiểu
                </Label>
                <Input
                  id="minPrice"
                  name="minPrice"
                  type="number"
                  step="0.01"
                  value={formData.minPrice}
                  onChange={handleChange}
                  className={`border ${errors.minPrice ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.minPrice && <p className="text-red-500 text-sm">{errors.minPrice}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPrice" className="text-gray-700">
                  Giá tối đa
                </Label>
                <Input
                  id="maxPrice"
                  name="maxPrice"
                  type="number"
                  step="0.01"
                  value={formData.maxPrice === null ? '' : formData.maxPrice}
                  onChange={handleChange}
                  className={`border ${errors.maxPrice ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Để trống cho không giới hạn"
                />
                {errors.maxPrice && <p className="text-red-500 text-sm">{errors.maxPrice}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feeRate" className="text-gray-700">
                Tỉ lệ phí (%)
              </Label>
              <Input
                id="feeRate"
                name="feeRate"
                type="number"
                step="0.01"
                value={formData.feeRate}
                onChange={handleChange}
                className={`border ${errors.feeRate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.feeRate && <p className="text-red-500 text-sm">{errors.feeRate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">
                Mô tả
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`border ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 text-white hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : initialData ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
