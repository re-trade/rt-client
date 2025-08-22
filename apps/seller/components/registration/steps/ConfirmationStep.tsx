'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRegistration } from '@/context/RegistrationContext';
import { useRegistrationAddressData } from '@/hooks/use-registration-address-data';
import { CheckCircle, IdCard, Mail, MapPin, Phone, Store, User } from 'lucide-react';
import Image from 'next/image';

export default function ConfirmationStep() {
  const { formData } = useRegistration();
  const { getSelectedProvince, getSelectedDistrict, getSelectedWard } =
    useRegistrationAddressData();

  const selectedProvince = getSelectedProvince();
  const selectedDistrict = getSelectedDistrict();
  const selectedWard = getSelectedWard();

  const fullAddress = [
    formData.addressLine,
    selectedWard?.name,
    selectedDistrict?.name,
    selectedProvince?.name,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Xác nhận thông tin</h2>
        <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
          Vui lòng kiểm tra lại tất cả thông tin trước khi hoàn tất đăng ký
        </p>
      </div>

      {/* Shop Information */}
      <Card className="border-orange-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardTitle className="flex items-center gap-3 text-orange-800">
            <Store className="w-5 h-5" />
            Thông tin cửa hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Avatar and Background */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Ảnh đại diện</h4>
              <div className="w-24 h-24 rounded-full border-2 border-orange-200 overflow-hidden bg-orange-50">
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
                  <div className="w-full h-full flex items-center justify-center text-orange-400">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Ảnh bìa</h4>
              <div className="w-full h-24 rounded-lg border-2 border-orange-200 overflow-hidden bg-orange-50">
                {formData.background ? (
                  <Image
                    src={
                      typeof formData.background === 'string'
                        ? formData.background
                        : URL.createObjectURL(formData.background)
                    }
                    alt="Background"
                    width={200}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-orange-400">
                    <Store className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tên người bán</h4>
                <p className="text-gray-700">{formData.shopName}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email liên hệ
                </h4>
                <p className="text-gray-700">{formData.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Mô tả</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{formData.description}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Số điện thoại
                </h4>
                <p className="text-gray-700">{formData.phoneNumber}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="border-orange-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardTitle className="flex items-center gap-3 text-orange-800">
            <MapPin className="w-5 h-5" />
            Địa chỉ cửa hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Địa chỉ đầy đủ</h4>
              <p className="text-gray-700 leading-relaxed">{fullAddress}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">Tỉnh/Thành phố:</span>
                <p className="text-gray-700">{selectedProvince?.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Quận/Huyện:</span>
                <p className="text-gray-700">{selectedDistrict?.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Phường/Xã:</span>
                <p className="text-gray-700">{selectedWard?.name}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identity Information */}
      <Card className="border-orange-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardTitle className="flex items-center gap-3 text-orange-800">
            <IdCard className="w-5 h-5" />
            Thông tin xác minh
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Số CMND/CCCD</h4>
            <p className="text-gray-700 font-mono">{formData.identityNumber}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Ảnh mặt trước</h4>
              <div className="w-full h-32 rounded-lg border-2 border-orange-200 overflow-hidden bg-orange-50">
                {formData.identityFrontImage ? (
                  <Image
                    src={URL.createObjectURL(formData.identityFrontImage)}
                    alt="CMND/CCCD mặt trước"
                    width={200}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-orange-400">
                    <IdCard className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Ảnh mặt sau</h4>
              <div className="w-full h-32 rounded-lg border-2 border-orange-200 overflow-hidden bg-orange-50">
                {formData.identityBackImage ? (
                  <Image
                    src={URL.createObjectURL(formData.identityBackImage)}
                    alt="CMND/CCCD mặt sau"
                    width={200}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-orange-400">
                    <IdCard className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Notice */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Sẵn sàng hoàn tất đăng ký</h4>
              <p className="text-green-700 text-sm leading-relaxed">
                Sau khi nhấn "Hoàn tất đăng ký", thông tin của bạn sẽ được gửi để xem xét và phê
                duyệt. Chúng tôi sẽ thông báo kết quả trong vòng 24-48 giờ qua email và số điện
                thoại đã đăng ký.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
