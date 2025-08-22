import { unAuthApi } from '@retrade/util';
import { profileApi, TCustomerProfileResponse } from '@services/customer-profile.api';
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

function useCustomerProfile() {
  const [profile, setProfile] = useState<TCustomerProfileResponse>();
  const [updateProfileForm, setUpdateProfileForm] = useState<TCustomerProfileResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Address management state
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Address management functions
  const fetchProvinces = useCallback(async () => {
    try {
      setLoadingAddress(true);
      const response = await unAuthApi.province.get<Province[]>('/p/');
      setProvinces(response.data);
    } catch {
      setError('Không thể tải danh sách tỉnh/thành phố');
    } finally {
      setLoadingAddress(false);
    }
  }, []);

  const fetchDistricts = useCallback(async (provinceCode: string) => {
    if (!provinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }
    try {
      setLoadingAddress(true);
      const response = await unAuthApi.province.get<Province>(`/p/${provinceCode}?depth=2`);
      setDistricts(response.data.districts || []);
      setWards([]);
    } catch {
      setError('Không thể tải danh sách quận/huyện');
    } finally {
      setLoadingAddress(false);
    }
  }, []);

  const fetchWards = useCallback(async (districtCode: string) => {
    if (!districtCode) {
      setWards([]);
      return;
    }
    try {
      setLoadingAddress(true);
      const response = await unAuthApi.province.get<District>(`/d/${districtCode}?depth=2`);
      setWards(response.data.wards || []);
    } catch {
      setError('Không thể tải danh sách phường/xã');
    } finally {
      setLoadingAddress(false);
    }
  }, []);

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

  // Address change handlers
  const handleAddressChange = useCallback(
    (type: string, value: string) => {
      if (type === 'province') {
        setSelectedProvince(value);
        setSelectedDistrict('');
        setSelectedWard('');
        if (value) {
          fetchDistricts(value);
        }
      } else if (type === 'district') {
        setSelectedDistrict(value);
        setSelectedWard('');
        if (value) {
          fetchWards(value);
        }
      } else if (type === 'ward') {
        setSelectedWard(value);
      }
    },
    [fetchDistricts, fetchWards],
  );

  const buildFullAddress = useCallback(() => {
    const parts = [];

    // Add ward first (if selected)
    if (selectedWard) {
      const ward = wards.find((w) => w.code.toString() === selectedWard);
      if (ward) parts.push(ward.name);
    }

    // Add district second (if selected)
    if (selectedDistrict) {
      const district = districts.find((d) => d.code.toString() === selectedDistrict);
      if (district) parts.push(district.name);
    }

    // Add province last (if selected)
    if (selectedProvince) {
      const province = provinces.find((p) => p.code.toString() === selectedProvince);
      if (province) parts.push(province.name);
    }

    return parts.join(', ');
  }, [selectedWard, selectedDistrict, selectedProvince, wards, districts, provinces]);

  // Parse existing address when entering edit mode
  const parseExistingAddress = useCallback(async (address: string) => {
    if (!address) return;

    try {
      setLoadingAddress(true);

      // Load all provinces first
      const provinceResponse = await unAuthApi.province.get<Province[]>('/p/');
      setProvinces(provinceResponse.data);

      // Try to find matching province, district, and ward from the address string
      // This is a simple approach - in a real app you might want more sophisticated parsing
      const addressParts = address.split(', ').map((part) => part.trim());

      // Look for province (usually contains "Tỉnh" or "Thành phố")
      const provinceKeywords = ['Tỉnh', 'Thành phố'];
      const provincePart = addressParts.find((part) =>
        provinceKeywords.some((keyword) => part.includes(keyword)),
      );

      if (provincePart) {
        const province = provinceResponse.data.find((p) => p.name === provincePart);
        if (province) {
          setSelectedProvince(province.code.toString());

          // Load districts for this province
          const districtResponse = await unAuthApi.province.get<Province>(
            `/p/${province.code}?depth=2`,
          );
          setDistricts(districtResponse.data.districts || []);

          // Look for district (usually contains "Quận", "Huyện", "Thị xã")
          const districtKeywords = ['Quận', 'Huyện', 'Thị xã'];
          const districtPart = addressParts.find((part) =>
            districtKeywords.some((keyword) => part.includes(keyword)),
          );

          if (districtPart) {
            const district = districtResponse.data.districts.find((d) => d.name === districtPart);
            if (district) {
              setSelectedDistrict(district.code.toString());

              // Load wards for this district
              const wardResponse = await unAuthApi.province.get<District>(
                `/d/${district.code}?depth=2`,
              );
              setWards(wardResponse.data.wards || []);

              // Look for ward (usually contains "Phường", "Xã", "Thị trấn")
              const wardKeywords = ['Phường', 'Xã', 'Thị trấn'];
              const wardPart = addressParts.find((part) =>
                wardKeywords.some((keyword) => part.includes(keyword)),
              );

              if (wardPart) {
                const ward = wardResponse.data.wards.find((w) => w.name === wardPart);
                if (ward) {
                  setSelectedWard(ward.code.toString());
                }
              }
            }
          }
        }
      }

      // Note: We no longer use address line, only province/district/ward
    } catch (error) {
      console.error('Error parsing address:', error);
      setError('Không thể phân tích địa chỉ hiện tại');
    } finally {
      setLoadingAddress(false);
    }
  }, []);

  const updateProfile = useCallback(async () => {
    const fullAddress = buildFullAddress();

    const dataToUpdate = updateProfileForm
      ? {
          firstName: updateProfileForm.firstName,
          lastName: updateProfileForm.lastName,
          phone: updateProfileForm.phone,
          avatarUrl: updateProfileForm.avatarUrl,
          address: fullAddress || updateProfileForm.address,
          gender: updateProfileForm.gender,
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
  }, [updateProfileForm, buildFullAddress]);

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

  // Load districts when province changes (only during edit mode)
  useEffect(() => {
    if (selectedProvince && provinces.length > 0) {
      fetchDistricts(selectedProvince);
    }
  }, [selectedProvince, fetchDistricts, provinces.length]);

  // Load wards when district changes (only during edit mode)
  useEffect(() => {
    if (selectedDistrict && districts.length > 0) {
      fetchWards(selectedDistrict);
    }
  }, [selectedDistrict, fetchWards, districts.length]);

  // Function to handle entering edit mode
  const handleEnterEditMode = useCallback(async () => {
    if (profile?.address) {
      await parseExistingAddress(profile.address);
    } else {
      // If no existing address, just load provinces
      await fetchProvinces();
    }
  }, [profile?.address, parseExistingAddress, fetchProvinces]);

  // Function to handle exiting edit mode (reset address fields)
  const handleExitEditMode = useCallback(() => {
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedWard('');
    setProvinces([]);
    setDistricts([]);
    setWards([]);
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
    // Address management
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    loadingAddress,
    handleAddressChange,
    fetchProvinces,
    parseExistingAddress,
    handleEnterEditMode,
    handleExitEditMode,
  };
}

export { useCustomerProfile };
