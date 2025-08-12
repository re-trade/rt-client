'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReviewResponse } from '@/service/review.api';
import {
  Calendar,
  CheckCircle,
  Eye,
  Image as ImageIcon,
  MessageSquare,
  Package,
  Star,
  ThumbsUp,
} from 'lucide-react';
import Image from 'next/image';

interface ReviewTableProps {
  reviews: ReviewResponse[];
  onViewDetail: (review: ReviewResponse) => void;
  onReply: (review: ReviewResponse) => void;
}

export function ReviewTable({ reviews, onViewDetail, onReply }: ReviewTableProps) {
  const renderStars = (rating: number) => {
    return (
      <span className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 transition-colors ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </span>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800 border-green-200';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!reviews || reviews.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <div className="text-lg font-medium text-gray-900 mb-2">Chưa có đánh giá nào</div>
          <div className="text-muted-foreground">
            Các đánh giá từ khách hàng sẽ xuất hiện tại đây
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold text-gray-900">Khách hàng</TableHead>
                <TableHead className="font-semibold text-gray-900">Sản phẩm</TableHead>
                <TableHead className="font-semibold text-gray-900">Đánh giá</TableHead>
                <TableHead className="font-semibold text-gray-900">Nội dung</TableHead>
                <TableHead className="font-semibold text-gray-900">Ngày tạo</TableHead>
                <TableHead className="font-semibold text-gray-900">Trạng thái</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(reviews) &&
                reviews.map((review, index) => (
                  <TableRow
                    key={review.id}
                    className={`hover:bg-gray-50/50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'
                    }`}
                  >
                    <TableCell className="py-4">
                      <span className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-gray-100">
                          <AvatarImage src={review.author.avatarUrl || '/placeholder.svg'} />
                          <AvatarFallback className="font-semibold bg-orange-500 text-white">
                            {review.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          <span className="font-semibold text-gray-900 mb-1 block">
                            {review.author.name}
                          </span>
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            {review.isVerifiedPurchase && (
                              <>
                                <CheckCircle className="h-3 w-3 text-orange-600" />
                                <span className="text-orange-600 font-medium">Đã mua hàng</span>
                              </>
                            )}
                            {review.helpful > 0 && (
                              <>
                                <ThumbsUp className="h-3 w-3 text-orange-600" />
                                <span className="text-orange-600">{review.helpful}</span>
                              </>
                            )}
                          </span>
                        </span>
                      </span>
                    </TableCell>

                    <TableCell className="py-4">
                      <span className="flex items-center gap-3">
                        <span className="relative">
                          <Image
                            src={review.product.thumbnailUrl || '/placeholder.svg'}
                            alt={review.product.productName}
                            width={50}
                            height={50}
                            className="rounded-lg object-cover border-2 border-gray-100"
                          />
                        </span>
                        <span className="flex-1">
                          <span className="font-medium text-gray-900 mb-1 block">
                            {truncateText(review.product.productName, 30)}
                          </span>
                          <span className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Package className="h-3 w-3" />
                            <span>#{review.orderId}</span>
                          </span>
                        </span>
                      </span>
                    </TableCell>

                    <TableCell className="py-4">
                      <span className="space-y-2 inline-block">
                        {renderStars(review.vote)}
                        <Badge className={`${getRatingColor(review.vote)} block mt-2`}>
                          {review.vote}/5 sao
                        </Badge>
                      </span>
                    </TableCell>

                    <TableCell className="py-4 max-w-xs">
                      <span className="space-y-2 inline-block">
                        <span className="text-sm text-gray-700 leading-relaxed block">
                          {truncateText(review.content, 80)}
                        </span>
                        {review.imageUrls && review.imageUrls.length > 0 && (
                          <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full mt-2 inline-flex">
                            <ImageIcon className="h-3 w-3" />
                            <span>+{review.imageUrls.length} hình ảnh</span>
                          </span>
                        )}
                      </span>
                    </TableCell>

                    <TableCell className="py-4">
                      <span className="space-y-1 inline-block">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-900 block">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="text-xs text-muted-foreground block">
                          {new Date(review.createdAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </span>
                    </TableCell>

                    <TableCell className="py-4">
                      <span className="space-y-1 inline-block">
                        {review.reply ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Đã phản hồi
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Chưa phản hồi
                          </Badge>
                        )}
                        {review.reply && (
                          <span className="text-xs text-muted-foreground block mt-1">
                            {new Date(review.reply.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </span>
                    </TableCell>

                    <TableCell className="py-4">
                      <span className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetail(review)}
                          className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!review.reply && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onReply(review)}
                            className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-colors"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        )}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
