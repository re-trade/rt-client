'use client';

import { AddressFormData, District, Province, Ward } from '@/hooks/use-address-manager';
import { AddressField } from '@components/address/AddressField';
import { Check, MapPin, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  open: boolean;
  onCreate: () => Promise<boolean>;
  onClose: () => void;
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
  { key: 'customerName', label: 'Họ và tên', type: 'input' },
  { key: 'phoneNumber', label: 'Số điện thoại', type: 'input' },
  { key: 'name', label: 'Tên địa chỉ', type: 'input' },
  { key: 'addressLine', label: 'Địa chỉ chi tiết', type: 'input' },
  { key: 'country', label: 'Tỉnh/Thành phố', type: 'dropdown' },
  { key: 'district', label: 'Quận/Huyện', type: 'dropdown' },
  { key: 'ward', label: 'Phường/Xã', type: 'dropdown' },
] as const;

export default function AddressCreateDialog({
  open,
  onCreate,
  onClose,
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
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setValidationTriggered(false);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && open) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  const handleCreate = async () => {
    try {
      setValidationTriggered(true);
      fields.forEach((field) => {
        onFieldBlur(field.key as keyof AddressFormData);
      });

      const hasErrors = fields.some((field) => {
        const key = field.key as keyof AddressFormData;
        const value = formData[key];
        return typeof value === 'string' && !value.trim();
      });

      if (hasErrors) return;

      const success = await onCreate();
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating address:', error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        ref={modalRef}
        className="bg-white text-[#121212] rounded-xl shadow-xl w-11/12 max-w-3xl p-0 overflow-hidden"
      >
        <div className="bg-[#FFD2B2] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-[#121212]" />
            <h3 className="text-xl font-bold text-[#121212]">Thêm địa chỉ mới</h3>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-[#121212] hover:bg-white/40 transition-colors"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <AddressField
                key={field.key}
                field={field}
                formData={formData}
                errors={errors}
                touched={touched}
                provinces={provinces}
                districts={districts}
                wards={wards}
                loading={loading}
                submitting={submitting}
                validationTriggered={validationTriggered}
                onFieldChange={onFieldChange}
                onFieldBlur={onFieldBlur}
              />
            ))}

            <div className="form-control col-span-1 md:col-span-2 flex flex-col gap-4 mt-2 border-t border-[#525252]/20 pt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  className="w-5 h-5 text-[#FFD2B2] rounded border-[#525252]/40 focus:ring-[#FFD2B2]"
                  checked={formData.isDefault}
                  onChange={(e) => onFieldChange('isDefault', e.target.checked)}
                />
                <label htmlFor="isDefault" className="ml-2 text-[#121212] font-medium">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>

              {errors.general && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
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
                  onClick={handleCreate}
                  className="px-5 py-2.5 bg-[#FFD2B2] text-[#121212] rounded-lg hover:bg-[#FFBB99] transition font-medium flex items-center"
                  disabled={loading || submitting}
                >
                  {submitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin"></span>
                      Đang tạo...
                    </>
                  ) : loading ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin"></span>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Tạo địa chỉ
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
