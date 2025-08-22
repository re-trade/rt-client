import { Award, Crown, ShoppingBag, Star, Trophy, UserCheck, Zap } from 'lucide-react';

export type AchievementType =
  | 'SELLER_REGISTER'
  | 'FIRST_ORDER'
  | 'HARD_WORKER'
  | 'POPULAR_SELLER'
  | 'TOP_SELLER'
  | 'LEGEND_SELLER';

export const achievementIcons = {
  SELLER_REGISTER: UserCheck,
  FIRST_ORDER: ShoppingBag,
  HARD_WORKER: Zap,
  POPULAR_SELLER: Star,
  TOP_SELLER: Trophy,
  LEGEND_SELLER: Crown,
} as const;

export const achievementColors = {
  SELLER_REGISTER: 'from-blue-500 to-blue-600',
  FIRST_ORDER: 'from-green-500 to-green-600',
  HARD_WORKER: 'from-orange-500 to-orange-600',
  POPULAR_SELLER: 'from-yellow-500 to-yellow-600',
  TOP_SELLER: 'from-purple-500 to-purple-600',
  LEGEND_SELLER: 'from-red-500 to-red-600',
} as const;

export const achievementBgColors = {
  SELLER_REGISTER: 'bg-blue-50',
  FIRST_ORDER: 'bg-green-50',
  HARD_WORKER: 'bg-orange-50',
  POPULAR_SELLER: 'bg-yellow-50',
  TOP_SELLER: 'bg-purple-50',
  LEGEND_SELLER: 'bg-red-50',
} as const;

export const getAchievementIcon = (code: string) => {
  return achievementIcons[code as AchievementType] || Award;
};

export const getAchievementColor = (code: string) => {
  return achievementColors[code as AchievementType] || 'from-gray-500 to-gray-600';
};

export const getAchievementBgColor = (code: string) => {
  return achievementBgColors[code as AchievementType] || 'bg-gray-50';
};
