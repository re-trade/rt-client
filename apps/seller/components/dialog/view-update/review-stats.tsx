import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { reviewApi, ReviewResponse, StatsReViewResponse } from '@/service/review.api';
import { MessageSquare, Star, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ReviewStatsProps {
  reviews: ReviewResponse[];
}

export function ReviewStats({ reviews }: ReviewStatsProps) {
  const [stats, setStats] = useState<StatsReViewResponse | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await reviewApi.getStatsReviewsSeller();
        console.log('Review stats:', response);
        setStats(response);
      } catch (error) {
        console.error('Failed to fetch review stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <p className="text-muted-foreground">Đang tải thống kê đánh giá...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng đánh giá</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalReviews}</div>
          <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đánh giá trung bình</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-1">
            {stats.averageRating}
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-xs text-muted-foreground">+0.2 so với tháng trước</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tỷ lệ phản hồi</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.replyRate}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.repliedReviews}/{stats.totalReviews} đã phản hồi
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đánh giá tích cực</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averagePositiveRating}%</div>
          <p className="text-xs text-muted-foreground">4-5 sao</p>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle>Phân bố đánh giá</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.isArray(stats.ratingDistribution) &&
              stats.ratingDistribution.map((item) => (
                <div key={item.vote} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm">{item.vote}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground w-16 text-right">
                    {item.count} ({item.percentage}%)
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
