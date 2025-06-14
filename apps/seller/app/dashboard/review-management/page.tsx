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
import { useState } from 'react';

export interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  productName: string;
  productImage: string;
  orderId: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  createdAt: string;
  isVerifiedPurchase: boolean;
  shopReply?: {
    content: string;
    createdAt: string;
  };
  helpful: number;
  reported: boolean;
}

const mockReviews: Review[] = [
  {
    id: '1',
    customerName: 'Nguyễn Văn A',
    customerAvatar: '/placeholder.svg?height=40&width=40',
    productName: 'Áo thun nam cotton cao cấp',
    productImage: '/placeholder.svg?height=60&width=60',
    orderId: 'ORD-2024-001',
    rating: 5,
    title: 'Sản phẩm rất tốt, chất lượng vượt mong đợi',
    content:
      'Áo thun chất liệu cotton rất mềm mại, thoáng mát. Size vừa vặn, màu sắc đẹp như hình. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop tiếp.',
    images: ['/placeholder.svg?height=100&width=100', '/placeholder.svg?height=100&width=100'],
    createdAt: '2024-01-15T10:30:00Z',
    isVerifiedPurchase: true,
    helpful: 12,
    reported: false,
  },
  {
    id: '2',
    customerName: 'Trần Thị B',
    customerAvatar: '/placeholder.svg?height=40&width=40',
    productName: 'Quần jeans nữ slim fit',
    productImage: '/placeholder.svg?height=60&width=60',
    orderId: 'ORD-2024-002',
    rating: 4,
    title: 'Quần đẹp nhưng hơi chật',
    content:
      'Quần jeans chất lượng tốt, form dáng đẹp. Tuy nhiên size hơi nhỏ so với bảng size, nên mua lên 1 size. Màu xanh đậm rất đẹp.',
    createdAt: '2024-01-14T14:20:00Z',
    isVerifiedPurchase: true,
    shopReply: {
      content:
        'Cảm ơn bạn đã đánh giá! Shop sẽ cập nhật bảng size chi tiết hơn để khách hàng dễ chọn size phù hợp. Lần sau bạn có thể inbox shop để được tư vấn size nhé!',
      createdAt: '2024-01-14T16:00:00Z',
    },
    helpful: 8,
    reported: false,
  },
  {
    id: '3',
    customerName: 'Lê Văn C',
    productName: 'Giày sneaker thể thao',
    productImage: '/placeholder.svg?height=60&width=60',
    orderId: 'ORD-2024-003',
    rating: 2,
    title: 'Chất lượng không như mong đợi',
    content:
      'Giày nhận được không giống hình, chất liệu kém hơn mô tả. Đế giày hơi cứng, đi không thoải mái. Giao hàng chậm hơn dự kiến.',
    createdAt: '2024-01-13T09:15:00Z',
    isVerifiedPurchase: true,
    helpful: 3,
    reported: false,
  },
  {
    id: '4',
    customerName: 'Phạm Thị D',
    customerAvatar: '/placeholder.svg?height=40&width=40',
    productName: 'Váy maxi hoa nhí',
    productImage: '/placeholder.svg?height=60&width=60',
    orderId: 'ORD-2024-004',
    rating: 5,
    title: 'Váy đẹp lắm, mình rất thích',
    content:
      'Váy maxi rất xinh, chất vải mềm mại, thoáng mát. Họa tiết hoa nhí dễ thương, phù hợp đi chơi và đi làm. Giá cả hợp lý, sẽ mua thêm màu khác.',
    images: ['/placeholder.svg?height=100&width=100'],
    createdAt: '2024-01-12T16:45:00Z',
    isVerifiedPurchase: true,
    shopReply: {
      content:
        'Cảm ơn bạn rất nhiều! Shop rất vui khi bạn hài lòng với sản phẩm. Hiện tại shop có thêm màu hồng và xanh mint, bạn có thể tham khảo nhé!',
      createdAt: '2024-01-12T18:00:00Z',
    },
    helpful: 15,
    reported: false,
  },
  {
    id: '5',
    customerName: 'Hoàng Văn E',
    productName: 'Áo khoác hoodie unisex',
    productImage: '/placeholder.svg?height=60&width=60',
    orderId: 'ORD-2024-005',
    rating: 3,
    title: 'Tạm ổn, có thể cải thiện',
    content:
      'Áo khoác ấm, thiết kế đơn giản. Tuy nhiên chất liệu hơi thô, không mềm như mong đợi. Khóa kéo hơi cứng.',
    createdAt: '2024-01-11T11:30:00Z',
    isVerifiedPurchase: true,
    helpful: 5,
    reported: false,
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [replyFilter, setReplyFilter] = useState<string>('all');

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    const matchesReply =
      replyFilter === 'all' ||
      (replyFilter === 'replied' && review.shopReply) ||
      (replyFilter === 'not_replied' && !review.shopReply);

    return matchesSearch && matchesRating && matchesReply;
  });

  const handleViewDetail = (review: Review) => {
    setSelectedReview(review);
    setIsDetailOpen(true);
  };

  const handleReply = (review: Review) => {
    setSelectedReview(review);
    setIsReplyOpen(true);
  };

  const handleSubmitReply = (reviewId: string, replyContent: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              shopReply: {
                content: replyContent,
                createdAt: new Date().toISOString(),
              },
            }
          : review,
      ),
    );
    setSelectedReview(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Quản lý đánh giá</h2>
        <p className="text-muted-foreground">Xem và phản hồi đánh giá từ khách hàng</p>
      </div>

      <ReviewStats reviews={reviews} />

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
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Trạng thái phản hồi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="replied">Đã phản hồi</SelectItem>
            <SelectItem value="not_replied">Chưa phản hồi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ReviewTable
        reviews={filteredReviews}
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
