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
import { CheckCircle, Eye, MessageSquare, Star } from 'lucide-react';
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
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

    if (!reviews) {
    return <p className="text-muted-foreground">Không có đánh giá...</p>;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(reviews) &&
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.author.avatarUrl || '/placeholder.svg'} />
                        <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.author.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          {review.isVerifiedPurchase && (
                            <>
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span>Đã mua hàng</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={review.product.thumbnailUrl || '/placeholder.svg'}
                        alt={review.product.productName}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                      <div>
                        <div className="font-medium text-sm">
                          {truncateText(review.product.productName, 30)}
                        </div>
                        <div className="text-xs text-muted-foreground">#{review.orderId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {renderStars(review.vote)}
                      <Badge className={getRatingColor(review.vote)}>{review.vote} sao</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div>
                      {/* <div className="font-medium text-sm">{truncateText(review.title, 40)}</div> */}
                      <div className="text-sm text-muted-foreground">
                        {truncateText(review.content, 60)}
                      </div>
                      {review.imageUrls && review.imageUrls.length > 0 && (
                        <div className="text-xs text-blue-600 mt-1">
                          +{review.imageUrls.length} hình ảnh
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {review.reply ? (
                        <Badge className="bg-green-100 text-green-800">Đã phản hồi</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">Chưa phản hồi</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => onViewDetail(review)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!review.reply && (
                        <Button variant="outline" size="sm" onClick={() => onReply(review)}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
