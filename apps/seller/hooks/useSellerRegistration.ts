'use client';

import { sellerApi, SellerProfileRegisterRequest } from '@/service/seller.api';
import { storageApi } from '@/service/storage.api';
import axios from 'axios';
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

export type SellerFormData = {
  shopName: string;
  description: string;
  email: string;
  phoneNumber: string;
  avatarUrl: File | null | string;
  background: File | null | string;
  addressLine: string;
  district: string;
  ward: string;
  state: string;
  identityNumber: string;
  identityFrontImage: File | null;
  identityBackImage: File | null;
};
export const defaultFormData: SellerFormData = {
  shopName: '',
  description: '',
  email: '',
  phoneNumber: '',
  avatarUrl: null,
  background: null,
  addressLine: '',
  district: '',
  ward: '',
  state: '',
  identityNumber: '',
  identityFrontImage: null,
  identityBackImage: null,
};

const sellerSchema = Joi.object({
  shopName: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Tên của bạn không được để trống',
    'any.required': 'Tên của bạn là bắt buộc',
  }),
  description: Joi.string().allow(''),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Email không hợp lệ',
      'string.empty': 'Email không được để trống',
      'any.required': 'Email là bắt buộc',
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
  state: Joi.string().trim().min(1).required().messages({
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
  identityNumber: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Số CMND/CCCD không được để trống',
    'any.required': 'Số CMND/CCCD là bắt buộc',
  }),
});

