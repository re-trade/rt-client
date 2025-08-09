'use client';

import { AddressFormData, District, Province, Ward } from '@/hooks/use-address-manager';

interface FieldProps {
  field: {
    key: string;
    label: string;
    type: 'input' | 'dropdown';
  };
  formData: AddressFormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  loading: boolean;
  submitting: boolean;
  validationTriggered: boolean;
  onFieldChange: (key: keyof AddressFormData, value: string | boolean) => void;
  onFieldBlur: (key: keyof AddressFormData) => void;
}

export function AddressField({
  field,
  formData,
  errors,
  touched,
  provinces,
  districts,
  wards,
  loading,
  submitting,
  validationTriggered,
  onFieldChange,
  onFieldBlur,
}: FieldProps) {
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
        <label className="text-sm font-semibold text-gray-800 mb-1">{label}</label>
        <div className="relative w-full">
          <select
            className={`w-full px-4 py-2.5 border ${
              hasError ? 'border-red-500' : 'border-orange-200'
            } bg-white text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all appearance-none`}
            value={value as string}
            onChange={(e) => onFieldChange(key as keyof AddressFormData, e.target.value)}
            onBlur={() => onFieldBlur(key as keyof AddressFormData)}
            disabled={isDisabled || loading || submitting}
            style={{ color: '#4B5563' }}
          >
            <option value="" style={{ color: '#6B7280', backgroundColor: 'white' }}>
              Chọn {label}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                style={{ color: '#4B5563', backgroundColor: 'white' }}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-orange-500"
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
      <label className="text-sm font-semibold text-gray-800 mb-1">{label}</label>
      <input
        type="text"
        className={`input w-full px-4 py-2.5 border ${
          hasError ? 'border-red-500' : 'border-orange-200'
        } text-gray-600 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all placeholder:text-gray-500`}
        placeholder={`Nhập ${label.toLowerCase()}`}
        value={value as string}
        onChange={(e) => onFieldChange(key as keyof AddressFormData, e.target.value)}
        onBlur={() => onFieldBlur(key as keyof AddressFormData)}
        disabled={submitting}
        style={{ color: '#4B5563' }}
      />
      <div className="min-h-[22px] mt-1">
        {hasError && <span className="text-red-500 text-xs font-medium">{errors[key]}</span>}
      </div>
    </div>
  );
}
