import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ReviewResponse } from '@/service/review.api';
import { Calendar, CheckCircle, MessageSquare, Package, Star, ThumbsUp } from 'lucide-react';
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
            className={`h-5 w-5 transition-colors ${
              star <= vote ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Chi tiết đánh giá</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xs">👤</AvatarFallback>
                </Avatar>
                Thông tin khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-gray-100">
                  <AvatarImage src={review.author.avatarUrl || '/placeholder.svg'} />
                  <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {review.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-semibold text-lg">{review.author.name}</h3>
                    {review.isVerifiedPurchase && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Đã mua hàng
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>Đơn hàng: #{review.orderId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(review.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Info & Rating */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Thông tin sản phẩm
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Image
                      src={review.product.thumbnailUrl || '/placeholder.svg'}
                      alt={review.product.productName}
                      width={100}
                      height={100}
                      className="rounded-xl object-cover border-2 border-gray-100"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{review.product.productName}</h4>
                    <div className="flex items-center gap-3">
                      {renderStars(review.vote)}
                      <Badge className={getRatingColor(review.vote)}>{review.vote}/5 sao</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5" />
                  Thống kê
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Hữu ích</span>
                    <span className="font-semibold">{review.helpful} người</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Trạng thái</span>
                    <Badge variant={review.reply ? 'default' : 'secondary'}>
                      {review.reply ? 'Đã phản hồi' : 'Chưa phản hồi'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Content */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Nội dung đánh giá
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                  {review.content}
                </p>
              </div>

              {/* Review Images */}
              {review.imageUrls && review.imageUrls.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px bg-gray-200 flex-1" />
                    <span className="text-sm text-muted-foreground px-3">
                      Hình ảnh từ khách hàng ({review.imageUrls.length})
                    </span>
                    <div className="h-px bg-gray-200 flex-1" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {review.imageUrls.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image || '/placeholder.svg'}
                          alt={`Review image ${index + 1}`}
                          width={200}
                          height={200}
                          className="rounded-lg object-cover cursor-pointer transition-transform hover:scale-105 border-2 border-gray-100"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shop Reply */}
          {review.reply && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-semibold text-blue-900 text-lg">
                        Phản hồi từ người bán
                      </span>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {new Date(review.reply.createdAt).toLocaleDateString('vi-VN')}
                      </Badge>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-blue-800 leading-relaxed text-base whitespace-pre-wrap">
                        {review.reply.content}
                      </p>
                    </div>
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
