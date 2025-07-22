'use client';

import { getInputHandler } from '@/components/input/getInputHandle';
import { contactApi, TAddress } from '@/services/contact.api';
import axios from 'axios';
import Joi from 'joi';
import { useCallback, useEffect, useState } from 'react';

export interface Address {
  id: string;
  name: string;
  customerName: string;
  phoneNumber: string;
  state: string;
  country: string;
  district: string;
  ward: string;
  addressLine: string;
  type: number;
  isDefault: boolean;
}

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
  customerName: string;
  phoneNumber: string;
  name: string;
  addressLine: string;
  country: string;
  district: string;
  ward: string;
  isDefault: boolean;
  type: number;
}

const PROVINCES_API_URL = 'https://provinces.open-api.vn/api/p/';

const addressSchema = Joi.object({
  customerName: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Họ và tên không được để trống',
    'any.required': 'Họ và tên là bắt buộc',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\d{9,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Số điện thoại không hợp lệ (9-15 chữ số)',
      'string.empty': 'Số điện thoại không được để trống',
      'any.required': 'Số điện thoại là bắt buộc',
    }),
  addressLine: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Địa chỉ không được để trống',
    'any.required': 'Địa chỉ là bắt buộc',
  }),
  country: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Vui lòng chọn Tỉnh/Thành phố',
    'any.required': 'Tỉnh/Thành phố là bắt buộc',
  }),
  district: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Vui lòng chọn Quận/Huyện',
    'any.required': 'Quận/Huyện là bắt buộc',
  }),
  ward: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Vui lòng chọn Phường/Xã',
    'any.required': 'Phường/Xã là bắt buộc',
  }),
  name: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Tên địa chỉ không được để trống',
    'any.required': 'Tên địa chỉ là bắt buộc',
  }),
  isDefault: Joi.boolean().default(false),
  type: Joi.number().default(0),
});

const initialFormData: AddressFormData = {
  customerName: '',
  phoneNumber: '',
  name: '',
  addressLine: '',
  country: '',
  district: '',
  ward: '',
  isDefault: false,
  type: 0,
};

function validateAllFields(data: AddressFormData): Record<string, string> {
  const { error } = addressSchema.validate(data, { abortEarly: false });
  if (!error) return {};
  const newErrors: Record<string, string> = {};
  error.details.forEach((detail) => {
    const key = detail.path[0] as string;
    newErrors[key] = detail.message;
  });
  return newErrors;
}

