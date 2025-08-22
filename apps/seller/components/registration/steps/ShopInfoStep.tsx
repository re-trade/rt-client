'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRegistration } from '@/context/RegistrationContext';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useRegistrationValidation } from '@/hooks/use-registration-validation';
import { createNumericInputHandler, preventNonNumericInput } from '@/utils/input-helpers';
import { Camera, CheckCircle2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export default function ShopInfoStep() {
  const { formData, updateField, errors, touched, setTouched } = useRegistration();
  const { validateField } = useRegistrationValidation();
  const {
    handleAvatarUpload,
    handleBackgroundUpload,
    handleFileChange,
    removeFile,
    getUploadProgress,
    isUploading,
  } = useFileUpload();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    updateField(name as keyof typeof formData, value);

    if (touched[name]) {
      validateField(name as keyof typeof formData, value);
    }
  };

  const handlePhoneInputChange = createNumericInputHandler((e) => {
    const { value } = e.target;
    updateField('phoneNumber', value);

    if (touched.phoneNumber) {
      validateField('phoneNumber', value);
    }
  }, 10);

  const handleInputBlur = (name: string) => {
    setTouched(name, true);
    validateField(name as keyof typeof formData, formData[name as keyof typeof formData]);
  };

  const avatarProgress = getUploadProgress('avatarUrl');
  const backgroundProgress = getUploadProgress('background');
  const avatarLoading = isUploading('avatarUrl');
  const backgroundLoading = isUploading('background');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto">
          <Camera className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Tạo hồ sơ người bán</h2>
        <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
          Hãy cho chúng tôi biết về bạn để tạo một hồ sơ người bán hấp dẫn
        </p>
      </div>

      {/* Avatar Upload Section */}
      <Card className="border-orange-200 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label className="text-gray-900 font-medium">
              Ảnh đại diện
              <span className="text-red-500 ml-1">*</span>
            </Label>

            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-orange-200 overflow-hidden bg-orange-50 flex items-center justify-center">
                  {formData.avatarUrl ? (
                    <Image
                      src={
                        typeof formData.avatarUrl === 'string'
                          ? formData.avatarUrl
                          : URL.createObjectURL(formData.avatarUrl)
                      }
                      alt="Avatar"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-orange-400" />
                  )}
                </div>

                {avatarLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="text-white text-xs">{avatarProgress}%</div>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    disabled={avatarLoading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Chọn ảnh
                  </Button>

                  {formData.avatarUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() => removeFile('avatarUrl')}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Xóa
                    </Button>
                  )}
                </div>

                <p className="text-sm text-gray-500">Kích thước tối đa 5MB. Định dạng: JPG, PNG</p>

                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, handleAvatarUpload)}
                />
              </div>
            </div>

            {errors.avatarUrl && (
              <p className="text-red-600 text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {errors.avatarUrl}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Background Upload Section */}
      <Card className="border-orange-200 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label className="text-gray-900 font-medium">
              Ảnh bìa cửa hàng
              <span className="text-red-500 ml-1">*</span>
            </Label>

            <div className="space-y-4">
              <div className="relative w-full h-48 border-2 border-dashed border-orange-200 rounded-lg overflow-hidden bg-orange-50">
                {formData.background ? (
                  <Image
                    src={
                      typeof formData.background === 'string'
                        ? formData.background
                        : URL.createObjectURL(formData.background)
                    }
                    alt="Background"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-orange-400">
                    <Upload className="w-12 h-12 mb-2" />
                    <p className="text-sm">Nhấn để chọn ảnh bìa</p>
                  </div>
                )}

                {backgroundLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white">{backgroundProgress}%</div>
                  </div>
                )}

                <input
                  id="background-upload"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, handleBackgroundUpload)}
                />
              </div>

              {formData.background && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => removeFile('background')}
                >
                  <X className="w-4 h-4 mr-2" />
                  Xóa ảnh bìa
                </Button>
              )}
            </div>

            {errors.background && (
              <p className="text-red-600 text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {errors.background}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <div className="space-y-6">
        <div>
          <Label htmlFor="shopName" className="text-gray-900 font-medium mb-3 block">
            Tên người bán
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="shopName"
            name="shopName"
            value={formData.shopName}
            onChange={handleInputChange}
            onBlur={() => handleInputBlur('shopName')}
            placeholder="Bạn muốn chúng tôi gọi bạn là gì?"
            className={`h-12 border-2 transition-all duration-200 ${
              errors.shopName
                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                : 'border-orange-200 focus:border-orange-400 focus:ring-orange-100'
            }`}
          />
          {errors.shopName && (
            <p className="mt-2 text-red-600 text-sm flex items-center gap-2">
              <X className="w-4 h-4" />
              {errors.shopName}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="description" className="text-gray-900 font-medium mb-3 block">
            Mô tả về bạn
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            onBlur={() => handleInputBlur('description')}
            placeholder="Hãy chia sẻ về bản thân và những gì bạn muốn bán..."
            rows={4}
            className={`border-2 transition-all duration-200 resize-none ${
              errors.description
                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                : 'border-orange-200 focus:border-orange-400 focus:ring-orange-100'
            }`}
          />
          {errors.description && (
            <p className="mt-2 text-red-600 text-sm flex items-center gap-2">
              <X className="w-4 h-4" />
              {errors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="email" className="text-gray-900 font-medium mb-3 block">
              Email liên hệ
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => handleInputBlur('email')}
              placeholder="email@example.com"
              className={`h-12 border-2 transition-all duration-200 ${
                errors.email
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-orange-200 focus:border-orange-400 focus:ring-orange-100'
              }`}
            />
            {errors.email && (
              <p className="mt-2 text-red-600 text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="text-gray-900 font-medium mb-3 block">
              Số điện thoại
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              value={formData.phoneNumber}
              onChange={handlePhoneInputChange}
              onKeyDown={preventNonNumericInput}
              onBlur={() => handleInputBlur('phoneNumber')}
              placeholder="0123456789"
              className={`h-12 border-2 transition-all duration-200 ${
                errors.phoneNumber
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-orange-200 focus:border-orange-400 focus:ring-orange-100'
              }`}
            />
            {errors.phoneNumber && (
              <p className="mt-2 text-red-600 text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {errors.phoneNumber}
              </p>
            )}
            {!errors.phoneNumber && (
              <p className="mt-2 text-gray-500 text-sm">Chỉ nhập số, tối đa 10 chữ số</p>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Mẹo tạo hồ sơ hấp dẫn
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-700">
            <div className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Chọn tên ngắn gọn, dễ nhớ và thể hiện được cá tính của bạn</span>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Viết mô tả chân thực và thu hút về những gì bạn bán</span>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Sử dụng ảnh đại diện rõ nét và chuyên nghiệp</span>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Chọn ảnh bìa thể hiện phong cách và sản phẩm của bạn</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
