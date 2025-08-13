import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { reviewApi, ReviewResponse, StatsReViewResponse } from '@/service/review.api';
import { BarChart3, MessageSquare, Star, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ReviewStatsProps {
  reviews: ReviewResponse[];
}

export function ReviewStats({ reviews }: ReviewStatsProps) {
  const [stats, setStats] = useState<StatsReViewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await reviewApi.getStatsReviewsSeller();
        setStats(response);
      } catch (error) {
        console.error('Failed to fetch review stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="p-8 text-center">
        <span className="text-muted-foreground">Không thể tải thống kê đánh giá</span>
      </Card>
    );
  }

  const statsCards = [
    {
      title: 'Tổng đánh giá',
      value: stats.totalReviews.toLocaleString(),
      change: '+12%',
      changeLabel: 'so với tháng trước',
      icon: Users,
      color: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Đánh giá trung bình',
      value: stats.averageRating,
      change: '+0.2',
      changeLabel: 'so với tháng trước',
      icon: Star,
      color: 'text-amber-600',
      iconBgColor: 'bg-amber-100',
      customValue: (
        <span className="flex items-center gap-1">
          <span className="text-2xl font-bold">{stats.averageRating}</span>
          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
        </span>
      ),
    },
    {
      title: 'Tỷ lệ phản hồi',
      value: `${stats.replyRate}%`,
      change: `${stats.repliedReviews}/${stats.totalReviews}`,
      changeLabel: 'đã phản hồi',
      icon: MessageSquare,
      color: 'text-emerald-600',
      iconBgColor: 'bg-emerald-100',
    },
    {
      title: 'Đánh giá tích cực',
      value: `${stats.averagePositiveReviews}%`,
      change: `${stats.totalPositiveReviews}`,
      changeLabel: 'đánh giá (4-5 sao)',
      icon: TrendingUp,
      color: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="border shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.customValue || stat.value}
                  </p>
                  <span className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                    <span className="text-green-600 font-medium">{stat.change}</span>
                    {stat.changeLabel}
                  </span>
                </div>
                <div
                  className={`h-12 w-12 rounded-full ${stat.iconBgColor} flex items-center justify-center`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Rating Distribution */}
      <Card className="shadow-sm border bg-white">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            <span className="text-orange-500 border-b-2 border-orange-400 pb-2">
              Phân bố đánh giá
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.isArray(stats.ratingDistribution) &&
              stats.ratingDistribution.map((item) => (
                <div key={item.vote} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-20">
                        <span className="text-sm font-medium">{item.vote}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <span className="text-sm text-gray-600">{item.count} đánh giá</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{item.percentage}%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
