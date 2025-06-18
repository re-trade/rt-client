import { TCustomerProfileResponse, profileApi } from '@services/customer-profile.api';
import { useCallback, useEffect, useState } from 'react';

function useCustomerProfile() {
  const [profile, setProfile] = useState<TCustomerProfileResponse>();
  const [updateProfileForm, setUpdateProfileForm] = useState<TCustomerProfileResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const getCustomerProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileApi.getCustomerProfile();
      if (!response) {
        throw new Error('No response');
      }
      setProfile(response);
      setUpdateProfileForm(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async () => {
    const dataToUpdate = updateProfileForm
      ? {
          firstName: updateProfileForm.firstName,
          lastName: updateProfileForm.lastName,
          phone: updateProfileForm.phone,
          avatarUrl: updateProfileForm.avatarUrl,
          address: updateProfileForm.address,
        }
      : null;

    if (!dataToUpdate) {
      throw new Error('No profile data to update');
    }
    console.log(dataToUpdate);

    setIsLoading(true);
    setError(null);
    try {
      const response = await profileApi.updateCustomerProfile(dataToUpdate);
      if (!response) {
        throw new Error('No response from update');
      }
      setProfile(response);
      setUpdateProfileForm(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [profile?.id, updateProfileForm]);

  const uploadAndUpdateAvatar = useCallback(
    async (file: File) => {
      setIsUploadingAvatar(true);
      setError(null);
      try {
        const uploadedUrl = await profileApi.uploadAvatar(file);
        if (!uploadedUrl) {
          throw new Error('Failed to upload avatar file');
        }
        await profileApi.updateAvatar(uploadedUrl);
        await getCustomerProfile();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update avatar';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsUploadingAvatar(false);
      }
    },
    [getCustomerProfile],
  );

  useEffect(() => {
    getCustomerProfile();
  }, []);

  return {
    profile,
    updateProfile,
    updateProfileForm,
    setUpdateProfileForm,
    getCustomerProfile,
    isLoading,
    isUploadingAvatar,
    uploadAndUpdateAvatar,
    error,
  };
}

export { useCustomerProfile };
