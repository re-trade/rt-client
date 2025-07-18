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
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 transition-colors ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
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
          <p className="text-lg font-medium text-gray-900 mb-2">Chưa có đánh giá nào</p>
          <p className="text-muted-foreground">Các đánh giá từ khách hàng sẽ xuất hiện tại đây</p>
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
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-gray-100">
                          <AvatarImage src={review.author.avatarUrl || '/placeholder.svg'} />
                          <AvatarFallback className="font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {review.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">
                            {review.author.name}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {review.isVerifiedPurchase && (
                              <>
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span className="text-green-600 font-medium">Đã mua hàng</span>
                              </>
                            )}
                            {review.helpful > 0 && (
                              <>
                                <ThumbsUp className="h-3 w-3 text-blue-600" />
                                <span className="text-blue-600">{review.helpful}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={review.product.thumbnailUrl || '/placeholder.svg'}
                            alt={review.product.productName}
                            width={50}
                            height={50}
                            className="rounded-lg object-cover border-2 border-gray-100"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">
                            {truncateText(review.product.productName, 30)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Package className="h-3 w-3" />
                            <span>#{review.orderId}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="space-y-2">
                        {renderStars(review.vote)}
                        <Badge className={getRatingColor(review.vote)}>{review.vote}/5 sao</Badge>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 max-w-xs">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {truncateText(review.content, 80)}
                        </div>
                        {review.imageUrls && review.imageUrls.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
                            <ImageIcon className="h-3 w-3" />
                            <span>+{review.imageUrls.length} hình ảnh</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="space-y-1">
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
                          <div className="text-xs text-muted-foreground">
                            {new Date(review.reply.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetail(review)}
                          className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!review.reply && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onReply(review)}
                            className="hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-colors"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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
