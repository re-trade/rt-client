import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SellerFormData } from '@/hooks/useSellerRegistration';
import { ImagePlus } from 'lucide-react';
import React from 'react';

type ShopInfoStepProps = {
  formData: SellerFormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
  handleFieldBlur: (name: keyof SellerFormData) => void;
  errors: Record<string, string>;
  updateField?: (name: keyof SellerFormData, value: any) => void;
};

export default function ShopInfoStep({
  formData,
  handleChange,
  handleFieldBlur,
  errors,
  updateField = () => {},
}: ShopInfoStepProps) {
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const avatarPreview = document.getElementById('avatar-preview');
          if (avatarPreview) {
            avatarPreview.style.backgroundImage = `url(${event.target.result})`;
            avatarPreview.style.backgroundSize = 'cover';
            avatarPreview.style.backgroundPosition = 'center';
            avatarPreview.className =
              'relative w-24 h-24 mb-4 cursor-pointer rounded-full border-2 border-blue-500';
          }

          // Update the actual form data
          updateField('avatarUrl', event.target.result.toString());
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const bgPreview = document.getElementById('background-preview');
          if (bgPreview) {
            bgPreview.style.backgroundImage = `url(${event.target.result})`;
            bgPreview.style.backgroundSize = 'cover';
            bgPreview.style.backgroundPosition = 'center';
            bgPreview.className =
              'relative w-full h-32 mb-4 cursor-pointer rounded-md border-2 border-blue-500';
          }
          updateField('background', event.target.result.toString());
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Thông tin người bán</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 border-b">
              <div
                id="avatar-preview"
                className="relative w-24 h-24 mb-4 cursor-pointer rounded-full"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                style={
                  formData.avatarUrl
                    ? {
                        backgroundImage: `url(${formData.avatarUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : {}
                }
              >
                {!formData.avatarUrl && (
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                    <ImagePlus className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 text-white z-10">
                  <ImagePlus className="h-4 w-4" />
                </div>
              </div>
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" type="button">
                  Tải lên avatar
                </Button>
              </Label>
              <p className="text-xs text-gray-500 mt-2">Khuyến nghị: 300x300px, PNG hoặc JPG</p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 border-b">
              <div
                id="background-preview"
                className="relative w-full h-32 mb-4 cursor-pointer rounded-md"
                onClick={() => document.getElementById('background-upload')?.click()}
                style={
                  formData.background
                    ? {
                        backgroundImage: `url(${formData.background})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : {}
                }
              >
                {!formData.background && (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <ImagePlus className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <input
                  id="background-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBackgroundChange}
                />
                <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1.5 text-white z-10">
                  <ImagePlus className="h-4 w-4" />
                </div>
              </div>
              <Label htmlFor="background-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" type="button">
                  Tải lên ảnh bìa
                </Button>
              </Label>
              <p className="text-xs text-gray-500 mt-2">Khuyến nghị: 1200x300px, PNG hoặc JPG</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="shopName" className="block mb-2">
              Tên shop của bạn 🏪 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="shopName"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('shopName')}
              placeholder="Nhập tên cửa hàng của bạn"
              className={`mt-1 ${errors.shopName ? 'border-red-500' : ''}`}
              required
            />
            {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>}
          </div>

          <div>
            <Label htmlFor="description" className="block mb-2">
              Mô tả ngắn về shop ✨
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('description')}
              placeholder="Mô tả ngắn gọn về cửa hàng của bạn"
              className="mt-1 resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="block mb-2">
              Email 📧 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('email')}
              placeholder="example@domain.com"
              className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="block mb-2">
              Số điện thoại 📱 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('phoneNumber')}
              placeholder="0123456789"
              className={`mt-1 ${errors.phoneNumber ? 'border-red-500' : ''}`}
              required
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
