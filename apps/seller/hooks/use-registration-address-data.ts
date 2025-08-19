'use client';

import { useRegistration } from '@/context/RegistrationContext';
import { useToast } from '@/hooks/use-toast';
import { District, Province } from '@/types/registration';
import { unAuthApi } from '@retrade/util';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export function useRegistrationAddressData() {
  const {
    provinces,
    districts,
    wards,
    setProvinces,
    setDistricts,
    setWards,
    setLoading,
    formData,
    updateField,
  } = useRegistration();
  const { showToast } = useToast();

  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  const fetchProvinces = useCallback(async () => {
    try {
      setLoading(true);
      const response = await unAuthApi.province.get<Province[]>('/p/');
      if (response.data) {
        setProvinces(response.data);
      }
    } catch (error) {
      showToast('Không thể tải danh sách tỉnh/thành phố', 'error');
    } finally {
      setLoading(false);
    }
  }, [setProvinces, setLoading, showToast]);

  const fetchDistricts = useCallback(
    async (provinceCode: string) => {
      if (!provinceCode) {
        setDistricts([]);
        return;
      }

      try {
        setLoading(true);
        const response = await unAuthApi.province.get<Province>(`/p/${provinceCode}?depth=2`);
        if (response.data?.districts) {
          setDistricts(response.data.districts);
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
        showToast('Không thể tải danh sách quận/huyện', 'error');
        setDistricts([]);
      } finally {
        setLoading(false);
      }
    },
    [setDistricts, setLoading, showToast],
  );

  const fetchWards = useCallback(
    async (districtCode: string) => {
      if (!districtCode) {
        setWards([]);
        return;
      }

      try {
        setLoading(true);
        const response = await unAuthApi.province.get<District>(`/d/${districtCode}?depth=2`);
        if (response.data?.wards) {
          setWards(response.data.wards);
        }
      } catch (error) {
        console.error('Error fetching wards:', error);
        showToast('Không thể tải danh sách phường/xã', 'error');
        setWards([]);
      } finally {
        setLoading(false);
      }
    },
    [setWards, setLoading, showToast],
  );

  const handleProvinceChange = useCallback(
    (provinceCode: string) => {
      updateField('state', provinceCode);
      updateField('district', '');
      updateField('ward', '');
      setDistricts([]);
      setWards([]);
      fetchDistricts(provinceCode);
    },
    [updateField, setDistricts, setWards, fetchDistricts],
  );

  const handleDistrictChange = useCallback(
    (districtCode: string) => {
      updateField('district', districtCode);
      updateField('ward', '');
      setWards([]);
      fetchWards(districtCode);
    },
    [updateField, setWards, fetchWards],
  );

  const handleWardChange = useCallback(
    (wardCode: string) => {
      updateField('ward', wardCode);
    },
    [updateField],
  );

  const getSelectedProvince = useCallback(() => {
    return provinces.find((p) => p.code.toString() === formData.state);
  }, [provinces, formData.state]);

  const getSelectedDistrict = useCallback(() => {
    return districts.find((d) => d.code.toString() === formData.district);
  }, [districts, formData.district]);

  const getSelectedWard = useCallback(() => {
    return wards.find((w) => w.code.toString() === formData.ward);
  }, [wards, formData.ward]);

  useEffect(() => {
    if (provinces.length === 0) {
      fetchProvinces();
    }
  }, []);

  return useMemo(
    () => ({
      provinces,
      districts,
      wards,
      handleProvinceChange,
      handleDistrictChange,
      handleWardChange,
      getSelectedProvince,
      getSelectedDistrict,
      getSelectedWard,
      fetchProvinces,
      fetchDistricts,
      fetchWards,
    }),
    [
      provinces,
      districts,
      wards,
      handleProvinceChange,
      handleDistrictChange,
      handleWardChange,
      getSelectedProvince,
      getSelectedDistrict,
      getSelectedWard,
      fetchProvinces,
      fetchDistricts,
      fetchWards,
    ],
  );
}
