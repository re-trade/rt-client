'use client';

import { useRegistration } from '@/context/RegistrationContext';
import { useToast } from '@/hooks/use-toast';
import { sellerApi, SellerProfileRegisterRequest } from '@/service/seller.api';
import { storageApi } from '@/service/storage.api';
import { useCallback } from 'react';
import { useRegistrationAddressData } from './use-registration-address-data';
import { useRegistrationValidation } from './use-registration-validation';

export function useRegistrationSubmission() {
  const { formData, setIsSubmitting, setErrors, nextStep, currentStep } = useRegistration();

  const { validateStep } = useRegistrationValidation();
  const { getSelectedProvince, getSelectedDistrict, getSelectedWard } =
    useRegistrationAddressData();
  const { showToast, showToastFromResponse } = useToast();

  const rollbackSellerProfile = useCallback(
    async (sellerId?: string) => {
      if (!sellerId) {
        console.log('No seller ID provided for rollback');
        return;
      }

      try {
        showToast('Đang thực hiện rollback...', 'info');
        const response = await sellerApi.rollbackSellerProfile(sellerId);

        if (response?.success) {
          showToastFromResponse(response, 'success', 'Đã rollback thành công');
        } else if (response) {
          showToastFromResponse(response, 'error', 'Rollback thất bại');
        } else {
          showToast('Rollback thất bại', 'error');
        }
      } catch (error) {
        showToast('Rollback thất bại', 'error');
      }
    },
    [showToast, showToastFromResponse],
  );

  const submitRegistration = useCallback(async (): Promise<boolean> => {
    try {
      setIsSubmitting(true);

      for (let step = 1; step <= 3; step++) {
        if (!validateStep(step, formData)) {
          showToast(`Vui lòng kiểm tra lại thông tin ở bước ${step}`, 'error');
          return false;
        }
      }

      const selectedProvince = getSelectedProvince();
      const selectedDistrict = getSelectedDistrict();
      const selectedWard = getSelectedWard();

      if (!selectedProvince || !selectedDistrict || !selectedWard) {
        showToast('Vui lòng chọn đầy đủ thông tin địa chỉ', 'error');
        return false;
      }

      let avatarUrl = formData.avatarUrl;
      let background = formData.background;

      if (formData.avatarUrl instanceof File) {
        try {
          avatarUrl = await storageApi.fileUpload(formData.avatarUrl);
        } catch {
          showToast('Tải lên ảnh đại diện thất bại', 'error');
          return false;
        }
      }

      if (formData.background instanceof File) {
        try {
          background = await storageApi.fileUpload(formData.background);
        } catch {
          showToast('Tải lên ảnh bìa thất bại', 'error');
          return false;
        }
      }

      const requestBody: SellerProfileRegisterRequest = {
        shopName: formData.shopName,
        description: formData.description,
        addressLine: formData.addressLine,
        district: selectedDistrict.name,
        ward: selectedWard.name,
        state: selectedProvince.name,
        email: formData.email,
        avatarUrl: avatarUrl as string,
        background: background as string,
        phoneNumber: formData.phoneNumber,
        identityNumber: formData.identityNumber,
      };

      const sellerResult = await sellerApi.registerSeller(requestBody);
      if (!sellerResult?.success) {
        if (sellerResult) {
          showToastFromResponse(
            sellerResult,
            'error',
            'Đăng ký không thành công! Vui lòng kiểm tra thông tin và thử lại.',
          );
        } else {
          showToast('Đăng ký không thành công! Vui lòng kiểm tra thông tin và thử lại.', 'error');
        }
        return false;
      }

      if (!formData.identityBackImage || !formData.identityFrontImage) {
        setErrors({
          ...(!formData.identityBackImage
            ? { identityBackImage: 'Ảnh mặt sau CMND/CCCD là bắt buộc' }
            : {}),
          ...(!formData.identityFrontImage
            ? { identityFrontImage: 'Ảnh mặt trước CMND/CCCD là bắt buộc' }
            : {}),
        });

        await rollbackSellerProfile(sellerResult.content?.id);
        return false;
      }

      try {
        const verificationResult = await sellerApi.sellerVerification({
          backIdentity: formData.identityBackImage,
          frontIdentity: formData.identityFrontImage,
        });

        if (!verificationResult?.success) {
          if (verificationResult) {
            showToastFromResponse(
              verificationResult,
              'error',
              'Tải lên giấy tờ xác minh không thành công!',
            );
          } else {
            showToast('Tải lên giấy tờ xác minh không thành công!', 'error');
          }
          await rollbackSellerProfile(sellerResult.content?.id);
          return false;
        }
      } catch (error) {
        showToast('Tải lên giấy tờ xác minh không thành công!', 'error');
        await rollbackSellerProfile(sellerResult.content?.id);
        return false;
      }

      showToast(
        'Chào mừng bạn đến với ReTrade! Đăng ký thành công. Đang chuyển hướng về trang chủ...',
        'success',
      );
      console.log('Registration successful, returning true'); // Debug log
      return true;
    } catch (error) {
      let errorMessage = 'Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.';
        }
      }

      showToast(errorMessage, 'error');
      setErrors({ general: errorMessage });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formData,
    setIsSubmitting,
    setErrors,
    validateStep,
    getSelectedProvince,
    getSelectedDistrict,
    getSelectedWard,
    showToast,
    rollbackSellerProfile,
  ]);

  const handleNextStep = useCallback(async () => {
    if (validateStep(currentStep, formData)) {
      if (currentStep === 4) {
        const success = await submitRegistration();
        if (success) {
          nextStep();
        }
      } else {
        nextStep();
      }
    } else {
      showToast(`Vui lòng hoàn thành thông tin ở bước ${currentStep}`, 'error');
    }
  }, [currentStep, formData, validateStep, submitRegistration, nextStep, showToast]);

  return {
    submitRegistration,
    handleNextStep,
    rollbackSellerProfile,
  };
}
