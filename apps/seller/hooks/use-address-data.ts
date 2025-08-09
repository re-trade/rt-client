'use client';

import { unAuthApi } from '@retrade/util';
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

export function useAddressData() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProvinces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await unAuthApi.province.get<Province[]>('/p/');
      setProvinces(response.data || []);
    } catch {
      setError('Không thể tải danh sách tỉnh/thành phố');
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
      setError(null);
      const response = await unAuthApi.province.get<Province>(`/p/${provinceCode}?depth=2`);
      setDistricts(response.data.districts || []);
      setWards([]);
    } catch {
      setError('Không thể tải danh sách quận/huyện');
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
      setError(null);
      const response = await unAuthApi.province.get<District>(`/d/${districtCode}?depth=2`);
      setWards(response.data.wards || []);
    } catch {
      setError('Không thể tải danh sách phường/xã');
    } finally {
      setLoading(false);
    }
  }, []);

  const getProvinceByCode = useCallback(
    (code: string) => {
      return provinces.find((p) => p.code.toString() === code);
    },
    [provinces],
  );

  const getDistrictByCode = useCallback(
    (code: string) => {
      return districts.find((d) => d.code.toString() === code);
    },
    [districts],
  );

  const getWardByCode = useCallback(
    (code: string) => {
      return wards.find((w) => w.code.toString() === code);
    },
    [wards],
  );

  const getProvinceByName = useCallback(
    (name: string) => {
      return provinces.find((p) => p.name === name);
    },
    [provinces],
  );

  const getDistrictByName = useCallback(
    (name: string) => {
      return districts.find((d) => d.name === name);
    },
    [districts],
  );

  const getWardByName = useCallback(
    (name: string) => {
      return wards.find((w) => w.name === name);
    },
    [wards],
  );

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  return {
    provinces,
    districts,
    wards,
    loading,
    error,
    fetchProvinces,
    fetchDistricts,
    fetchWards,
    getProvinceByCode,
    getDistrictByCode,
    getWardByCode,
    getProvinceByName,
    getDistrictByName,
    getWardByName,
  };
}
