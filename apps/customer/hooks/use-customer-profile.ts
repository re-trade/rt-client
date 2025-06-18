import type { TCustomerProfileResponse } from '@services/auth.api';
import { customerProfile } from '@services/auth.api';
import { useCallback, useEffect, useState } from 'react';
function useCustomerProfile() {
  const [profile, setProfile] = useState<TCustomerProfileResponse>();
  const [updateProfileForm, setUpdateProfileForm] = useState<TCustomerProfileResponse>();
  const getCustomerProfile = useCallback(async () => {
    try {
      const response = await customerProfile();
      if (!response) {
        throw new Error('No response');
      }
      setProfile(response);
      setUpdateProfileForm(response);
    } catch {
      throw new Error('Failed to fetch profile');
    }
  }, []);
  const updateProfile = useCallback(async () => {
    try {
      const response = await customerProfile();
      if (!response) {
        throw new Error('No response');
      }
      setProfile(response);
      // setUpdateProfile(response);
    } catch {
      throw new Error('Failed to update profile');
    }
  }, []);
  useEffect(() => {});
  return {
    profile,
    updateProfile,
    updateProfileForm,
    setUpdateProfileForm,
  };
}

export { useCustomerProfile };
