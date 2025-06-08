'use client';

import { AddressFormData, District, Province, Ward } from '@/hooks/use-address-manager';

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
  const handleCreate = async () => {
    try {
      const success = await onCreate();
      console.log('Address created successfully:', success);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating address:', error);
    }
  };

  const renderField = (field: (typeof fields)[0]) => {
    const { key, label, type } = field;
    const value = formData[key as keyof AddressFormData];
    const hasError = touched[key] && errors[key];

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
          <label className="text-sm font-medium text-black mb-1">{label}</label>
          <select
            className={`select select-bordered w-full border-gray-600 text-black bg-white ${hasError ? 'border-red-500' : ''}`}
            value={value as string}
            onChange={(e) => onFieldChange(key as keyof AddressFormData, e.target.value)}
            onBlur={() => onFieldBlur(key as keyof AddressFormData)}
            disabled={isDisabled || loading}
          >
            <option value="">Chọn {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div style={{ minHeight: 22 }}>
            {hasError && <span className="text-red-500 text-sm">{errors[key]}</span>}
          </div>
        </div>
      );
    }

    return (
      <div className="form-control w-full items-start" key={key}>
        <label className="text-sm font-medium text-black mb-1">{label}</label>
        <input
          type="text"
          className={`input input-bordered w-full border-gray-600 text-black bg-white ${hasError ? 'border-red-500' : ''}`}
          value={value as string}
          onChange={(e) => onFieldChange(key as keyof AddressFormData, e.target.value)}
          onBlur={() => onFieldBlur(key as keyof AddressFormData)}
        />
        <div style={{ minHeight: 22 }}>
          {hasError && <span className="text-red-500 text-sm">{errors[key]}</span>}
        </div>
      </div>
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-wite bg-opacity-50 z-50">
      <div className="bg-[#FFF8F3] text-black rounded-lg shadow-lg w-11/12 max-w-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Thêm địa chỉ mới</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(renderField)}

          <div className="form-control col-span-1 md:col-span-2 flex-row items-center gap-2 mt-2">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={formData.isDefault}
              onChange={(e) => onFieldChange('isDefault', e.target.checked)}
            />
            <span className="text-black">Đặt làm địa chỉ mặc định</span>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-[#FFD2B2] text-black rounded-lg hover:bg-[#FFBB99] transition"
                disabled={loading || submitting}
              >
                {submitting ? 'Creating...' : loading ? 'Loading...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
