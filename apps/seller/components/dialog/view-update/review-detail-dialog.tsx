import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReviewResponse } from '@/service/review.api';
import { CheckCircle, MessageSquare, Star, ThumbsUp } from 'lucide-react';
import Image from 'next/image';

interface ReviewDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: ReviewResponse | null;
}

export function ReviewDetailDialog({ open, onOpenChange, review }: ReviewDetailDialogProps) {
  if (!review) return null;

  const renderStars = (vote: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${star <= vote ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đánh giá</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={review.author.avatarUrl || '/placeholder.svg'} />
                  <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{review.author.name}</h3>
                    {review.isVerifiedPurchase && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Đã mua hàng
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Đơn hàng: #{review.orderId}</span>
                    <span>{new Date(review.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Image
                  src={review.product.thumbnailUrl || '/placeholder.svg'}
                  alt={review.product.productName}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-medium">{review.product.productName}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    {renderStars(review.vote)}
                    <span className="text-sm text-muted-foreground">({review.vote}/5)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Content */}
          <Card>
            <CardContent className="p-4">
              {/* <h4 className="font-semibold text-lg mb-3">{review.title}</h4> */}
              <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>

              {/* Review Images */}
              {review.imageUrls && review.imageUrls.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium">Hình ảnh từ khách hàng:</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {review.imageUrls.map((image, index) => (
                      <Image
                        key={index}
                        src={image || '/placeholder.svg'}
                        alt={`Review image ${index + 1}`}
                        width={150}
                        height={150}
                        className="rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Review Stats */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{review.helpful} người thấy hữu ích</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shop Reply */}
          {review.reply && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-blue-900">Phản hồi từ Shop</span>
                      <span className="text-sm text-blue-600">
                        {new Date(review.reply.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-blue-800">{review.reply.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
