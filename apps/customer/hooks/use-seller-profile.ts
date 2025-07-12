'use client';

import { getSellerProfile, TSellerProfile } from '@services/seller.api';
import { useCallback, useEffect, useState } from 'react';

type TAchievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  achieved: boolean;
  progress?: number;
  target?: number;
};

function useSellerProfile(id: string) {
  const [sellerProfile, setSellerProfile] = useState<TSellerProfile>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [achievements, setAchievements] = useState<TAchievement[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(false);
  const fetchSellerProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const seller = await getSellerProfile(id);
      console.log(seller);
      setSellerProfile(seller);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  }, [id]);

  const fetchSellerAchievement = useCallback(async () => {
    setLoadingAchievements(true);
    try {
      setTimeout(() => {
        const mockAchievements: TAchievement[] = [
          {
            id: '1',
            title: 'Người bán mới',
            description: 'Hoàn thành đăng ký và xác minh tài khoản',
            icon: '🎯',
            color: 'bg-green-500',
            achieved: true,
          },
          {
            id: '2',
            title: '100 sản phẩm đầu tiên',
            description: 'Đã bán thành công 100 sản phẩm',
            icon: '📦',
            color: 'bg-blue-500',
            achieved: true,
          },
          {
            id: '3',
            title: 'Đánh giá 5 sao',
            description: 'Duy trì đánh giá 4.8+ sao trong 3 tháng',
            icon: '⭐',
            color: 'bg-yellow-500',
            achieved: true,
          },
          {
            id: '4',
            title: 'Người bán uy tín',
            description: 'Đạt 1000 đơn hàng thành công',
            icon: '🏆',
            color: 'bg-orange-500',
            achieved: false,
            progress: 756,
            target: 1000,
          },
          {
            id: '5',
            title: 'Siêu người bán',
            description: 'Đạt doanh thu 100 triệu VNĐ',
            icon: '💎',
            color: 'bg-purple-500',
            achieved: false,
            progress: 67,
            target: 100,
          },
        ];
        setAchievements(mockAchievements);
      });
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
    setLoadingAchievements(false);
  }, []);

  useEffect(() => {
    fetchSellerProfile();
    fetchSellerAchievement();
  }, [fetchSellerProfile, fetchSellerAchievement]);
  return {
    error,
    sellerProfile,
    loading,
    achievements,
    loadingAchievements,
  };
}

export { useSellerProfile };
