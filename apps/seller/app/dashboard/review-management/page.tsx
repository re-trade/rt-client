'use client';

import { ReplyDialog } from '@/components/dialog-common/add/reply-review-dialog';
import { ReviewDetailDialog } from '@/components/dialog-common/view-update/review-detail-dialog';
import { ReviewStats } from '@/components/dialog-common/view-update/review-stats';
import { ReviewTable } from '@/components/dialog-common/view-update/review-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReviewResponse, reviewApi } from '@/service/review.api';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ReviewsPage() {
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [replyFilter, setReplyFilter] = useState<string>('all');
  const [productReviews, setProductReviews] = useState<ReviewResponse[]>([]);

  const fetchReviews = async (vote?: number, q?: string, reply?: string) => {
    try {
      const reviews = await reviewApi.getAllreviewsBySeller(0, 10, vote, q);
      console.log('Fetched reviews:', reviews);
      setProductReviews(reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  // Fetch reviews on initial load and when ratingFilter or replyFilter changes
  useEffect(() => {
    const vote = ratingFilter === 'all' ? undefined : Number(ratingFilter);
    const q = searchTerm || undefined;
    const reply = replyFilter === 'all' ? undefined : replyFilter;
    fetchReviews(vote, q, reply);
  }, [ratingFilter, replyFilter]); // Dependencies: ratingFilter, replyFilter

  const handleSearch = () => {
    const vote = ratingFilter === 'all' ? undefined : Number(ratingFilter);
    const q = searchTerm || undefined;
    const reply = replyFilter === 'all' ? undefined : replyFilter;
    fetchReviews(vote, q, reply);
  };

  const handleViewDetail = (review: ReviewResponse) => {
    setSelectedReview(review);
    setIsDetailOpen(true);
  };

  const handleReply = (review: ReviewResponse) => {
    setSelectedReview(review);
    setIsReplyOpen(true);
  };

  const handleSubmitReply = (reviewId: string, replyContent: string) => {
    reviewApi
      .replyReview(reviewId, replyContent)
      .then((updatedReview) => {
        setProductReviews((prevReviews) =>
          prevReviews.map((r) => (r.id === updatedReview.id ? updatedReview : r)),
        );
        setIsReplyOpen(false);
      })
      .catch((error) => {
        console.error('Failed to submit reply:', error);
      });
    // Reset selected review after reply submission
    setSelectedReview(null);
  };

  return (
    <div className="space-y-6">
      {/* <div>
        <p className="text-muted-foreground">Xem và phản hồi đánh giá từ khách hàng</p>
      </div> */}
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
        <Select value={replyFilter} onValueChange={setReplyFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Lọc theo phản hồi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả phản hồi</SelectItem>
            <SelectItem value="replied">Đã phản hồi</SelectItem>
            <SelectItem value="unreplied">Chưa phản hồi</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className="w-full sm:w-auto">
          Tìm kiếm
        </Button>
      </div>

      <ReviewTable reviews={productReviews} onViewDetail={handleViewDetail} onReply={handleReply} />

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