export function useSellerRegistration() {
  const [formData, setFormData] = useState<SellerFormData>(defaultFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);

  const PROVINCES_API_URL = 'https://provinces.open-api.vn/api/p/';

  const updateField = (name: keyof SellerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateField(name, value);
    }

    if (name === 'state') {
      setFormData((prev) => ({ ...prev, district: '', ward: '' }));
      fetchDistricts(value);
    } else if (name === 'district') {
      setFormData((prev) => ({ ...prev, ward: '' }));
      fetchWards(value);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    updateField(name as keyof SellerFormData, value);
    if (name === 'state' || name === 'district' || name === 'ward') {
      setTouched((prev) => ({ ...prev, [name]: true }));
      validateField(name as keyof SellerFormData, value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files && files.length > 0 ? files[0] : null;

    // Handle file size validation - max 5MB
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [name]: 'Kích thước file không được vượt quá 5MB',
      }));
      return;
    }

    // For identity images, we handle them differently than avatar/background
    // Avatar and background are now handled in their own components with API uploads
    if (name === 'identityFrontImage' || name === 'identityBackImage') {
      setFormData((prev) => ({ ...prev, [name]: file }));
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (!file) {
        setErrors((prev) => ({
          ...prev,
          [name]:
            name === 'identityFrontImage'
              ? 'Ảnh mặt trước CMND/CCCD là bắt buộc'
              : 'Ảnh mặt sau CMND/CCCD là bắt buộc',
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name as string];
          return newErrors;
        });
      }
    }
  };
  const handleFieldBlur = (name: keyof SellerFormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
    if (name === 'state' && !formData.state) {
      setErrors((prev) => ({ ...prev, state: 'Vui lòng chọn Tỉnh/Thành phố' }));
    }
    if (name === 'district' && !formData.district) {
      setErrors((prev) => ({ ...prev, district: 'Vui lòng chọn Quận/Huyện' }));
    }
    if (name === 'ward' && !formData.ward) {
      setErrors((prev) => ({ ...prev, ward: 'Vui lòng chọn Phường/Xã' }));
    }
  };
  const validateField = (name: keyof SellerFormData, value: any) => {
    // Helper function to clear errors for a field
    const clearError = () => {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      return true;
    };

    // Helper function to set an error message
    const setError = (message: string) => {
      setErrors((prev) => ({ ...prev, [name]: message }));
      return false;
    };

    // Validate identity images
    if (name === 'identityFrontImage' || name === 'identityBackImage') {
      const file = formData[name];
      if (!file) {
        const errorMessage =
          name === 'identityFrontImage'
            ? 'Ảnh mặt trước CMND/CCCD là bắt buộc'
            : 'Ảnh mặt sau CMND/CCCD là bắt buộc';
        return setError(errorMessage);
      }
      return clearError();
    }

    // Validate avatar and background
    if (name === 'avatarUrl' || name === 'background') {
      const file = formData[name];
      if (!file) {
        const errorMessage =
          name === 'avatarUrl' ? 'Ảnh đại diện là bắt buộc' : 'Ảnh bìa là bắt buộc';
        return setError(errorMessage);
      }
      return clearError();
    }
    if (name === 'state' || name === 'district' || name === 'ward') {
      if (!value) {
        let errorMessage = '';
        if (name === 'state') errorMessage = 'Vui lòng chọn Tỉnh/Thành phố';
        else if (name === 'district') errorMessage = 'Vui lòng chọn Quận/Huyện';
        else errorMessage = 'Vui lòng chọn Phường/Xã';

        return setError(errorMessage);
      }
      return clearError();
    }
    try {
      const schema = sellerSchema.extract(name);
      const validationResult = schema.validate(value);

      if (validationResult.error?.details?.[0]?.message) {
        return setError(validationResult.error.details[0].message);
      }

      return clearError();
    } catch (error) {
      return true;
    }
  };

  const validateStep = (step: number) => {
    let isValid = true;
    const fieldsToValidate: (keyof SellerFormData)[] = [];
    if (step === 1) {
      fieldsToValidate.push('shopName', 'email', 'phoneNumber', 'description');
    } else if (step === 2) {
      fieldsToValidate.push('addressLine', 'state', 'district', 'ward');
    } else if (step === 3) {
      fieldsToValidate.push('identityNumber', 'identityFrontImage', 'identityBackImage');
    }
    const newTouched = { ...touched };

    fieldsToValidate.forEach((field) => {
      newTouched[field] = true;
      if (field === 'identityFrontImage' || field === 'identityBackImage') {
        if (!formData[field]) {
          setErrors((prev) => ({
            ...prev,
            [field]:
              field === 'identityFrontImage'
                ? 'Ảnh mặt trước CMND/CCCD là bắt buộc'
                : 'Ảnh mặt sau CMND/CCCD là bắt buộc',
          }));
          isValid = false;
        }
      } else {
        const fieldValid = validateField(field, formData[field]);
        if (!fieldValid) isValid = false;
      }
    });

    setTouched(newTouched);
    return isValid;
  };

  const fetchProvinces = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(PROVINCES_API_URL);
      setProvinces(response.data);
    } catch (error) {
      console.error('Failed to fetch provinces:', error);
      setErrors((prev) => ({ ...prev, general: 'Không thể tải danh sách tỉnh/thành phố' }));
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
    } catch (error) {
      console.error('Failed to fetch districts:', error);
      setErrors((prev) => ({ ...prev, general: 'Không thể tải danh sách quận/huyện' }));
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
    } catch (error) {
      console.error('Failed to fetch wards:', error);
      setErrors((prev) => ({ ...prev, general: 'Không thể tải danh sách phường/xã' }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  const nextStep = () => {
    const fieldsToTouch: Record<string, boolean> = {};
    if (currentStep === 1) {
      ['shopName', 'email', 'phoneNumber', 'description'].forEach(
        (field) => (fieldsToTouch[field] = true),
      );
    } else if (currentStep === 2) {
      ['addressLine', 'state', 'district', 'ward'].forEach(
        (field) => (fieldsToTouch[field] = true),
      );
    } else if (currentStep === 3) {
      ['identityNumber', 'identityFrontImage', 'identityBackImage'].forEach(
        (field) => (fieldsToTouch[field] = true),
      );
    }

    setTouched((prev) => ({ ...prev, ...fieldsToTouch }));

    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    if (step < currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
    }
  };

  const submitForm = async () => {
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      return { ...acc, [key]: true };
    }, {});
    setTouched(allTouched);
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      const field = key as keyof SellerFormData;
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) isValid = false;
    });

    if (!isValid) {
      return false;
    }

    setIsSubmitting(true);
    try {
      const selectedProvince = provinces.find((p) => p.code.toString() === formData.state);
      const selectedDistrict = districts.find((d) => d.code.toString() === formData.district);
      const selectedWard = wards.find((w) => w.code.toString() === formData.ward);

      if (!selectedProvince || !selectedDistrict || !selectedWard) {
        if (!selectedProvince)
          setErrors((prev) => ({ ...prev, state: 'Vui lòng chọn Tỉnh/Thành phố' }));
        if (!selectedDistrict)
          setErrors((prev) => ({ ...prev, district: 'Vui lòng chọn Quận/Huyện' }));
        if (!selectedWard) setErrors((prev) => ({ ...prev, ward: 'Vui lòng chọn Phường/Xã' }));
        return false;
      }

      if (!formData.identityFrontImage) {
        setErrors((prev) => ({
          ...prev,
          identityFrontImage: 'Ảnh mặt trước CMND/CCCD là bắt buộc',
        }));
        isValid = false;
      }

      if (!formData.identityBackImage) {
        setErrors((prev) => ({ ...prev, identityBackImage: 'Ảnh mặt sau CMND/CCCD là bắt buộc' }));
        isValid = false;
      }

      if (!formData.avatarUrl) {
        setErrors((prev) => ({ ...prev, avatarUrl: 'Ảnh đại diện là bắt buộc' }));
        isValid = false;
      }

      if (!formData.background) {
        setErrors((prev) => ({ ...prev, background: 'Ảnh bìa là bắt buộc' }));
        isValid = false;
      }

      if (!isValid) {
        setTouched({
          ...touched,
          identityFrontImage: true,
          identityBackImage: true,
        });
        return false;
      }

      let avatarUrl = '';
      let background = '';

      if (formData.avatarUrl instanceof File) {
        avatarUrl = await storageApi.fileUpload(formData.avatarUrl);
      } else if (typeof formData.avatarUrl === 'string') {
        avatarUrl = formData.avatarUrl;
      }

      if (formData.background instanceof File) {
        background = await storageApi.fileUpload(formData.background);
      } else if (typeof formData.background === 'string') {
        background = formData.background;
      }

      if (!avatarUrl || !background) {
        setErrors((prev) => ({
          ...prev,
          ...(!avatarUrl ? { avatarUrl: 'Ảnh đại diện là bắt buộc' } : {}),
          ...(!background ? { background: 'Ảnh bìa là bắt buộc' } : {}),
        }));
        return false;
      }
      const requestBody: SellerProfileRegisterRequest = {
        shopName: formData.shopName,
        description: formData.description,
        addressLine: formData.addressLine,
        district: selectedDistrict.name,
        ward: selectedWard.name,
        state: selectedProvince.name,
        email: formData.email,
        avatarUrl,
        background,
        phoneNumber: formData.phoneNumber,
        identityNumber: formData.identityNumber,
      };
      console.log(requestBody);
      const result = await sellerApi.registerSeller(requestBody);
      if (!result) {
        alert('Đăng ký không thành công!');
        return false;
      }
      if (!formData.identityBackImage || !formData.identityFrontImage) {
        setErrors((prev) => ({
          ...prev,
          ...(!formData.identityBackImage
            ? { identityBackImage: 'Ảnh mặt sau CMND/CCCD là bắt buộc' }
            : {}),
          ...(!formData.identityFrontImage
            ? { identityFrontImage: 'Ảnh mặt trước CMND/CCCD là bắt buộc' }
            : {}),
        }));
        return false;
      }
      const verifiUpload = await sellerApi.sellerVerification({
        backIdentity: formData.identityBackImage,
        frontIdentity: formData.identityFrontImage,
      });
      if (!verifiUpload) {
        alert('Đăng ký không thành công!');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors((prev) => ({ ...prev, general: 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.' }));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    currentStep,
    errors,
    touched,
    isSubmitting,
    loading,
    provinces,
    districts,
    wards,
    updateField,
    handleChange,
    handleFileChange,
    handleFieldBlur,
    validateField,
    validateStep,
    submitForm,
    nextStep,
    prevStep,
    goToStep,
  };
}
