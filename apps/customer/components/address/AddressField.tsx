'use client';

import { AddressFormData, District, Province, Ward } from '@/hooks/use-checkout-address-manager';
import { CheckCircle, ChevronDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [isChanging, setIsChanging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (newValue: string) => {
    setIsChanging(true);
    onFieldChange(key as keyof AddressFormData, newValue);

    if (newValue && !hasError) {
      setTimeout(() => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);
      }, 300);
    }

    setTimeout(() => setIsChanging(false), 200);
  };

  useEffect(() => {
    if (hasError) {
      setShowSuccess(false);
    }
  }, [hasError]);

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
        <label className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
          {label}
          {(isDisabled || loading || submitting) && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {loading ? 'Đang tải...' : isDisabled ? 'Chọn mục trước' : 'Đang xử lý...'}
            </span>
          )}
        </label>
        <div className="relative w-full group">
          <select
            className={`w-full px-4 py-3 border-2 ${
              hasError
                ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                : isDisabled
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  : showSuccess
                    ? 'border-green-400 bg-green-50 focus:border-green-500 focus:ring-green-200'
                    : 'border-orange-200 bg-white hover:border-orange-300 focus:border-orange-500 focus:ring-orange-200'
            } text-gray-700 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 appearance-none shadow-sm hover:shadow-md ${
              !isDisabled && !hasError ? 'group-hover:border-orange-300' : ''
            } ${isChanging ? 'scale-[1.02]' : 'scale-100'}`}
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => onFieldBlur(key as keyof AddressFormData)}
            disabled={isDisabled || loading || submitting}
          >
            <option value="" className="text-gray-500">
              {loading ? 'Đang tải...' : `Chọn ${label.toLowerCase()}`}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value} className="text-gray-700 py-2">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            {loading ? (
              <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
            ) : showSuccess ? (
              <CheckCircle className="w-4 h-4 text-green-500 animate-in zoom-in duration-300" />
            ) : (
              <ChevronDown
                className={`w-4 h-4 transition-all duration-300 ${
                  hasError
                    ? 'text-red-400'
                    : isDisabled
                      ? 'text-gray-300'
                      : 'text-orange-500 group-hover:text-orange-600 group-focus-within:rotate-180'
                }`}
              />
            )}
          </div>
          <div
            className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-200 ${
              !isDisabled && !hasError
                ? 'group-focus-within:ring-4 group-focus-within:ring-orange-200'
                : ''
            }`}
          />
        </div>
        <div className="min-h-[24px] mt-2">
          {hasError && (
            <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium animate-in slide-in-from-top-1 duration-200">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors[key]}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="form-control w-full items-start" key={key}>
      <label className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
        {label}
        {submitting && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            Đang xử lý...
          </span>
        )}
      </label>
      <div className="relative w-full group">
        <input
          type="text"
          className={`w-full px-4 py-3 border-2 ${
            hasError
              ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
              : showSuccess
                ? 'border-green-400 bg-green-50 focus:border-green-500 focus:ring-green-200'
                : 'border-orange-200 bg-white hover:border-orange-300 focus:border-orange-500 focus:ring-orange-200'
          } text-gray-700 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:shadow-md group-hover:border-orange-300 ${
            isChanging ? 'scale-[1.02]' : 'scale-100'
          }`}
          placeholder={`Nhập ${label.toLowerCase()}`}
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => onFieldBlur(key as keyof AddressFormData)}
          disabled={submitting}
        />
        {showSuccess && !hasError && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <CheckCircle className="w-4 h-4 text-green-500 animate-in zoom-in duration-300" />
          </div>
        )}
        <div
          className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-200 ${
            !hasError ? 'group-focus-within:ring-4 group-focus-within:ring-orange-200' : ''
          }`}
        />
      </div>
      <div className="min-h-[24px] mt-2">
        {hasError && (
          <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium animate-in slide-in-from-top-1 duration-200">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors[key]}
          </div>
        )}
      </div>
    </div>
  );
}
