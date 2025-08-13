'use client';

import {
  AlertCircle,
  Building2,
  FileText,
  Image as ImageIcon,
  Package,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { FancyMultiSelect } from '@/components/common/MultiSectCate';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useBrandManager from '@/hooks/use-brand-manager';
import { BrandInput } from '@/services/brand.api';
import { storageApi } from '@/services/storage.api';
import Image from 'next/image';
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
    logo: '',
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

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user makes changes
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleChooseLogo = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleLogoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setErrors((prev) => ({ ...prev, logo: 'Vui lòng chọn file hình ảnh' }));
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErrors((prev) => ({ ...prev, logo: 'Kích thước file không được vượt quá 5MB' }));
          return;
        }

        if (logoPreview) {
          URL.revokeObjectURL(logoPreview);
        }
        const imageUrl = URL.createObjectURL(file);
        setLogoPreview(imageUrl);
        setLogoFile(file);

        // Clear logo error
        if (errors.logo) {
          setErrors((prev) => ({ ...prev, logo: '' }));
        }
      }
      e.target.value = ''; // Reset input
    },
    [logoPreview, errors.logo],
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
      logo: '',
    });
    setErrors({});
    handleRemoveLogo();
  }, [handleRemoveLogo]);

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Tên nhãn hàng là bắt buộc';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên nhãn hàng phải có ít nhất 2 ký tự';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Tên nhãn hàng không được vượt quá 100 ký tự';
    }

    // Validate logo
    if (!logoFile) {
      newErrors.logo = 'Logo là bắt buộc';
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Mô tả phải có ít nhất 10 ký tự';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
    }

    // Validate categories
    if (formData.categoryIds.length === 0) {
      newErrors.categoryIds = 'Vui lòng chọn ít nhất một danh mục';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, logoFile]);

  const handleAddBrand = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let logoUrl = '';
      if (!logoFile) {
        logoUrl = await storageApi.fileUpload(logoFile!);
      }
      const request: BrandInput = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        categoryIds: formData.categoryIds,
        imgUrl: logoUrl,
      };
      await addBrand(request);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating brand:', error);
      // Handle API errors here if needed
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, logoFile, addBrand, onClose, resetForm, validateForm]);

  const handleDialogClose = useCallback(() => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  }, [isSubmitting, resetForm, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Tạo nhãn hàng mới
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <FileText className="w-5 h-5 text-blue-600" />
              Thông tin cơ bản
            </h3>

            <FormField label="Tên nhãn hàng" required error={errors.name}>
              <Input
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Nhập tên nhãn hàng..."
                className="h-11"
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label="Mô tả" required error={errors.description}>
              <Textarea
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Nhập mô tả về nhãn hàng..."
                rows={4}
                className="resize-none"
                disabled={isSubmitting}
              />
              <div className="text-xs text-gray-500 text-right">
                {formData.description.length}/500 ký tự
              </div>
            </FormField>
          </div>

          {/* Logo Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <ImageIcon className="w-5 h-5 text-green-600" />
              Logo nhãn hàng
            </h3>

            <FormField label="Logo" required error={errors.logo}>
              <div className="space-y-3">
                {logoPreview ? (
                  <div className="relative inline-block">
                    <div className="w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <Image src={logoPreview} alt="Logo preview" fill className="object-contain" />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      onClick={handleRemoveLogo}
                      disabled={isSubmitting}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={handleChooseLogo}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click để chọn logo</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 5MB</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  disabled={isSubmitting}
                />

                {!logoPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleChooseLogo}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Chọn logo
                  </Button>
                )}
              </div>
            </FormField>
          </div>

          {/* Categories Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <Package className="w-5 h-5 text-purple-600" />
              Danh mục sản phẩm
            </h3>

            <FormField label="Chọn danh mục" required error={errors.categoryIds}>
              <FancyMultiSelect
                value={formData.categoryIds}
                onChange={(selected) => handleFormChange('categoryIds', selected)}
              />
            </FormField>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleDialogClose}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 mr-2" />
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleAddBrand}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Building2 className="w-4 h-4 mr-2" />
                Tạo nhãn hàng
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBrandDialog;
