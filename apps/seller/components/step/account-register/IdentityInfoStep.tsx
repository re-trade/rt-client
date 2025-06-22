import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SellerFormData } from '@/hooks/useSellerRegistration';
import { Camera, CheckCircle2, Upload } from 'lucide-react';
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
      const reader = new FileReader();

      reader.onload = () => {
        setFrontPreview(reader.result as string);
      };

      reader.readAsDataURL(file);
      handleFileChange(e);
    }
  };

  const removeFrontImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFrontPreview(null);

    if (document.getElementById('identityFrontImage')) {
      (document.getElementById('identityFrontImage') as HTMLInputElement).value = '';
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

    if (document.getElementById('identityBackImage')) {
      (document.getElementById('identityBackImage') as HTMLInputElement).value = '';
    }

    const event = {
      target: {
        name: 'identityBackImage',
        files: null,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileChange(event);
  };

  const handleBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setBackPreview(reader.result as string);
      };

      reader.readAsDataURL(file);
      handleFileChange(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Thông tin định danh</h2>
        <p className="text-gray-500 mt-1">
          Cung cấp thông tin CMND/CCCD để xác minh danh tính người bán
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`overflow-hidden ${errors.identityFrontImage ? 'border-red-500' : ''}`}>
          <CardContent className="p-0">
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="font-medium text-gray-900">
                CMND/CCCD - Mặt trước 📄 <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-gray-500">Tải lên ảnh mặt trước của CMND/CCCD</p>
            </div>
            <div className="p-6 flex flex-col items-center">
              {frontPreview ? (
                <div className="relative w-full h-48 mb-4">
                  <img
                    src={frontPreview}
                    alt="ID Card Front"
                    className="w-full h-full object-contain rounded-md"
                  />
                  <div className="absolute bottom-2 right-2 flex space-x-2 z-10">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-500 bg-opacity-80 hover:bg-opacity-100"
                      onClick={removeFrontImage}
                    >
                      Xóa
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white bg-opacity-80 hover:bg-opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('identityFrontImage')?.click();
                      }}
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      Đổi ảnh
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2 bg-green-100 text-green-700 p-1 rounded-full">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
              ) : (
                <div
                  className={`w-full h-48 border-2 border-dashed rounded-md
                  ${errors.identityFrontImage ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors`}
                  onClick={() => document.getElementById('identityFrontImage')?.click()}
                >
                  <Upload
                    className={`h-10 w-10 mb-2 ${errors.identityFrontImage ? 'text-red-400' : 'text-gray-400'}`}
                  />
                  <p className="text-sm font-medium">Nhấp để tải lên</p>
                  <p className="text-xs text-gray-500">PNG, JPG (tối đa 5MB)</p>
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
                <p className="text-red-500 text-xs mt-2">{errors.identityFrontImage}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={`overflow-hidden ${errors.identityBackImage ? 'border-red-500' : ''}`}>
          <CardContent className="p-0">
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="font-medium text-gray-900">
                CMND/CCCD - Mặt sau 📄 <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-gray-500">Tải lên ảnh mặt sau của CMND/CCCD</p>
            </div>
            <div className="p-6 flex flex-col items-center">
              {backPreview ? (
                <div className="relative w-full h-48 mb-4">
                  <img
                    src={backPreview}
                    alt="ID Card Back"
                    className="w-full h-full object-contain rounded-md"
                  />
                  <div className="absolute bottom-2 right-2 flex space-x-2 z-10">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-500 bg-opacity-80 hover:bg-opacity-100"
                      onClick={removeBackImage}
                    >
                      Xóa
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white bg-opacity-80 hover:bg-opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('identityBackImage')?.click();
                      }}
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      Đổi ảnh
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2 bg-green-100 text-green-700 p-1 rounded-full">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
              ) : (
                <div
                  className={`w-full h-48 border-2 border-dashed rounded-md
                  ${errors.identityBackImage ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors`}
                  onClick={() => document.getElementById('identityBackImage')?.click()}
                >
                  <Upload
                    className={`h-10 w-10 mb-2 ${errors.identityBackImage ? 'text-red-400' : 'text-gray-400'}`}
                  />
                  <p className="text-sm font-medium">Nhấp để tải lên</p>
                  <p className="text-xs text-gray-500">PNG, JPG (tối đa 5MB)</p>
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
                <p className="text-red-500 text-xs mt-2">{errors.identityBackImage}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {(!frontPreview || !backPreview) && (
        <Card className="border-amber-100 mt-4">
          <CardContent className="p-4 bg-amber-50">
            <div className="text-sm text-amber-800">
              <p>
                ⚠️ Vui lòng tải lên cả hai mặt của CMND/CCCD để tiếp tục. Đảm bảo ảnh rõ nét và
                thông tin dễ đọc.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4 pt-2">
        <div>
          <Label htmlFor="identityNumber" className="block mb-2">
            Số CMND/CCCD 🪪 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="identityNumber"
            name="identityNumber"
            value={formData.identityNumber}
            onChange={handleChange}
            onBlur={() => handleFieldBlur('identityNumber')}
            placeholder="Nhập số CMND/CCCD"
            className={errors.identityNumber ? 'border-red-500' : ''}
          />
          {errors.identityNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.identityNumber}</p>
          )}
        </div>
      </div>

      <Card className="border-blue-100">
        <CardContent className="p-4 bg-blue-50 flex items-start space-x-3">
          <svg
            className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-700">
            <p>
              Thông tin định danh của bạn sẽ được bảo mật và chỉ được sử dụng cho mục đích xác minh
              danh tính theo quy định của pháp luật. Chúng tôi sẽ không chia sẻ thông tin này với
              bên thứ ba không liên quan.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
