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

  // Custom handler for select fields
  const handleSelectChange = (name: keyof SellerFormData, value: string) => {
    const event = {
      target: {
        name,
        value,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    handleChange(event);
    handleFieldBlur(name);

    // Update the selected values for display
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

  // Update display values when data changes
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
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Địa chỉ cửa hàng</h2>
        <p className="text-gray-500 mt-1">Vui lòng cung cấp địa chỉ cửa hàng chính xác</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="addressLine" className="block mb-2">
                Địa chỉ chi tiết ✨ <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="addressLine"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('addressLine')}
                placeholder="Số nhà, tên đường, tòa nhà, v.v."
                className={`resize-none ${errors.addressLine ? 'border-red-500' : ''}`}
                rows={3}
              />
              {errors.addressLine && (
                <p className="text-red-500 text-xs mt-1">{errors.addressLine}</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="state" className="block mb-2">
                  Tỉnh/Thành phố 🏙️ <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleSelectChange('state', value)}
                    disabled={loading || provinces.length === 0}
                  >
                    <SelectTrigger className={`w-full ${errors.state ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Chọn Tỉnh/Thành phố">
                        {selectedProvince || 'Tỉnh/Thành phố'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province.code} value={province.code.toString()}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">Vui lòng chọn Tỉnh/Thành phố</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="district" className="block mb-2">
                  Quận/Huyện 🏘️ <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Select
                    value={formData.district}
                    onValueChange={(value) => handleSelectChange('district', value)}
                    disabled={loading || districts.length === 0 || !formData.state}
                  >
                    <SelectTrigger className={`w-full ${errors.district ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Chọn Quận/Huyện">
                        {selectedDistrict || 'Quận/Huyện'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.code} value={district.code.toString()}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.district && (
                    <p className="text-red-500 text-xs mt-1">Vui lòng chọn Quận/Huyện</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="ward" className="block mb-2">
                  Phường/Xã 🏡 <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Select
                    value={formData.ward}
                    onValueChange={(value) => handleSelectChange('ward', value)}
                    disabled={loading || wards.length === 0 || !formData.district}
                  >
                    <SelectTrigger className={`w-full ${errors.ward ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Chọn Phường/Xã">
                        {selectedWard || 'Phường/Xã'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map((ward) => (
                        <SelectItem key={ward.code} value={ward.code.toString()}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ward && (
                    <p className="text-red-500 text-xs mt-1">Vui lòng chọn Phường/Xã</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
