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
import { District, Province, SellerFormData, Ward } from '@/hooks/useSellerRegistration';
import React, { useEffect, useState } from 'react';

type AddressStepProps = {
  formData: SellerFormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
  handleFieldBlur: (name: keyof SellerFormData) => void;
  errors: Record<string, string>;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  loading: boolean;
};

export default function AddressStep({
  formData,
  handleChange,
  handleFieldBlur,
  errors,
  provinces,
  districts,
  wards,
  loading,
}: AddressStepProps) {
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');

  const handleSelectChange = (name: keyof SellerFormData, value: string) => {
    const event = {
      target: {
        name,
        value,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    handleChange(event);
    handleFieldBlur(name);
    if (name === 'state') {
      setSelectedProvince(provinces.find((p) => p.code.toString() === value)?.name || '');
      setSelectedDistrict('');
      setSelectedWard('');
    } else if (name === 'district') {
      setSelectedDistrict(districts.find((d) => d.code.toString() === value)?.name || '');
      setSelectedWard('');
    } else if (name === 'ward') {
      setSelectedWard(wards.find((w) => w.code.toString() === value)?.name || '');
    }
  };

  useEffect(() => {
    if (formData.state) {
      const province = provinces.find((p) => p.code.toString() === formData.state);
      if (province) setSelectedProvince(province.name);
    }

    if (formData.district) {
      const district = districts.find((d) => d.code.toString() === formData.district);
      if (district) setSelectedDistrict(district.name);
    }

    if (formData.ward) {
      const ward = wards.find((w) => w.code.toString() === formData.ward);
      if (ward) setSelectedWard(ward.name);
    }
  }, [formData, provinces, districts, wards]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
          <div className="w-8 h-8 bg-amber-600 rounded-sm"></div>
        </div>
        <h2 className="text-2xl font-bold text-amber-900">Địa chỉ cửa hàng</h2>
        <p className="text-amber-700/70 text-sm leading-relaxed max-w-md mx-auto">
          Vui lòng cung cấp địa chỉ chính xác để khách hàng có thể dễ dàng tìm thấy bạn
        </p>
      </div>

      <Card className="border-amber-200 shadow-lg">
        <CardContent className="p-8">
          <div className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="addressLine" className="text-amber-900 font-medium text-sm">
                Địa chỉ chi tiết
                <span className="text-red-600 ml-1">*</span>
              </Label>
              <Textarea
                id="addressLine"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('addressLine')}
                placeholder="Ví dụ: 123 Đường Nguyễn Văn A, Tòa nhà ABC, Tầng 2..."
                className={`resize-none min-h-[100px] border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-amber-400 ${
                  errors.addressLine ? 'border-red-400 focus:border-red-500' : ''
                }`}
                rows={4}
              />
              {errors.addressLine && (
                <p className="text-red-600 text-xs flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.addressLine}
                </p>
              )}
            </div>

            <div className="grid gap-6">
              <div className="space-y-3">
                <Label htmlFor="state" className="text-amber-900 font-medium text-sm">
                  Tỉnh/Thành phố
                  <span className="text-red-600 ml-1">*</span>
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleSelectChange('state', value)}
                  disabled={loading || provinces.length === 0}
                >
                  <SelectTrigger
                    className={`w-full h-12 border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 ${
                      errors.state ? 'border-red-400' : ''
                    }`}
                  >
                    <SelectValue placeholder="Chọn tỉnh/thành phố của bạn">
                      {selectedProvince || 'Chọn tỉnh/thành phố'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {provinces.map((province) => (
                      <SelectItem
                        key={province.code}
                        value={province.code.toString()}
                        className="hover:bg-amber-50"
                      >
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className="text-red-600 text-xs flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    Vui lòng chọn tỉnh/thành phố
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="district" className="text-amber-900 font-medium text-sm">
                  Quận/Huyện
                  <span className="text-red-600 ml-1">*</span>
                </Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => handleSelectChange('district', value)}
                  disabled={loading || districts.length === 0 || !formData.state}
                >
                  <SelectTrigger
                    className={`w-full h-12 border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 ${
                      errors.district ? 'border-red-400' : ''
                    } ${!formData.state ? 'bg-amber-50/50 text-amber-400' : ''}`}
                  >
                    <SelectValue placeholder="Chọn quận/huyện">
                      {selectedDistrict || 'Chọn quận/huyện'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {districts.map((district) => (
                      <SelectItem
                        key={district.code}
                        value={district.code.toString()}
                        className="hover:bg-amber-50"
                      >
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.district && (
                  <p className="text-red-600 text-xs flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    Vui lòng chọn quận/huyện
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="ward" className="text-amber-900 font-medium text-sm">
                  Phường/Xã
                  <span className="text-red-600 ml-1">*</span>
                </Label>
                <Select
                  value={formData.ward}
                  onValueChange={(value) => handleSelectChange('ward', value)}
                  disabled={loading || wards.length === 0 || !formData.district}
                >
                  <SelectTrigger
                    className={`w-full h-12 border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 ${
                      errors.ward ? 'border-red-400' : ''
                    } ${!formData.district ? 'bg-amber-50/50 text-amber-400' : ''}`}
                  >
                    <SelectValue placeholder="Chọn phường/xã">
                      {selectedWard || 'Chọn phường/xã'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {wards.map((ward) => (
                      <SelectItem
                        key={ward.code}
                        value={ward.code.toString()}
                        className="hover:bg-amber-50"
                      >
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.ward && (
                  <p className="text-red-600 text-xs flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    Vui lòng chọn phường/xã
                  </p>
                )}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                <span className="font-medium">Lưu ý:</span> Địa chỉ này sẽ được hiển thị cho khách
                hàng. Hãy đảm bảo thông tin chính xác để thuận tiện cho việc giao dịch.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
