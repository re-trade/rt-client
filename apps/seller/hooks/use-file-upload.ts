'use client';

import { useRegistration } from '@/context/RegistrationContext';
import { useToast } from '@/hooks/use-toast';
import { storageApi } from '@/service/storage.api';
import { useCallback, useState } from 'react';
import { useRegistrationValidation } from './use-registration-validation';

interface UploadProgress {
  [key: string]: number;
}

interface UploadLoading {
  [key: string]: boolean;
}

export function useFileUpload() {
  const { updateField } = useRegistration();
  const { validateFileSize, validateFileType } = useRegistrationValidation();
  const { showToast } = useToast();

  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [uploadLoading, setUploadLoading] = useState<UploadLoading>({});

  const uploadFile = useCallback(
    async (
      file: File,
      fieldName: string,
      maxSizeMB: number = 5,
      allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg'],
    ): Promise<string | null> => {
      // Validate file size
      if (!validateFileSize(file, maxSizeMB)) {
        showToast(`Kích thước file không được vượt quá ${maxSizeMB}MB`, 'error');
        return null;
      }

      // Validate file type
      if (!validateFileType(file, allowedTypes)) {
        showToast(
          'Định dạng file không được hỗ trợ. Vui lòng chọn file JPG, JPEG hoặc PNG',
          'error',
        );
        return null;
      }

      try {
        setUploadLoading((prev) => ({ ...prev, [fieldName]: true }));
        setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }));

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const currentProgress = prev[fieldName] || 0;
            if (currentProgress < 90) {
              return { ...prev, [fieldName]: currentProgress + 10 };
            }
            return prev;
          });
        }, 100);

        const uploadedUrl = await storageApi.fileUpload(file);

        clearInterval(progressInterval);
        setUploadProgress((prev) => ({ ...prev, [fieldName]: 100 }));

        // Clear progress after a short delay
        setTimeout(() => {
          setUploadProgress((prev) => {
            const { [fieldName]: _, ...rest } = prev;
            return rest;
          });
        }, 1000);

        return uploadedUrl;
      } catch (error) {
        console.error('Upload error:', error);
        showToast('Tải lên file thất bại. Vui lòng thử lại', 'error');
        return null;
      } finally {
        setUploadLoading((prev) => ({ ...prev, [fieldName]: false }));
      }
    },
    [validateFileSize, validateFileType, showToast],
  );

  const handleAvatarUpload = useCallback(
    async (file: File) => {
      const uploadedUrl = await uploadFile(file, 'avatarUrl');
      if (uploadedUrl) {
        updateField('avatarUrl', uploadedUrl);
        showToast('Tải lên ảnh đại diện thành công', 'success');
      }
    },
    [uploadFile, updateField, showToast],
  );

  const handleBackgroundUpload = useCallback(
    async (file: File) => {
      const uploadedUrl = await uploadFile(file, 'background');
      if (uploadedUrl) {
        updateField('background', uploadedUrl);
        showToast('Tải lên ảnh bìa thành công', 'success');
      }
    },
    [uploadFile, updateField, showToast],
  );

  const handleIdentityFrontUpload = useCallback(
    async (file: File) => {
      // For identity images, we store the File object directly
      // They will be uploaded during final submission
      updateField('identityFrontImage', file);
      showToast('Đã chọn ảnh mặt trước CMND/CCCD', 'success');
    },
    [updateField, showToast],
  );

  const handleIdentityBackUpload = useCallback(
    async (file: File) => {
      // For identity images, we store the File object directly
      // They will be uploaded during final submission
      updateField('identityBackImage', file);
      showToast('Đã chọn ảnh mặt sau CMND/CCCD', 'success');
    },
    [updateField, showToast],
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, uploadHandler: (file: File) => Promise<void>) => {
      const file = event.target.files?.[0];
      if (file) {
        uploadHandler(file);
      }
    },
    [],
  );

  const removeFile = useCallback(
    (fieldName: string) => {
      updateField(fieldName as any, null);
      showToast('Đã xóa file', 'info');
    },
    [updateField, showToast],
  );

  const getUploadProgress = useCallback(
    (fieldName: string): number => {
      return uploadProgress[fieldName] || 0;
    },
    [uploadProgress],
  );

  const isUploading = useCallback(
    (fieldName: string): boolean => {
      return uploadLoading[fieldName] || false;
    },
    [uploadLoading],
  );

  return {
    uploadFile,
    handleAvatarUpload,
    handleBackgroundUpload,
    handleIdentityFrontUpload,
    handleIdentityBackUpload,
    handleFileChange,
    removeFile,
    getUploadProgress,
    isUploading,
  };
}
