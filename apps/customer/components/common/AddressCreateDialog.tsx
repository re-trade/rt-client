'use client';

import { useState } from 'react';
import { getInputHandler } from '../input/getInputHandle';
const now = new Date().toISOString();
export interface Address {
  id: string;
  customer_id?: string;
  name?: string;
  customerName?: string;
  phoneNumber?: string;
  state?: string;
  country?: string;
  district?: string;
  ward?: string;
  type: string;
  isDefault: boolean;
}

interface Props {
  open: boolean;
  onCreate: (data: Address) => void;
  onClose: () => void;
}

const fields = [
  { key: 'name', label: 'Họ và tên' },
  { key: 'phone', label: 'Số điện thoại' },
  { key: 'address', label: 'Địa chỉ' },
  { key: 'ward', label: 'Phường/Xã' },
  { key: 'district', label: 'Quận/Huyện' },
  { key: 'city', label: 'Tỉnh/Thành phố' },
];

export default function AddressCreateDialog({ open, onCreate, onClose }: Props) {
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    customer_id: '',
    name: '',
    customerName: '',
    phoneNumber: '',
    state: '',
    country: '',
    district: '',
    ward: '',
    type: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (key: string, value: string) => {
    if (!value.trim()) return 'Trường này không được để trống';
    if (key === 'phone' && !/^\d{9,15}$/.test(value)) return 'Số điện thoại không hợp lệ';
    return '';
  };

  const handleChange = (key: string, value: string) => {
    const handler = getInputHandler(key);
    const sanitized = handler(value);
    setFormData((prev) => ({ ...prev, [key]: sanitized }));
    if (touched[key]) {
      setErrors((prev) => ({ ...prev, [key]: validateField(key, sanitized) }));
    }
  };

  const handleBlur = (key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({
      ...prev,
      [key]: validateField(key, formData[key as keyof typeof formData] as string),
    }));
  };

  const handleCreate = () => {
    // Validate all fields
    let valid = true;
    const newErrors: Record<string, string> = {};
    fields.forEach(({ key }) => {
      const err = validateField(key, formData[key as keyof typeof formData] as string);
      if (err) valid = false;
      newErrors[key] = err;
    });
    setErrors(newErrors);
    setTouched(fields.reduce((acc, { key }) => ({ ...acc, [key]: true }), {}));
    if (!valid) return;

    const newAddress: Address = {
      id: Date.now().toString(),
      ...formData,
    };
    onCreate(newAddress);
    setFormData({
      customer_id: '',
      name: '',
      customerName: '',
      phoneNumber: '',
      state: '',
      country: '',
      district: '',
      ward: '',
      type: '',
      isDefault: false,
    });
    setErrors({});
    setTouched({});
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-wite bg-opacity-50 z-50">
      <div className="bg-[#FFF8F3]  text-black rounded-lg shadow-lg w-11/12 max-w-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Thêm địa chỉ mới</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(({ key, label }) => (
            <div className="form-control w-full items-start" key={key}>
              <label className="text-sm font-medium text-black mb-1">{label}</label>
              <input
                type="text"
                className={`input input-bordered w-full border-gray-600 text-black bg-white ${touched[key] && errors[key] ? 'border-red-500' : ''}`}
                value={formData[key as keyof typeof formData]}
                onChange={(e) => handleChange(key, e.target.value)}
                onBlur={() => handleBlur(key)}
              />
              <div style={{ minHeight: 22 }}>
                {touched[key] && errors[key] && (
                  <span className="text-red-500 text-sm">{errors[key]}</span>
                )}
              </div>
            </div>
          ))}

          <div className="form-control col-span-1 md:col-span-2 flex-row items-center gap-2 mt-2">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            />
            <span className="text-black">Đặt làm địa chỉ mặc định</span>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-[#FFD2B2] text-black rounded-lg hover:bg-[#FFBB99] transition"
                disabled={Object.values(errors).some((error) => error)}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
