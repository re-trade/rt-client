import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SellerFormData } from '@/hooks/useSellerRegistration';
import { Camera, CheckCircle2, Shield, Upload, X } from 'lucide-react';
import React, { useState } from 'react';

type IdentityInfoStepProps = {
  formData: SellerFormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFieldBlur: (name: keyof SellerFormData) => void;
  errors: Record<string, string>;
};

export default function IdentityInfoStep({
  formData,
  handleChange,
  handleFileChange,
  handleFieldBlur,
  errors,
}: IdentityInfoStepProps) {
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const handleFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        // Handle file size error - you might want to show a toast or set an error state
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setFrontPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      handleFileChange(e);
    }
  };

  const handleBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        // Handle file size error - you might want to show a toast or set an error state
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setBackPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      handleFileChange(e);
    }
  };

  const removeFrontImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFrontPreview(null);

    const inputElement = document.getElementById('identityFrontImage') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }

    const event = {
      target: {
        name: 'identityFrontImage',
        files: null,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileChange(event);
  };

  const removeBackImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBackPreview(null);

    const inputElement = document.getElementById('identityBackImage') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }

    const event = {
      target: {
        name: 'identityBackImage',
        files: null,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileChange(event);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-amber-900">Xác minh danh tính</h2>
        <p className="text-amber-700/70 text-sm leading-relaxed max-w-md mx-auto">
          Vui lòng cung cấp thông tin CMND/CCCD để đảm bảo tính minh bạch và an toàn cho cộng đồng
        </p>
      </div>

      {/* Image Upload Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Front Image Card */}
        <Card
          className={`border-2 transition-colors ${
            errors.identityFrontImage
              ? 'border-red-300 bg-red-50/30'
              : frontPreview
                ? 'border-green-300 bg-green-50/30'
                : 'border-amber-200'
          }`}
        >
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 border-b border-amber-200">
            <h3 className="font-semibold text-amber-900 flex items-center gap-2">
              CMND/CCCD - Mặt trước
              <span className="text-red-600">*</span>
            </h3>
            <p className="text-sm text-amber-700/70 mt-1">Chụp rõ nét toàn bộ mặt trước</p>
          </div>

          <CardContent className="p-6">
            {frontPreview ? (
              <div className="relative group">
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={frontPreview}
                    alt="CMND/CCCD mặt trước"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Success indicator */}
                <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('identityFrontImage')?.click();
                    }}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Chụp lại
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={removeFrontImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-amber-50/50 ${
                  errors.identityFrontImage ? 'border-red-300 bg-red-50/50' : 'border-amber-300'
                }`}
                onClick={() => document.getElementById('identityFrontImage')?.click()}
              >
                <Upload
                  className={`h-12 w-12 mb-3 ${
                    errors.identityFrontImage ? 'text-red-400' : 'text-amber-400'
                  }`}
                />
                <p className="font-medium text-amber-900 mb-1">Nhấn để tải ảnh lên</p>
                <p className="text-xs text-amber-600">PNG, JPG (tối đa 5MB)</p>
              </div>
            )}

            <input
              id="identityFrontImage"
              name="identityFrontImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFrontImageChange}
            />

            {errors.identityFrontImage && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.identityFrontImage}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back Image Card */}
        <Card
          className={`border-2 transition-colors ${
            errors.identityBackImage
              ? 'border-red-300 bg-red-50/30'
              : backPreview
                ? 'border-green-300 bg-green-50/30'
                : 'border-amber-200'
          }`}
        >
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 border-b border-amber-200">
            <h3 className="font-semibold text-amber-900 flex items-center gap-2">
              CMND/CCCD - Mặt sau
              <span className="text-red-600">*</span>
            </h3>
            <p className="text-sm text-amber-700/70 mt-1">Chụp rõ nét toàn bộ mặt sau</p>
          </div>

          <CardContent className="p-6">
            {backPreview ? (
              <div className="relative group">
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={backPreview}
                    alt="CMND/CCCD mặt sau"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Success indicator */}
                <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('identityBackImage')?.click();
                    }}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Chụp lại
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={removeBackImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-amber-50/50 ${
                  errors.identityBackImage ? 'border-red-300 bg-red-50/50' : 'border-amber-300'
                }`}
                onClick={() => document.getElementById('identityBackImage')?.click()}
              >
                <Upload
                  className={`h-12 w-12 mb-3 ${
                    errors.identityBackImage ? 'text-red-400' : 'text-amber-400'
                  }`}
                />
                <p className="font-medium text-amber-900 mb-1">Nhấn để tải ảnh lên</p>
                <p className="text-xs text-amber-600">PNG, JPG (tối đa 5MB)</p>
              </div>
            )}

            <input
              id="identityBackImage"
              name="identityBackImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBackImageChange}
            />

            {errors.identityBackImage && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.identityBackImage}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Reminder */}
      {(!frontPreview || !backPreview) && (
        <Card className="border-amber-300 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-amber-800 font-medium text-sm">
                  Vui lòng tải lên đầy đủ cả hai mặt để tiếp tục
                </p>
                <p className="text-amber-700 text-xs mt-1">
                  Đảm bảo ảnh rõ nét, không bị mờ và có thể đọc được toàn bộ thông tin
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ID Number Input */}
      <Card className="border-amber-200">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <Label htmlFor="identityNumber" className="text-amber-900 font-medium">
              Số CMND/CCCD
              <span className="text-red-600 ml-1">*</span>
            </Label>
            <Input
              id="identityNumber"
              name="identityNumber"
              value={formData.identityNumber}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('identityNumber')}
              placeholder="Nhập chính xác số trên giấy tờ"
              className={`h-12 border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 ${
                errors.identityNumber ? 'border-red-400 focus:border-red-500' : ''
              }`}
            />
            {errors.identityNumber && (
              <p className="text-red-600 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                {errors.identityNumber}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">Cam kết bảo mật thông tin</h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                Thông tin định danh của bạn được mã hóa và bảo mật tuyệt đối. Chúng tôi chỉ sử dụng
                thông tin này để xác minh danh tính theo quy định pháp luật và không chia sẻ với bất
                kỳ bên thứ ba nào không được ủy quyền.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
