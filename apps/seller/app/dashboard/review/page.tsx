'use client';

import { ReplyDialog } from '@/components/dialog-common/add/reply-review-dialog';
import { ReviewDetailDialog } from '@/components/dialog-common/view-update/review-detail-dialog';
import { ReviewStats } from '@/components/dialog-common/view-update/review-stats';
import { ReviewTable } from '@/components/dialog-common/view-update/review-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReviewResponse, reviewApi } from '@/service/review.api';
import { Filter, MessageSquare, RotateCcw, Search, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ReviewsPage() {
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [replyFilter, setReplyFilter] = useState<string>('all');
  const [productReviews, setProductReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const fetchReviews = async (vote?: number, q?: string, reply?: string) => {
    try {
      setIsSearching(true);
      const reviews = await reviewApi.getAllreviewsBySeller(0, 10, vote, q);
      console.log('Fetched reviews:', reviews);
      setProductReviews(reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Fetch reviews on initial load and when ratingFilter or replyFilter changes
  useEffect(() => {
    const vote = ratingFilter === 'all' ? undefined : Number(ratingFilter);
    const q = searchTerm || undefined;
    const reply = replyFilter === 'all' ? undefined : replyFilter;
    fetchReviews(vote, q, reply);
  }, [ratingFilter, replyFilter]);

  const handleSearch = () => {
    const vote = ratingFilter === 'all' ? undefined : Number(ratingFilter);
    const q = searchTerm || undefined;
    const reply = replyFilter === 'all' ? undefined : replyFilter;
    fetchReviews(vote, q, reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setRatingFilter('all');
    setReplyFilter('all');
    fetchReviews();
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
    setSelectedReview(null);
  };

  const activeFiltersCount = [
    searchTerm ? 1 : 0,
    ratingFilter !== 'all' ? 1 : 0,
    replyFilter !== 'all' ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Loading skeleton for table */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đánh giá</h1>
        </div>
        <p className="text-muted-foreground">
          Xem và phản hồi đánh giá từ khách hàng để cải thiện dịch vụ
        </p>
      </div>

      {/* Stats */}
      <ReviewStats reviews={productReviews} />

      {/* Filters Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc tìm kiếm
            {activeFiltersCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {activeFiltersCount} bộ lọc
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên khách hàng, sản phẩm, nội dung..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-10"
              />
            </div>

            {/* Rating Filter */}
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full lg:w-48 h-10">
                <SelectValue placeholder="Lọc theo sao" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả đánh giá</SelectItem>
                <SelectItem value="5">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />5 sao
                  </div>
                </SelectItem>
                <SelectItem value="4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />4 sao
                  </div>
                </SelectItem>
                <SelectItem value="3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />3 sao
                  </div>
                </SelectItem>
                <SelectItem value="2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />2 sao
                  </div>
                </SelectItem>
                <SelectItem value="1">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />1 sao
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Reply Filter */}
            <Select value={replyFilter} onValueChange={setReplyFilter}>
              <SelectTrigger className="w-full lg:w-48 h-10">
                <SelectValue placeholder="Lọc theo phản hồi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phản hồi</SelectItem>
                <SelectItem value="replied">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    Đã phản hồi
                  </div>
                </SelectItem>
                <SelectItem value="unreplied">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-yellow-600" />
                    Chưa phản hồi
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="h-10 bg-blue-600 hover:bg-blue-700"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Đang tìm...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Tìm kiếm
                  </>
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button variant="outline" onClick={handleReset} className="h-10 hover:bg-gray-50">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Đặt lại
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {productReviews && productReviews.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {productReviews.length} kết quả
            {activeFiltersCount > 0 && (
              <span className="ml-1 font-medium">với {activeFiltersCount} bộ lọc được áp dụng</span>
            )}
          </p>
        </div>
      )}

      {/* Review Table */}
      <ReviewTable reviews={productReviews} onViewDetail={handleViewDetail} onReply={handleReply} />

      {/* Dialogs */}
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
