import { authApi, IResponseObject } from '@retrade/util';

type TAchievementResponse = {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  achieved: true;
  progress: 0;
  achievedAt: string;
};

export const achievementApi = {
  async getMyAchievements(): Promise<{
    content: TAchievementResponse[];
    totalPages: number;
    totalElements: number;
  }> {
    try {
      const response = await authApi.achievement.get<IResponseObject<TAchievementResponse[]>>(
        '/seller-achievements/seller/me/completed',
      );
      if (response.data.success) {
        return {
          content: response.data.content,
          totalPages: response.data.pagination?.totalPages ?? 1,
          totalElements: response.data.pagination?.totalElements ?? 0,
        };
      } else {
        return {
          content: [],
          totalPages: 1,
          totalElements: 0,
        };
      }
    } catch {
      return {
        content: [],
        totalPages: 1,
        totalElements: 0,
      };
    }
  },
};
export type { TAchievementResponse };
