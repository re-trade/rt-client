'use client';

import { contactApi, TAddress } from '@/services/contact.api';
import { unAuthApi } from '@retrade/util';
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

export function useAddressManagement() {
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
      const response = await unAuthApi.province.get<Province[]>('/p/');
      console.log(response);
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
      const response = await unAuthApi.province.get<Province>(`/p/${provinceCode}?depth=2`);
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
      const response = await unAuthApi.province.get<District>(`/d/${districtCode}?depth=2`);
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

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  }, []);

  const openCreateDialog = useCallback(() => {
    resetForm();
    setIsCreateOpen(true);
  }, [resetForm]);

  const openUpdateDialog = useCallback(async (address: Address) => {
    setSelectedAddress(address);
    setFormData({
      name: address.name,
      customerName: address.customerName,
      phoneNumber: address.phoneNumber,
      country: '',
      district: '',
      ward: '',
      addressLine: address.addressLine,
      type: address.type,
      isDefault: address.isDefault,
    });

    try {
      setLoading(true);
      const provinceResponse = await unAuthApi.province.get<Province[]>(`/p/`);
      setProvinces(provinceResponse.data);
      const province = provinceResponse.data.find((p: Province) => p.name === address.country);
      if (province) {
        const districtResponse = await unAuthApi.province.get<Province>(
          `/p/${province.code}?depth=2`,
        );
        setDistricts(districtResponse.data.districts || []);
        const district = districtResponse.data.districts.find(
          (d: District) => d.name === address.district,
        );
        if (district) {
          const wardResponse = await unAuthApi.province.get<District>(
            `/d/${district.code}?depth=2`,
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

      // Validate form data
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
      closeDialogs();
      return true;
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Không thể tạo địa chỉ mới' });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [formData, provinces, districts, wards, closeDialogs, fetchAddresses]);

  const updateAddress = useCallback(async (): Promise<boolean> => {
    if (!selectedAddress) return false;

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

      const addressData: TAddress = {
        id: selectedAddress.id,
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

  const deleteAddress = useCallback(
    async (addressId: string): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await contactApi.removeContact(addressId);
        if (!response) {
          throw new Error('Không thể xóa địa chỉ');
        }
        await fetchAddresses();
        return true;
      } catch (error: any) {
        setErrors({ general: error.response?.data?.message || 'Không thể xóa địa chỉ' });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchAddresses],
  );

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
    refreshAddresses: fetchAddresses,
  };
}
