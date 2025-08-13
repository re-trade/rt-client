'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Textarea } from '@/components/ui/textarea';
import useBrandManager from '@/hooks/use-brand-manager';
import { storageApi } from '@/services/storage.api';
import { AlertCircle, Package, Plus, RefreshCw, Upload, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, required = false, error, children }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    {children}
    {error && (
      <p className="text-sm text-red-600 flex items-center gap-1">
        <AlertCircle className="h-3 w-3 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

interface CreateBrandDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBrandDialog: React.FC<CreateBrandDialogProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryIds: [] as string[],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fetchCategories, categories, categoriesLoading, categoriesError, addBrand } =
    useBrandManager();

  // Fetch categories when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  // Cleanup logo preview URL when dialog closes or logo changes
  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleChooseLogo = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleLogoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (logoPreview) {
          URL.revokeObjectURL(logoPreview);
        }
        const imageUrl = URL.createObjectURL(file);
        setLogoPreview(imageUrl);
        setLogoFile(file);
      }
      e.target.value = ''; // Reset input
    },
    [logoPreview],
  );

  const handleRemoveLogo = useCallback(() => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
      setLogoPreview('');
      setLogoFile(null);
    }
  }, [logoPreview]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      categoryIds: [],
    });
    setErrors({});
    handleRemoveLogo();
  }, [handleRemoveLogo]);

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên nhãn hàng là bắt buộc';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên nhãn hàng phải có ít nhất 2 ký tự';
    }

    if (!logoFile) {
      newErrors.logo = 'Logo là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả nhãn hàng là bắt buộc';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Mô tả phải có ít nhất 10 ký tự';
    }

    if (formData.categoryIds.length === 0) {
      newErrors.categoryIds = 'Vui lòng chọn ít nhất một danh mục';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, logoFile]);

  const handleAddBrand = useCallback(async () => {
    if (!validateForm()) {
      toast.error('Vui lòng sửa các lỗi trong biểu mẫu');
      return;
    }

    setIsSubmitting(true);
    try {
      const logoUrl = await storageApi.fileUpload(logoFile!);
      const result = await addBrand({
        name: formData.name.trim(),
        imgUrl: logoUrl,
        description: formData.description.trim(),
        categoryIds: formData.categoryIds,
      });

      if (result.success) {
        toast.success('Thêm nhãn hàng thành công!');
        onClose();
        resetForm();
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Đã xảy ra lỗi khi thêm nhãn hàng');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, logoFile, addBrand, onClose, resetForm, validateForm]);

  const handleClose = useCallback(() => {
    onClose();
    resetForm();
  }, [onClose, resetForm]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Thêm nhãn hàng mới
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Điền đầy đủ thông tin để tạo nhãn hàng mới trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 pt-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <Package className="w-5 h-5 text-blue-600" />
              Thông tin cơ bản
            </h3>

            <div className="space-y-4">
              <FormField label="Tên nhãn hàng" required error={errors.name}>
                <Input
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="VD: Apple, Samsung, Nike..."
                  disabled={isSubmitting}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </FormField>
            </div>
          </div>

          {/* Logo Upload Section */}
          <div className="space-y-4">
            <FormField label="Logo" required error={errors.logo}>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleChooseLogo}
                      disabled={isSubmitting}
                      className="h-11 px-4 border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Chọn ảnh
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </div>

                  <div className="flex-1 flex justify-center">
                    {logoPreview ? (
                      <div className="relative w-40 h-40 group">
                        <Image
                          src={logoPreview}
                          alt="Logo Preview"
                          fill
                          className="rounded-lg object-cover border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Chưa có ảnh</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </FormField>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <Package className="w-5 h-5 text-purple-600" />
              Mô tả nhãn hàng
            </h3>

            <FormField label="Mô tả nhãn hàng" required error={errors.description}>
              <Textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, description: e.target.value }));
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                placeholder="Mô tả về nhãn hàng, lịch sử, giá trị cốt lõi và điểm đặc biệt..."
                rows={4}
                disabled={isSubmitting}
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
          </div>

          {/* Categories Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <Package className="w-5 h-5 text-green-600" />
              Danh mục sản phẩm
            </h3>

            <FormField label="Danh mục sản phẩm" required error={errors.categoryIds}>
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-8 border border-gray-300 rounded-lg bg-gray-50">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2 text-blue-600" />
                  <span className="text-sm text-gray-600">Đang tải danh mục...</span>
                </div>
              ) : (
                <MultiSelect
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                  selected={formData.categoryIds}
                  onChange={(selected) => {
                    setFormData((prev) => ({ ...prev, categoryIds: selected }));
                    if (errors.categoryIds) setErrors((prev) => ({ ...prev, categoryIds: '' }));
                  }}
                  placeholder="Chọn một hoặc nhiều danh mục..."
                />
              )}
            </FormField>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleAddBrand}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Đang thêm...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Thêm nhãn hàng
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBrandDialog;