export function useAddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await contactApi.getContacts(0, 10);
      const mapped: Address[] = response
        ? response.map((item) => ({
            id: item.id,
            name: item.name,
            customerName: item.customerName,
            phoneNumber: item.phone,
            state: item.state,
            country: item.country,
            district: item.district,
            ward: item.ward,
            addressLine: item.addressLine,
            type: item.type,
            isDefault: item.defaulted,
          }))
        : [];
      setAddresses(mapped);
    } catch {
      setErrors({ general: 'Không thể tải danh sách địa chỉ' });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProvinces = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(PROVINCES_API_URL);
      setProvinces(response.data);
    } catch {
      setErrors({ general: 'Không thể tải danh sách tỉnh/thành phố' });
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
      const response = await axios.get(`${PROVINCES_API_URL}${provinceCode}?depth=2`);
      setDistricts(response.data.districts || []);
      setWards([]);
    } catch {
      setErrors({ general: 'Không thể tải danh sách quận/huyện' });
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
      const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`,
      );
      setWards(response.data.wards || []);
    } catch {
      setErrors({ general: 'Không thể tải danh sách phường/xã' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  useEffect(() => {
    if (isCreateOpen || isUpdateOpen) {
      fetchProvinces();
    }
  }, [isCreateOpen, isUpdateOpen, fetchProvinces]);

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

  const validateField = useCallback((key: string, value: string) => {
    const { error } = addressSchema.extract(key).validate(value);
    return error ? error.details[0]?.message : '';
  }, []);

  const handleFieldChange = useCallback(
    (key: keyof AddressFormData, value: string | boolean) => {
      if (
        typeof value === 'string' &&
        ['customerName', 'phoneNumber', 'addressLine', 'name'].includes(key)
      ) {
        const handler = getInputHandler(key);
        value = handler(value);
      }

      setFormData((prev) => ({ ...prev, [key]: value }));

      if (key === 'country') {
        setFormData((prev) => ({ ...prev, district: '', ward: '' }));
      } else if (key === 'district') {
        setFormData((prev) => ({ ...prev, ward: '' }));
      }

      if (typeof value === 'string' && touched[key]) {
        setErrors((prev) => ({
          ...prev,
          [key]: validateField(key, value) || '',
        }));
      }
    },
    [touched, validateField],
  );

  const handleFieldBlur = useCallback(
    (key: keyof AddressFormData) => {
      setTouched((prev) => ({ ...prev, [key]: true }));
      const value = formData[key];
      if (typeof value === 'string') {
        setErrors((prev) => ({
          ...prev,
          [key]: validateField(key, value) || '',
        }));
      }
    },
    [formData, validateField],
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setDistricts([]);
    setWards([]);
  }, []);

  const openCreateDialog = useCallback(() => {
    resetForm();
    setIsCreateOpen(true);
  }, [resetForm]);

  const openUpdateDialog = useCallback(async (address: Address) => {
    setSelectedAddress(address);
    setFormData({
      customerName: address.customerName,
      phoneNumber: address.phoneNumber,
      name: address.name,
      addressLine: address.addressLine,
      country: '',
      district: '',
      ward: '',
      isDefault: address.isDefault,
      type: address.type,
    });

    setErrors({});
    setTouched({});

    try {
      setLoading(true);
      const provinceResponse = await axios.get(PROVINCES_API_URL);
      setProvinces(provinceResponse.data);
      const province = provinceResponse.data.find((p: Province) => p.name === address.country);
      if (province) {
        const districtResponse = await axios.get(`${PROVINCES_API_URL}${province.code}?depth=2`);
        setDistricts(districtResponse.data.districts || []);
        const district = districtResponse.data.districts.find(
          (d: District) => d.name === address.district,
        );
        if (district) {
          const wardResponse = await axios.get(
            `https://provinces.open-api.vn/api/d/${district.code}?depth=2`,
          );
          setWards(wardResponse.data.wards || []);
          const ward = wardResponse.data.wards.find((w: Ward) => w.name === address.ward);
          setFormData((prev) => ({
            ...prev,
            country: province.code.toString(),
            district: district.code.toString(),
            ward: ward ? ward.code.toString() : '',
          }));
        }
      }
    } catch {
      setErrors({ general: 'Không thể tải dữ liệu địa điểm' });
    } finally {
      setLoading(false);
      setIsUpdateOpen(true);
    }
  }, []);

  const closeDialogs = useCallback(() => {
    setIsCreateOpen(false);
    setIsUpdateOpen(false);
    setSelectedAddress(null);
    resetForm();
  }, [resetForm]);

  const createAddress = useCallback(async () => {
    const newErrors = validateAllFields(formData);
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return false;
    }

    try {
      setSubmitting(true);
      const selectedProvince = provinces.find((p) => p.code.toString() === formData.country);
      const selectedDistrict = districts.find((d) => d.code.toString() === formData.district);
      const selectedWard = wards.find((w) => w.code.toString() === formData.ward);

      if (!selectedProvince || !selectedDistrict || !selectedWard) {
        setErrors({
          general: 'Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã',
        });
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
      closeDialogs();
      return true;
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Không thể tạo địa chỉ mới' });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [formData, provinces, districts, wards, closeDialogs, fetchAddresses]);

  const updateAddress = useCallback(async () => {
    if (!selectedAddress) return false;

    const newErrors = validateAllFields(formData);
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return false;
    }

    try {
      setSubmitting(true);
      const selectedProvince = provinces.find((p) => p.code.toString() === formData.country);
      const selectedDistrict = districts.find((d) => d.code.toString() === formData.district);
      const selectedWard = wards.find((w) => w.code.toString() === formData.ward);
      if (!selectedProvince || !selectedDistrict || !selectedWard) {
        setErrors({ general: 'Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã' });
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

      const response = await contactApi.updateContact(selectedAddress.id, addressData);
      if (!response) {
        throw new Error('Không thể cập nhật địa chỉ');
      }

      await fetchAddresses();
      closeDialogs();
      return true;
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Không thể cập nhật địa chỉ' });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [selectedAddress, formData, provinces, districts, wards, closeDialogs, fetchAddresses]);

  const deleteAddress = useCallback(async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    try {
      setLoading(true);
      const response = await contactApi.removeContact(id);
      if (!response) throw new Error('Không thể xóa địa chỉ');
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Không thể xóa địa chỉ' });
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAddresses = useCallback(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    isCreateOpen,
    isUpdateOpen,
    selectedAddress,
    formData,
    errors,
    touched,
    provinces,
    districts,
    wards,
    loading,
    submitting,
    openCreateDialog,
    openUpdateDialog,
    closeDialogs,
    createAddress,
    updateAddress,
    deleteAddress,
    handleFieldChange,
    handleFieldBlur,
    resetForm,
    refreshAddresses,
  };
}
