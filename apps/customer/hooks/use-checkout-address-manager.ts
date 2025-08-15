'use client';

import { contactApi, TAddress } from '@/services/contact.api';
import { unAuthApi } from '@retrade/util';
import Joi from 'joi';
import { useCallback, useEffect, useState } from 'react';

export interface Province {
  code: number;
  name: string;
  districts: District[];
}

export interface District {
  code: number;
  name: string;
  wards: Ward[];
}

export interface Ward {
  code: number;
  name: string;
}

export interface AddressFormData {
  name: string;
  customerName: string;
  phoneNumber: string;
  country: string;
  district: string;
  ward: string;
  addressLine: string;
  type: number;
  isDefault: boolean;
}

const initialFormData: AddressFormData = {
  name: '',
  customerName: '',
  phoneNumber: '',
  country: '',
  district: '',
  ward: '',
  addressLine: '',
  type: 1,
  isDefault: false,
};

const addressSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Tên địa chỉ không được để trống',
    'any.required': 'Tên địa chỉ là bắt buộc',
  }),
  customerName: Joi.string().required().messages({
    'string.empty': 'Tên người nhận không được để trống',
    'any.required': 'Tên người nhận là bắt buộc',
  }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .required()
    .messages({
      'string.pattern.base': 'Số điện thoại phải có 10-11 chữ số',
      'string.empty': 'Số điện thoại không được để trống',
      'any.required': 'Số điện thoại là bắt buộc',
    }),
  country: Joi.string().required().messages({
    'string.empty': 'Vui lòng chọn tỉnh/thành phố',
    'any.required': 'Tỉnh/thành phố là bắt buộc',
  }),
  district: Joi.string().required().messages({
    'string.empty': 'Vui lòng chọn quận/huyện',
    'any.required': 'Quận/huyện là bắt buộc',
  }),
  ward: Joi.string().required().messages({
    'string.empty': 'Vui lòng chọn phường/xã',
    'any.required': 'Phường/xã là bắt buộc',
  }),
  addressLine: Joi.string().required().messages({
    'string.empty': 'Địa chỉ chi tiết không được để trống',
    'any.required': 'Địa chỉ chi tiết là bắt buộc',
  }),
  type: Joi.number().required(),
  isDefault: Joi.boolean().required(),
});

