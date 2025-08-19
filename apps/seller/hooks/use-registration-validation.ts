'use client';

import { useRegistration } from '@/context/RegistrationContext';
import { SellerFormData, ValidationErrors } from '@/types/registration';
import Joi from 'joi';
import { useCallback } from 'react';

const validationSchemas = {
  shopName: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Tên người bán là bắt buộc',
    'string.min': 'Tên người bán phải có ít nhất 2 ký tự',
    'string.max': 'Tên người bán không được vượt quá 100 ký tự',
    'any.required': 'Tên người bán là bắt buộc',
  }),
  description: Joi.string().min(10).max(500).required().messages({
    'string.empty': 'Mô tả là bắt buộc',
    'string.min': 'Mô tả phải có ít nhất 10 ký tự',
    'string.max': 'Mô tả không được vượt quá 500 ký tự',
    'any.required': 'Mô tả là bắt buộc',
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email là bắt buộc',
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc',
    }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .required()
    .messages({
      'string.empty': 'Số điện thoại là bắt buộc',
      'string.pattern.base': 'Số điện thoại phải có 10-11 chữ số',
      'any.required': 'Số điện thoại là bắt buộc',
    }),
  addressLine: Joi.string().min(5).max(200).required().messages({
    'string.empty': 'Địa chỉ chi tiết là bắt buộc',
    'string.min': 'Địa chỉ phải có ít nhất 5 ký tự',
    'string.max': 'Địa chỉ không được vượt quá 200 ký tự',
    'any.required': 'Địa chỉ chi tiết là bắt buộc',
  }),
  state: Joi.string().required().messages({
    'string.empty': 'Tỉnh/Thành phố là bắt buộc',
    'any.required': 'Tỉnh/Thành phố là bắt buộc',
  }),
  district: Joi.string().required().messages({
    'string.empty': 'Quận/Huyện là bắt buộc',
    'any.required': 'Quận/Huyện là bắt buộc',
  }),
  ward: Joi.string().required().messages({
    'string.empty': 'Phường/Xã là bắt buộc',
    'any.required': 'Phường/Xã là bắt buộc',
  }),
  identityNumber: Joi.string()
    .pattern(/^[0-9]{9,12}$/)
    .required()
    .messages({
      'string.empty': 'Số CMND/CCCD là bắt buộc',
      'string.pattern.base': 'Số CMND/CCCD phải có 9-12 chữ số',
      'any.required': 'Số CMND/CCCD là bắt buộc',
    }),
};

export function useRegistrationValidation() {
  const { setFieldError, clearFieldError, setErrors } = useRegistration();

  const validateField = useCallback(
    (field: keyof SellerFormData, value: any): boolean => {
      const schema = validationSchemas[field as keyof typeof validationSchemas];
      if (!schema) return true;

      const { error } = schema.validate(value);
      if (error) {
        setFieldError(field, error.details[0].message);
        return false;
      } else {
        clearFieldError(field);
        return true;
      }
    },
    [setFieldError, clearFieldError],
  );

  const validateStep = useCallback(
    (step: number, formData: SellerFormData): boolean => {
      const stepFields = getStepFields(step);
      let isValid = true;
      const stepErrors: ValidationErrors = {};

      stepFields.forEach((field) => {
        const schema = validationSchemas[field as keyof typeof validationSchemas];
        if (schema) {
          const { error } = schema.validate(formData[field]);
          if (error) {
            stepErrors[field] = error.details[0].message;
            isValid = false;
          }
        }
      });

      if (step === 1) {
        if (!formData.avatarUrl) {
          stepErrors.avatarUrl = 'Ảnh đại diện là bắt buộc';
          isValid = false;
        }
        if (!formData.background) {
          stepErrors.background = 'Ảnh bìa là bắt buộc';
          isValid = false;
        }
      }

      if (step === 3) {
        if (!formData.identityFrontImage) {
          stepErrors.identityFrontImage = 'Ảnh mặt trước CMND/CCCD là bắt buộc';
          isValid = false;
        }
        if (!formData.identityBackImage) {
          stepErrors.identityBackImage = 'Ảnh mặt sau CMND/CCCD là bắt buộc';
          isValid = false;
        }
      }

      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
      }

      return isValid;
    },
    [setErrors],
  );

  const validateFileSize = useCallback((file: File, maxSizeMB: number = 5): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }, []);

  const validateFileType = useCallback(
    (file: File, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg']): boolean => {
      return allowedTypes.includes(file.type);
    },
    [],
  );

  return {
    validateField,
    validateStep,
    validateFileSize,
    validateFileType,
  };
}

function getStepFields(step: number): (keyof SellerFormData)[] {
  switch (step) {
    case 1:
      return ['shopName', 'description', 'email', 'phoneNumber'];
    case 2:
      return ['addressLine', 'state', 'district', 'ward'];
    case 3:
      return ['identityNumber'];
    default:
      return [];
  }
}
