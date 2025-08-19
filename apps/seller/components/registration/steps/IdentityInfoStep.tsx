'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegistration } from '@/context/RegistrationContext';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useRegistrationValidation } from '@/hooks/use-registration-validation';
import { AlertTriangle, Camera, CheckCircle2, Shield, Upload, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export default function IdentityInfoStep() {
  const { formData, updateField, errors, touched, setTouched } = useRegistration();
  const { validateField } = useRegistrationValidation();
  const { handleIdentityFrontUpload, handleIdentityBackUpload, handleFileChange, removeFile } =
    useFileUpload();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateField(name as keyof typeof formData, value);

    if (touched[name]) {
      validateField(name as keyof typeof formData, value);
    }
  };

  const handleInputBlur = (name: string) => {
    setTouched(name, true);
    validateField(name as keyof typeof formData, formData[name as keyof typeof formData]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Xác minh danh tính</h2>
        <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
          Vui lòng cung cấp thông tin CMND/CCCD để đảm bảo tính minh bạch và an toàn cho cộng đồng
        </p>
      </div>

      {/* Security Notice */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Bảo mật thông tin</h4>
              <p className="text-blue-700 text-sm leading-relaxed">
                Thông tin cá nhân của bạn được bảo mật tuyệt đối và chỉ được sử dụng để xác minh
                danh tính. Chúng tôi tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu cá nhân.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identity Number Input */}
      <Card className="border-orange-200 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label htmlFor="identityNumber" className="text-gray-900 font-medium">
              Số CMND/CCCD
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="identityNumber"
              name="identityNumber"
              value={formData.identityNumber}
              onChange={handleInputChange}
              onBlur={() => handleInputBlur('identityNumber')}
              placeholder="Nhập chính xác số trên giấy tờ"
              className={`h-12 border-2 transition-all duration-200 ${
                errors.identityNumber
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-orange-200 focus:border-orange-400 focus:ring-orange-100'
              }`}
            />
            {errors.identityNumber && (
              <p className="text-red-600 text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {errors.identityNumber}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Identity Images Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Front Side */}
        <Card className="border-orange-200 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label className="text-gray-900 font-medium">
                Ảnh mặt trước CMND/CCCD
                <span className="text-red-500 ml-1">*</span>
              </Label>

              <div className="space-y-4">
                <div className="relative w-full h-48 border-2 border-dashed border-orange-200 rounded-lg overflow-hidden bg-orange-50">
                  {formData.identityFrontImage ? (
                    <Image
                      src={URL.createObjectURL(formData.identityFrontImage)}
                      alt="CMND/CCCD mặt trước"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-orange-400">
                      <Camera className="w-12 h-12 mb-2" />
                      <p className="text-sm text-center">
                        Chụp ảnh mặt trước
                        <br />
                        CMND/CCCD
                      </p>
                    </div>
                  )}

                  <input
                    id="identity-front-upload"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e, handleIdentityFrontUpload)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    onClick={() => document.getElementById('identity-front-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Chọn ảnh
                  </Button>

                  {formData.identityFrontImage && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() => removeFile('identityFrontImage')}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Xóa
                    </Button>
                  )}
                </div>
              </div>

              {errors.identityFrontImage && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <X className="w-4 h-4" />
                  {errors.identityFrontImage}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Back Side */}
        <Card className="border-orange-200 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label className="text-gray-900 font-medium">
                Ảnh mặt sau CMND/CCCD
                <span className="text-red-500 ml-1">*</span>
              </Label>

              <div className="space-y-4">
                <div className="relative w-full h-48 border-2 border-dashed border-orange-200 rounded-lg overflow-hidden bg-orange-50">
                  {formData.identityBackImage ? (
                    <Image
                      src={URL.createObjectURL(formData.identityBackImage)}
                      alt="CMND/CCCD mặt sau"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-orange-400">
                      <Camera className="w-12 h-12 mb-2" />
                      <p className="text-sm text-center">
                        Chụp ảnh mặt sau
                        <br />
                        CMND/CCCD
                      </p>
                    </div>
                  )}

                  <input
                    id="identity-back-upload"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e, handleIdentityBackUpload)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    onClick={() => document.getElementById('identity-back-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Chọn ảnh
                  </Button>

                  {formData.identityBackImage && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() => removeFile('identityBackImage')}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Xóa
                    </Button>
                  )}
                </div>
              </div>

              {errors.identityBackImage && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <X className="w-4 h-4" />
                  {errors.identityBackImage}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guidelines */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Hướng dẫn chụp ảnh CMND/CCCD
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-700">
            <div className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Chụp ảnh rõ nét, đầy đủ 4 góc của thẻ</span>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Đảm bảo ánh sáng đủ, không bị mờ hoặc chói</span>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Thông tin trên thẻ phải đọc được rõ ràng</span>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Không che khuất bất kỳ thông tin nào</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Lưu ý quan trọng</h4>
              <p className="text-yellow-700 text-sm leading-relaxed">
                Việc cung cấp thông tin sai lệch hoặc giả mạo có thể dẫn đến việc từ chối đăng ký và
                có thể bị xử lý theo quy định pháp luật. Vui lòng đảm bảo tất cả thông tin là chính
                xác.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
