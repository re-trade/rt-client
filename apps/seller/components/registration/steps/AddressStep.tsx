'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useRegistration } from '@/context/RegistrationContext';
import { useRegistrationAddressData } from '@/hooks/use-registration-address-data';
import { useRegistrationValidation } from '@/hooks/use-registration-validation';
import { CheckCircle2, Loader2, MapPin, X } from 'lucide-react';
import React from 'react';

export default function AddressStep() {
  const { formData, updateField, errors, touched, setTouched, loading } = useRegistration();
  const { validateField } = useRegistrationValidation();
  const {
    provinces,
    districts,
    wards,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
  } = useRegistrationAddressData();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const handleSelectChange = (field: string, value: string) => {
    setTouched(field, true);

    if (field === 'state') {
      handleProvinceChange(value);
    } else if (field === 'district') {
      handleDistrictChange(value);
    } else if (field === 'ward') {
      handleWardChange(value);
    }

    validateField(field as keyof typeof formData, value);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto">
          <MapPin className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Địa chỉ cửa hàng</h2>
        <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
          Cho chúng tôi biết vị trí cửa hàng để khách hàng có thể tìm thấy bạn dễ dàng
        </p>
      </div>

      {/* Address Selection */}
      <Card className="border-orange-200 shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Province Selection */}
            <div className="space-y-3">
              <Label className="text-gray-900 font-medium">
                Tỉnh/Thành phố
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.state}
                onValueChange={(value) => handleSelectChange('state', value)}
              >
                <SelectTrigger
                  className={`h-12 border-2 transition-all duration-200 ${
                    errors.state
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-orange-200 focus:border-orange-400'
                  }`}
                >
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="ml-2 text-sm">Đang tải...</span>
                    </div>
                  ) : (
                    provinces.map((province) => (
                      <SelectItem key={province.code} value={province.code.toString()}>
                        {province.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <X className="w-4 h-4" />
                  {errors.state}
                </p>
              )}
            </div>

            {/* District Selection */}
            <div className="space-y-3">
              <Label className="text-gray-900 font-medium">
                Quận/Huyện
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.district}
                onValueChange={(value) => handleSelectChange('district', value)}
                disabled={!formData.state}
              >
                <SelectTrigger
                  className={`h-12 border-2 transition-all duration-200 ${
                    errors.district
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-orange-200 focus:border-orange-400'
                  }`}
                >
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="ml-2 text-sm">Đang tải...</span>
                    </div>
                  ) : (
                    districts.map((district) => (
                      <SelectItem key={district.code} value={district.code.toString()}>
                        {district.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.district && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <X className="w-4 h-4" />
                  {errors.district}
                </p>
              )}
            </div>

            {/* Ward Selection */}
            <div className="space-y-3">
              <Label className="text-gray-900 font-medium">
                Phường/Xã
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.ward}
                onValueChange={(value) => handleSelectChange('ward', value)}
                disabled={!formData.district}
              >
                <SelectTrigger
                  className={`h-12 border-2 transition-all duration-200 ${
                    errors.ward
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-orange-200 focus:border-orange-400'
                  }`}
                >
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="ml-2 text-sm">Đang tải...</span>
                    </div>
                  ) : (
                    wards.map((ward) => (
                      <SelectItem key={ward.code} value={ward.code.toString()}>
                        {ward.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.ward && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <X className="w-4 h-4" />
                  {errors.ward}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Address */}
      <Card className="border-orange-200 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label htmlFor="addressLine" className="text-gray-900 font-medium">
              Địa chỉ chi tiết
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="addressLine"
              name="addressLine"
              value={formData.addressLine}
              onChange={handleInputChange}
              onBlur={() => handleInputBlur('addressLine')}
              placeholder="Số nhà, tên đường, khu vực cụ thể..."
              rows={3}
              className={`border-2 transition-all duration-200 resize-none ${
                errors.addressLine
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-orange-200 focus:border-orange-400 focus:ring-orange-100'
              }`}
            />
            {errors.addressLine && (
              <p className="text-red-600 text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {errors.addressLine}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Lưu ý về địa chỉ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-700">
            <div className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Địa chỉ chính xác giúp khách hàng tìm thấy bạn dễ dàng</span>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Thông tin địa chỉ sẽ được hiển thị công khai</span>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Bạn có thể cập nhật địa chỉ sau khi đăng ký</span>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Địa chỉ chi tiết giúp tính phí vận chuyển chính xác</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
