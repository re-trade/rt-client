'use client';

import { ReplyDialog } from '@/components/dialog/add/reply-review-dialog';
import { ReviewDetailDialog } from '@/components/dialog/view-update/review-detail-dialog';
import { ReviewStats } from '@/components/dialog/view-update/review-stats';
import { ReviewTable } from '@/components/dialog/view-update/review-table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ReviewResponse, reviewApi } from '@/service/review.api';

export default function ReviewsPage() {
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [replyFilter, setReplyFilter] = useState<string>('all'); // chưa dùng
  const [productReviews, setProductReviews] = useState<ReviewResponse[]>([]);

  const fetchReviews = async (vote?: number, q?: string) => {
    try {
      const reviews = await reviewApi.getAllreviewsBySeller(0, 10, vote, "a");
      console.log('Fetched reviews:', reviews);
      setProductReviews(reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  useEffect(() => {
    const vote = ratingFilter === 'all' ? undefined : Number(ratingFilter);
    const q = searchTerm || undefined;
    fetchReviews(vote, q);
  }, [searchTerm, ratingFilter]);

  const handleViewDetail = (review: ReviewResponse) => {
    setSelectedReview(review);
    setIsDetailOpen(true);
  };

  const handleReply = (review: ReviewResponse) => {
    setSelectedReview(review);
    setIsReplyOpen(true);
  };

  const handleSubmitReply = (reviewId: string, replyContent: string) => {
    setProductReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              shopReply: {
                content: replyContent,
                createdAt: new Date().toISOString(),
              },
            }
          : review
      )
    );
    setSelectedReview(null); // ✅ fix lỗi
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Quản lý đánh giá</h2>
        <p className="text-muted-foreground">Xem và phản hồi đánh giá từ khách hàng</p>
      </div>

      <ReviewStats reviews={productReviews} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo tên khách hàng, sản phẩm, nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Lọc theo sao" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả đánh giá</SelectItem>
            <SelectItem value="5">5 sao</SelectItem>
            <SelectItem value="4">4 sao</SelectItem>
            <SelectItem value="3">3 sao</SelectItem>
            <SelectItem value="2">2 sao</SelectItem>
            <SelectItem value="1">1 sao</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ReviewTable
        reviews={productReviews}
        onViewDetail={handleViewDetail}
        onReply={handleReply}
      />

      <ReviewDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        review={selectedReview}
      />

      <ReplyDialog
        open={isReplyOpen}
        onOpenChange={setIsReplyOpen}
        review={selectedReview}
        onSubmitReply={handleSubmitReply}
      />
    </div>
  );
}
