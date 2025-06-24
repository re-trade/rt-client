import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SellerFormData } from '@/hooks/useSellerRegistration';
import { storageApi } from '@/service/storage.api';
import React, { useState } from 'react';

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
  updateField = () => { },
}: ShopInfoStepProps) {
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarProgress, setAvatarProgress] = useState(0);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [backgroundProgress, setBackgroundProgress] = useState(0);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }

      setAvatarLoading(true);
      setAvatarProgress(0);

      try {
        const previewUrl = URL.createObjectURL(file);
        updateField('avatarUrl', file);
        const uploadProgress = (percent: number) => {
          setAvatarProgress(percent);
        };
        uploadProgress(10);
        const uploadInterval = setInterval(() => {
          setAvatarProgress((prev) => Math.min(prev + 5, 90));
        }, 300);
        const fileUrl = await storageApi.fileUpload(file);
        clearInterval(uploadInterval);

        if (fileUrl) {
          updateField('avatarUrl', fileUrl);
          setAvatarProgress(100);
          setTimeout(() => {
            setAvatarLoading(false);
            URL.revokeObjectURL(previewUrl);
          }, 500);
        } else {
          throw new Error('File upload failed');
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        setAvatarLoading(false);
        alert('Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại.');
      }
    }
  };

  const handleBackgroundChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }

      setBackgroundLoading(true);
      setBackgroundProgress(0);

      try {
        const previewUrl = URL.createObjectURL(file);

        // Save the file object for preview
        updateField('background', file);

        // Start uploading animation
        const uploadProgress = (percent: number) => {
          setBackgroundProgress(percent);
        };

        // Upload to server
        uploadProgress(10);
        const uploadInterval = setInterval(() => {
          setBackgroundProgress((prev) => Math.min(prev + 5, 90));
        }, 300);

        // Call the API to upload the file
        const fileUrl = await storageApi.fileUpload(file);
        clearInterval(uploadInterval);

        if (fileUrl) {
          // If upload successful, save the URL
          updateField('background', fileUrl);
          setBackgroundProgress(100);

          // Complete animation
          setTimeout(() => {
            setBackgroundLoading(false);
            // Release the preview URL to free memory
            URL.revokeObjectURL(previewUrl);
          }, 500);
        } else {
          throw new Error('File upload failed');
        }
      } catch (error) {
        console.error('Error uploading background:', error);
        setBackgroundLoading(false);
        alert('Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
        <h3 className="text-xl font-bold text-amber-900 mb-6 text-center">
          Tạo ấn tượng đầu tiên với khách hàng
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-amber-800 mb-2">Avatar của bạn</h4>
              <p className="text-sm text-amber-600">Hình ảnh đại diện cho chính bạn</p>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="relative group cursor-pointer"
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                <div
                  className={`w-32 h-32 rounded-full border-4 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden ${formData.avatarUrl
                    ? 'border-amber-500 bg-white shadow-lg'
                    : 'border-amber-300 hover:border-amber-400 bg-white hover:bg-amber-25'
                    }`}
                >
                  {avatarLoading ? (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <div className="w-full h-1 bg-amber-100 relative">
                        <div
                          className="h-full bg-amber-500 transition-all duration-300"
                          style={{ width: `${avatarProgress}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-amber-600 text-xs font-medium">
                        {avatarProgress < 90
                          ? 'Đang tải lên...'
                          : avatarProgress < 100
                            ? 'Đang xử lý...'
                            : 'Hoàn thành!'}
                      </div>
                    </div>
                  ) : formData.avatarUrl ? (
                    <img
                      src={
                        formData.avatarUrl instanceof File
                          ? URL.createObjectURL(formData.avatarUrl)
                          : formData.avatarUrl
                      }
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Error loading avatar image');
                        e.currentTarget.src =
                          'https://placehold.co/300x300/FFB74D/ffffff?text=Avatar';
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-amber-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-amber-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-amber-600 font-medium">Thêm logo</span>
                    </div>
                  )}
                </div>

                {formData.avatarUrl && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Thay đổi</span>
                  </div>
                )}
              </div>

              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <Button
                variant="outline"
                size="sm"
                type="button"
                className={`mt-4 px-6 ${avatarLoading
                  ? 'bg-amber-50 text-amber-700 border-amber-300 opacity-70 cursor-wait'
                  : 'border-amber-300 text-amber-700 hover:bg-amber-50'
                  }`}
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={avatarLoading}
              >
                {avatarLoading ? 'Đang tải...' : formData.avatarUrl ? 'Thay đổi logo' : 'Chọn logo'}
              </Button>

              <div className="mt-3 text-xs text-amber-600 text-center">
                <p>Kích thước tối ưu: 300×300px</p>
                <p>Định dạng: JPG, PNG (tối đa 5MB)</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-amber-800 mb-2">Ảnh bìa</h4>
              <p className="text-sm text-amber-600">Ảnh nền thể hiện phong cách của bạn</p>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="relative group cursor-pointer w-full"
                onClick={() => document.getElementById('background-upload')?.click()}
              >
                <div
                  className={`w-full h-40 rounded-xl border-4 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden ${formData.background
                    ? 'border-amber-500 bg-white shadow-lg'
                    : 'border-amber-300 hover:border-amber-400 bg-white hover:bg-amber-25'
                    }`}
                >
                  {backgroundLoading ? (
                    <div className="flex flex-col items-center justify-center w-full h-full p-4">
                      <div className="w-full h-2 bg-amber-100 rounded-full relative">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-300"
                          style={{ width: `${backgroundProgress}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-amber-600 text-sm font-medium">
                        {backgroundProgress < 90
                          ? 'Đang tải lên...'
                          : backgroundProgress < 100
                            ? 'Đang xử lý...'
                            : 'Hoàn thành!'}
                      </div>
                    </div>
                  ) : formData.background ? (
                    <img
                      src={
                        formData.background instanceof File
                          ? URL.createObjectURL(formData.background)
                          : formData.background
                      }
                      alt="Background preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Error loading background image');
                        e.currentTarget.src =
                          'https://placehold.co/1200x300/FFB74D/ffffff?text=Background';
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-10 bg-amber-200 rounded mx-auto mb-2 flex items-center justify-center">
                        <svg
                          className="w-8 h-5 text-amber-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-amber-600 font-medium">Thêm ảnh bìa</span>
                    </div>
                  )}
                </div>

                {formData.background && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Thay đổi</span>
                  </div>
                )}
              </div>

              <input
                id="background-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBackgroundChange}
              />

              <Button
                variant="outline"
                size="sm"
                type="button"
                className={`mt-4 px-6 ${backgroundLoading
                  ? 'bg-amber-50 text-amber-700 border-amber-300 opacity-70 cursor-wait'
                  : 'border-amber-300 text-amber-700 hover:bg-amber-50'
                  }`}
                onClick={() => document.getElementById('background-upload')?.click()}
                disabled={backgroundLoading}
              >
                {backgroundLoading
                  ? 'Đang tải...'
                  : formData.background
                    ? 'Thay đổi ảnh bìa'
                    : 'Chọn ảnh bìa'}
              </Button>

              <div className="mt-3 text-xs text-amber-600 text-center">
                <p>Kích thước tối ưu: 1200×300px</p>
                <p>Định dạng: JPG, PNG (tối đa 5MB)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-amber-200 shadow-lg">
        <CardContent className="p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-amber-900 mb-2">Thông tin cơ bản</h3>
            <p className="text-amber-600">
              Những thông tin này sẽ hiển thị công khai trên trang bán hàng của bạn. Hãy cung cấp
              thông tin chính xác và đầy đủ để khách hàng có thể tìm thấy và tin tưởng vào bạn.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label
                htmlFor="shopName"
                className="text-amber-800 font-semibold mb-3 block text-base"
              >
                Tên người bán
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="shopName"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('shopName')}
                placeholder="Bạn muốn chúng tôi gọi bạn là gì?"
                className={`h-12 text-base border-2 transition-all duration-200 ${errors.shopName
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-amber-200 focus:border-amber-400 focus:ring-amber-100'
                  }`}
                required
              />
              {errors.shopName && (
                <div className="mt-2 flex items-center text-red-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">{errors.shopName}</span>
                </div>
              )}
              <p className="text-xs text-amber-600 mt-2">
                Tên người bán sẽ xuất hiện trên trang sản phẩm
              </p>
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-amber-800 font-semibold mb-3 block text-base"
              >
                Mô tả về bạn
                <span className="text-amber-600 ml-1 text-sm font-normal">(Không bắt buộc)</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('description')}
                placeholder="Chia sẻ câu chuyện của bạn... Bạn bán những gì? Tại sao khách hàng nên mua những món đồ của bạn?"
                className="border-2 border-amber-200 focus:border-amber-400 focus:ring-amber-100 resize-none text-base min-h-[120px] transition-all duration-200"
                rows={5}
              />
              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-amber-600">
                  Mô tả hấp dẫn sẽ giúp khách hàng tin tưởng bạn nhiều hơn
                </p>
                <span className="text-xs text-amber-500">
                  {formData.description?.length || 0}/500
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="email"
                  className="text-amber-800 font-semibold mb-3 block text-base"
                >
                  Địa chỉ email
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleFieldBlur('email')}
                  placeholder="example@gmail.com"
                  className={`h-12 text-base border-2 transition-all duration-200 ${errors.email
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                    : 'border-amber-200 focus:border-amber-400 focus:ring-amber-100'
                    }`}
                  required
                />
                {errors.email && (
                  <div className="mt-2 flex items-center text-red-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">{errors.email}</span>
                  </div>
                )}
                <p className="text-xs text-amber-600 mt-2">
                  Email để nhận thông báo đơn hàng và liên hệ
                </p>
              </div>

              <div>
                <Label
                  htmlFor="phoneNumber"
                  className="text-amber-800 font-semibold mb-3 block text-base"
                >
                  Số điện thoại
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={() => handleFieldBlur('phoneNumber')}
                  placeholder="0123 456 789"
                  className={`h-12 text-base border-2 transition-all duration-200 ${errors.phoneNumber
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                    : 'border-amber-200 focus:border-amber-400 focus:ring-amber-100'
                    }`}
                  required
                />
                {errors.phoneNumber && (
                  <div className="mt-2 flex items-center text-red-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">{errors.phoneNumber}</span>
                  </div>
                )}
                <p className="text-xs text-amber-600 mt-2">
                  Số điện thoại để khách hàng liên hệ trực tiếp
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Mẹo tạo cửa hàng hấp dẫn
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>Chọn tên ngắn gọn, dễ nhớ và thể hiện được cá tính của bạn</span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>Mô tả chi tiết về loại sản phẩm, chất lượng và phong cách bán hàng</span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>Logo rõ nét, đẹp mắt sẽ tạo ấn tượng tốt với khách hàng</span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>Ảnh bìa thể hiện phong cách và cá tính của bạn</span>
          </div>
        </div>
      </div>
    </div>
  );
}
