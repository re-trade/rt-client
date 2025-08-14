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
import { TBrand } from '@/services/brand.api';
import { storageApi } from '@/services/storage.api';
import { AlertCircle, Edit, Eye, Package, RefreshCw, Upload, X } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { FancyMultiSelect } from '../common/MultiSectCate';
import { on } from 'events';

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

interface ViewUpdateBrandDialogProps {
  brand: TBrand;
  isOpen: boolean;
  onClose: () => void;
}

const ViewUpdateBrandDialog: React.FC<ViewUpdateBrandDialogProps> = ({
  brand,
  isOpen,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryIds: [] as string[],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData | 'logo', string>>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isChanged, setIsChanged] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { fetchCategories, categories, categoriesLoading, categoriesError, updateBrand } =
    useBrandManager();

  // Initialize form data when brand changes
  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || '',
        description: brand.description || '',
        categoryIds: brand.categories?.map((cat) => cat.id) || [],
      });
      setLogoPreview(brand.imgUrl || '');
    }
  }, [brand]);

  // Fetch categories when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  // Track changes to enable/disable Save button
  useEffect(() => {
    if (!brand) return;
    const originalCategoryIds = brand.categories?.map((cat) => cat.id) || [];
    const changed =
      formData.name.trim() !== (brand.name || '') ||
      formData.description.trim() !== (brand.description || '') ||
      formData.categoryIds.sort().join(',') !== originalCategoryIds.sort().join(',') ||
      logoFile !== null;
    setIsChanged(changed);
  }, [formData, logoFile, brand]);

  // Cleanup logo preview URL when dialog closes or logo changes
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview !== brand?.imgUrl) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview, brand?.imgUrl]);

  const handleChooseLogo = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleLogoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          toast.error('Vui lòng chọn file hình ảnh');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Kích thước file không được vượt quá 5MB');
          return;
        }

        // Clean up previous preview if it's not the original brand image
        if (logoPreview && logoPreview !== brand?.imgUrl) {
          URL.revokeObjectURL(logoPreview);
        }

        const imageUrl = URL.createObjectURL(file);
        setLogoPreview(imageUrl);
        setLogoFile(file);

        if (errors.logo) {
          setErrors((prev) => ({ ...prev, logo: '' }));
        }
      }
      e.target.value = ''; // Reset input
    },
    [logoPreview, brand?.imgUrl, errors.logo],
  );

  const handleRemoveLogo = useCallback(() => {
    if (logoPreview && logoPreview !== brand?.imgUrl) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(brand?.imgUrl || '');
    setLogoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [logoPreview, brand?.imgUrl]);

  const resetForm = useCallback(() => {
    if (brand) {
      setFormData({
        name: brand.name || '',
        description: brand.description || '',
        categoryIds: brand.categories?.map((cat) => cat.id) || [],
      });
      setLogoPreview(brand.imgUrl || '');
    }
    setErrors({});
    setLogoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [brand]);

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof typeof formData | 'logo', string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên nhãn hàng là bắt buộc';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên nhãn hàng phải có ít nhất 2 ký tự';
    }

    if (!logoFile && !logoPreview) {
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
  }, [formData, logoFile, logoPreview]);

  const handleUpdate = useCallback(async () => {
    if (!validateForm()) {
      toast.error('Vui lòng sửa các lỗi trong biểu mẫu');
      return;
    }
    if (!brand) return;

    setIsSubmitting(true);
    try {
      let finalImgUrl = logoPreview;
      if (logoFile) {
        finalImgUrl = await storageApi.fileUpload(logoFile);
      }


      console.log('Updating brand with data:', {
        id: brand.id,
        name: formData.name.trim(),
        imgUrl: finalImgUrl,
        description: formData.description.trim(),
        categoryIds: formData.categoryIds,
      });

      const result = await updateBrand(brand.id, {
        name: formData.name.trim(),
        imgUrl: finalImgUrl,
        description: formData.description.trim(),
        categoryIds: formData.categoryIds,
      });

      console.log('Update brand result:', result );

      if (result.success) {
        toast.success('Cập nhật nhãn hàng thành công!');
        // Update the brand object with new data
        Object.assign(brand, {
          name: formData.name.trim(),
          imgUrl: finalImgUrl,
          description: formData.description.trim(),
          categories: categories.filter((cat) => formData.categoryIds.includes(cat.id)),
        });
        setIsChanged(false);
        resetForm();
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Đã xảy ra lỗi khi cập nhật nhãn hàng');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, logoFile, logoPreview, brand, updateBrand, validateForm]);

  const handleClose = useCallback(() => {
    onClose();
    resetForm();
  }, [onClose, resetForm]);

  if (!brand) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Eye className="w-6 h-6 text-blue-600" />
            Thông tin nhãn hàng
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Xem và chỉnh sửa thông tin nhãn hàng trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 pt-6">
          {/* Error notification */}
          {categoriesError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium">Lỗi tải danh mục: {categoriesError}</span>
              </div>
            </div>
          )}

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
                      Chọn ảnh mới
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
                      <div className="relative w-55 h-40 group">
                        <Image
                          src={logoPreview}
                          alt="Logo Preview"
                          fill
                          className="rounded-lg object-cover border-2 border-gray-200"
                        />
                        {logoFile && (
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        {logoFile && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg text-center">
                            Ảnh mới
                          </div>
                        )}
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
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
            
              <FancyMultiSelect
                value={formData.categoryIds}
                onChange={(selected) => setFormData((prev) => ({ ...prev, categoryIds: selected }))}
              />
    
            </FormField>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          <Button
            variant="outline"
            onClick={resetForm}
            disabled={isSubmitting}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Đặt lại
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={!isChanged || isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUpdateBrandDialog;
