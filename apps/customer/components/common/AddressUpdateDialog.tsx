'use client';

import { AddressFormData, District, Province, Ward } from '@/hooks/use-address-manager';
import { Check, MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdate: () => Promise<boolean>;
  formData: AddressFormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  loading: boolean;
  submitting: boolean;
  onFieldChange: (key: keyof AddressFormData, value: string | boolean) => void;
  onFieldBlur: (key: keyof AddressFormData) => void;
}

const fields = [
  { key: 'name', label: 'Tên địa chỉ', type: 'input' },
  { key: 'customerName', label: 'Họ và tên', type: 'input' },
  { key: 'phoneNumber', label: 'Số điện thoại', type: 'input' },
  { key: 'addressLine', label: 'Địa chỉ', type: 'input' },
  { key: 'country', label: 'Tỉnh/Thành phố', type: 'dropdown' },
  { key: 'district', label: 'Quận/Huyện', type: 'dropdown' },
  { key: 'ward', label: 'Phường/Xã', type: 'dropdown' },
] as const;

export default function AddressUpdateDialog({
  open,
  onClose,
  onUpdate,
  formData,
  errors,
  touched,
  provinces,
  districts,
  wards,
  loading,
  submitting,
  onFieldChange,
  onFieldBlur,
}: Props) {
  const [validationTriggered, setValidationTriggered] = useState(false);

  useEffect(() => {
    if (!open) {
      setValidationTriggered(false);
    }
  }, [open]);

  // Additional effect to monitor loading state changes
  useEffect(() => {
    console.log('Update dialog loading state:', loading);
    console.log('Current form data:', formData);
  }, [loading, formData]);

  const handleUpdate = async () => {
    try {
      console.log('Attempting to update with form data:', formData);
      setValidationTriggered(true);

      // Trigger validation for all fields
      fields.forEach((field) => {
        onFieldBlur(field.key as keyof AddressFormData);
      });

      // Check for empty required fields
      const hasEmptyFields = fields.some((field) => {
        const key = field.key as keyof AddressFormData;
        const value = formData[key];
        if (typeof value === 'string' && !value.trim()) {
          console.log(`Field ${key} is empty`);
          return true;
        }
        return false;
      });

      if (hasEmptyFields) {
        console.log('Validation failed: some fields are empty');
        return;
      }

      // Check if location fields are properly set
      if (!formData.country || !formData.district || !formData.ward) {
        console.log('Location fields not properly set:', {
          country: formData.country,
          district: formData.district,
          ward: formData.ward,
        });
        return;
      }

      console.log('Validation passed, calling onUpdate()');
      const success = await onUpdate();
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const renderField = (field: (typeof fields)[0]) => {
    const { key, label, type } = field;
    const value = formData[key as keyof AddressFormData];
    const hasError = (touched[key] || validationTriggered) && errors[key];

    if (type === 'dropdown') {
      let options: { value: string; label: string }[] = [];
      let isDisabled = false;

      if (key === 'country') {
        options = provinces.map((p) => ({ value: p.code.toString(), label: p.name }));
      } else if (key === 'district') {
        options = districts.map((d) => ({ value: d.code.toString(), label: d.name }));
        isDisabled = !formData.country;
      } else if (key === 'ward') {
        options = wards.map((w) => ({ value: w.code.toString(), label: w.name }));
        isDisabled = !formData.district;
      }

      return (
        <div className="form-control w-full items-start" key={key}>
          <label className="text-sm font-semibold text-[#121212] mb-1">{label}</label>
          <div className="relative w-full">
            <select
              className={`select w-full px-4 py-2.5 border ${
                hasError ? 'border-red-500' : 'border-[#525252]/20'
              } text-[#121212] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all appearance-none`}
              value={value as string}
              onChange={(e) => onFieldChange(key as keyof AddressFormData, e.target.value)}
              onBlur={() => onFieldBlur(key as keyof AddressFormData)}
              disabled={isDisabled || loading || submitting}
            >
              <option value="">Chọn {label}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-[#525252]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
          <div className="min-h-[22px] mt-1">
            {hasError && <span className="text-red-500 text-xs font-medium">{errors[key]}</span>}
          </div>
        </div>
      );
    }

    return (
      <div className="form-control w-full items-start" key={key}>
        <label className="text-sm font-semibold text-[#121212] mb-1">{label}</label>
        <input
          type="text"
          className={`input w-full px-4 py-2.5 border ${
            hasError ? 'border-red-500' : 'border-[#525252]/20'
          } text-[#121212] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all`}
          value={value as string}
          onChange={(e) => onFieldChange(key as keyof AddressFormData, e.target.value)}
          onBlur={() => onFieldBlur(key as keyof AddressFormData)}
          disabled={submitting}
        />
        <div className="min-h-[22px] mt-1">
          {hasError && <span className="text-red-500 text-xs font-medium">{errors[key]}</span>}
        </div>
      </div>
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-[#121212] rounded-xl shadow-xl w-11/12 max-w-3xl p-0 overflow-hidden">
        <div className="bg-[#FFD2B2] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-[#121212]" />
            <h3 className="text-xl font-bold text-[#121212]">Cập nhật địa chỉ</h3>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-[#121212] hover:bg-white/40 transition-colors"
            onClick={onClose}
            disabled={submitting}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(renderField)}

            <div className="form-control col-span-1 md:col-span-2 flex flex-col gap-4 mt-2 border-t border-[#525252]/20 pt-4">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefaultUpdate"
                    className="w-5 h-5 text-[#FFD2B2] rounded border-[#525252]/40 focus:ring-[#FFD2B2]"
                    checked={formData.isDefault}
                    onChange={(e) => onFieldChange('isDefault', e.target.checked)}
                    disabled={submitting}
                  />
                  <label htmlFor="isDefaultUpdate" className="ml-2 text-[#121212] font-medium">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>

                {loading && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm w-full">
                    Đang tải dữ liệu địa chỉ...
                  </div>
                )}
              </div>

              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm w-full">
                  {errors.general}
                </div>
              )}

              <div className="mt-4 flex justify-end space-x-3 w-full">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#FDFEF9] border border-[#525252]/20 text-[#121212] rounded-lg hover:bg-gray-100 transition font-medium"
                  disabled={submitting}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-5 py-2.5 bg-[#FFD2B2] text-[#121212] rounded-lg hover:bg-[#FFBB99] transition font-medium flex items-center"
                  disabled={
                    loading ||
                    submitting ||
                    !formData.country ||
                    !formData.district ||
                    !formData.ward
                  }
                >
                  {submitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin"></span>
                      Đang cập nhật...
                    </>
                  ) : loading ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin"></span>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