export function useCheckoutAddressManager() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);

  const [addresses, setAddresses] = useState<TAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<TAddress | null>(null);

  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      setAddressesLoading(true);
      const response = await contactApi.getContacts(0, 50);
      if (response && Array.isArray(response)) {
        setAddresses(response);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      setErrors({ general: 'Không thể tải danh sách địa chỉ. Vui lòng thử lại.' });
      setAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  }, []);

  const fetchProvinces = useCallback(async () => {
    try {
      setLoading(true);
      setErrors({});
      const response = await unAuthApi.province.get<Province[]>('/p/');
      console.log(response);
      if (response?.data && Array.isArray(response.data)) {
        setProvinces(response.data);
      } else {
        throw new Error('Invalid provinces data format');
      }
    } catch (error) {
      setErrors({ general: 'Không thể tải danh sách tỉnh/thành phố. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDistricts = useCallback(async (provinceCode: string) => {
    if (!provinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }
    try {
      setLoading(true);
      setErrors({});
      const response = await unAuthApi.province.get<Province>(`/p/${provinceCode}?depth=2`);
      if (response?.data?.districts && Array.isArray(response.data.districts)) {
        setDistricts(response.data.districts);
        setWards([]);
        console.log('Districts loaded successfully:', response.data.districts.length);
      } else {
        throw new Error('Invalid districts data format');
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      setErrors({ general: 'Không thể tải danh sách quận/huyện. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWards = useCallback(async (districtCode: string) => {
    if (!districtCode) {
      setWards([]);
      return;
    }
    try {
      setLoading(true);
      setErrors({});
      console.log('Fetching wards for district:', districtCode);
      const response = await unAuthApi.province.get<District>(`/d/${districtCode}?depth=2`);
      console.log('Wards response:', response);
      if (response?.data?.wards && Array.isArray(response.data.wards)) {
        setWards(response.data.wards);
        console.log('Wards loaded successfully:', response.data.wards.length);
      } else {
        throw new Error('Invalid wards data format');
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
      setErrors({ general: 'Không thể tải danh sách phường/xã. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isCreateOpen) {
      fetchProvinces();
    }
  }, [isCreateOpen, fetchProvinces]);

  useEffect(() => {
    if (formData.country) {
      fetchDistricts(formData.country);
    }
  }, [formData.country, fetchDistricts]);

  useEffect(() => {
    if (formData.district) {
      fetchWards(formData.district);
    }
  }, [formData.district, fetchWards]);

  const openSelectionDialog = useCallback(() => {
    setIsSelectionOpen(true);
    fetchAddresses();
  }, [fetchAddresses]);

  const openCreateDialog = useCallback(() => {
    setIsCreateOpen(true);
  }, []);

  const closeDialogs = useCallback(() => {
    setIsCreateOpen(false);
    setIsSelectionOpen(false);
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setProvinces([]);
    setDistricts([]);
    setWards([]);
  }, []);

  const selectAddress = useCallback((address: TAddress) => {
    setSelectedAddress(address);
    setIsSelectionOpen(false);
  }, []);

  const openCreateFromSelection = useCallback(() => {
    setIsSelectionOpen(false);
    setIsCreateOpen(true);
  }, []);

  const handleFieldChange = useCallback(
    (key: keyof AddressFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [key]: value }));

      if (key === 'country') {
        setFormData((prev) => ({ ...prev, district: '', ward: '' }));
      } else if (key === 'district') {
        setFormData((prev) => ({ ...prev, ward: '' }));
      }
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: '' }));
      }
    },
    [errors],
  );

  const handleFieldBlur = useCallback((key: keyof AddressFormData) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const createAddress = useCallback(async (): Promise<boolean> => {
    try {
      setSubmitting(true);
      setErrors({});
      const { error } = addressSchema.validate(formData, { abortEarly: false });
      if (error) {
        const validationErrors: Record<string, string> = {};
        error.details.forEach((detail) => {
          if (detail.path[0]) {
            validationErrors[detail.path[0] as string] = detail.message;
          }
        });
        setErrors(validationErrors);
        return false;
      }

      const selectedProvince = provinces.find((p) => p.code.toString() === formData.country);
      const selectedDistrict = districts.find((d) => d.code.toString() === formData.district);
      const selectedWard = wards.find((w) => w.code.toString() === formData.ward);

      if (!selectedProvince || !selectedDistrict || !selectedWard) {
        setErrors({ general: 'Vui lòng chọn đầy đủ thông tin địa điểm' });
        return false;
      }

      const addressData: Omit<TAddress, 'id'> = {
        customerName: formData.customerName,
        phone: formData.phoneNumber,
        name: formData.name,
        addressLine: formData.addressLine,
        state: selectedProvince.name,
        country: selectedProvince.name,
        district: selectedDistrict.name,
        ward: selectedWard.name,
        type: formData.type,
        defaulted: formData.isDefault,
      };

      const response = await contactApi.createContact(addressData);
      if (!response) {
        throw new Error('Không thể tạo địa chỉ mới');
      }

      await fetchAddresses();
      if (response) {
        setSelectedAddress(response);
      }

      closeDialogs();
      return true;
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Không thể tạo địa chỉ mới' });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [formData, provinces, districts, wards, closeDialogs]);

  return {
    addresses,
    selectedAddress,
    isCreateOpen,
    isSelectionOpen,
    formData,
    errors,
    touched,
    provinces,
    districts,
    wards,
    loading,
    submitting,
    addressesLoading,
    openSelectionDialog,
    openCreateDialog,
    openCreateFromSelection,
    closeDialogs,
    selectAddress,
    createAddress,
    handleFieldChange,
    handleFieldBlur,
    fetchAddresses,
  };
}
