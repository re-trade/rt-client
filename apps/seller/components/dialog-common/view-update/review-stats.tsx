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
        <p className="text-muted-foreground">Không thể tải thống kê đánh giá</p>
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
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Đánh giá trung bình',
      value: stats.averageRating,
      change: '+0.2',
      changeLabel: 'so với tháng trước',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      customValue: (
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold">{stats.averageRating}</span>
          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
        </div>
      ),
    },
    {
      title: 'Tỷ lệ phản hồi',
      value: `${stats.replyRate}%`,
      change: `${stats.repliedReviews}/${stats.totalReviews}`,
      changeLabel: 'đã phản hồi',
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Đánh giá tích cực',
      value: `${stats.averagePositiveReviews}%`,
      change: `${stats.totalPositiveReviews}`,
      changeLabel: 'đánh giá (4-5 sao)',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className={`${stat.bgColor} ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.customValue || stat.value}
              </div>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <span className="text-green-600 font-medium">{stat.change}</span>
                {stat.changeLabel}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Rating Distribution */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Phân bố đánh giá
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
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
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
