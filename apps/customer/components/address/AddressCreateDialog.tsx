'use client';

import { AddressFormData, District, Province, Ward } from '@/hooks/use-checkout-address-manager';
import { AddressField } from '@components/address/AddressField';
import { Check, MapPin, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
  { key: 'name', label: 'Tên địa chỉ (Nhà riêng, Công ty, etc)', type: 'input' },
  { key: 'addressLine', label: 'Địa chỉ chi tiết (Tên đường, số nhà, etc)', type: 'input' },
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
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setValidationTriggered(false);
    }
  }, [open]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // Focus the modal when it opens
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
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

  if (!open || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[100000] p-2 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{ zIndex: 100000 }}
    >
      <div
        ref={modalRef}
        className="bg-white text-gray-800 rounded-xl shadow-xl w-full max-w-3xl p-0 overflow-hidden max-h-[90vh] sm:min-h-[50vh] flex flex-col"
        tabIndex={-1}
      >
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-white" />
            <h3 id="modal-title" className="text-xl font-bold text-white">
              Thêm địa chỉ mới
            </h3>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
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

            <div className="form-control col-span-1 md:col-span-2 flex flex-col gap-2 border-t border-orange-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  className="w-5 h-5 text-orange-500 rounded border-orange-200 focus:ring-orange-400"
                  checked={formData.isDefault}
                  onChange={(e) => onFieldChange('isDefault', e.target.checked)}
                />
                <label htmlFor="isDefault" className="ml-2 text-gray-600 font-medium">
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
                  className="px-5 py-2.5 bg-white border border-orange-200 text-gray-600 rounded-lg hover:bg-gray-100 transition font-medium"
                  disabled={submitting}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleCreate}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-medium flex items-center shadow-md hover:shadow-lg"
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

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
