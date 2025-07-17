import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TProduct, productApi } from '@/service/product.api';
import { ReviewResponse } from '@/service/review.api';
import { snipppetCode } from '@/service/snippetCode';
import {
  Calendar,
  CheckCircle,
  Eye,
  MessageCircle,
  MessageSquare,
  Package,
  Star,
  ThumbsUp,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ProductDetailsDialog } from './view-detail-product';

interface ReviewDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: ReviewResponse | null;
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function ReviewDetailDialog({ open, onOpenChange, review }: ReviewDetailDialogProps) {
  useEffect(() => {
    // Nếu review không hợp lệ thì tự động đóng dialog
    if (!review || !review.product || !review.author) {
      onOpenChange(false);
    }
  }, [review, onOpenChange]);

  // Không render nếu thiếu dữ liệu
  if (!review || !review.product || !review.author) {
    return null;
  }

  const renderStars = (vote: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 transition-colors ${star <= vote ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const [productDetails, setProductDetails] = useState<TProduct | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDetailsProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      const response = await productApi.getProduct(productId);
      console.log('ahahhhaa', response);
      setProductDetails(response as TProduct);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingColor = (vote: number) => {
    if (vote >= 4) return 'bg-green-100 text-green-800 border-green-200';
    if (vote >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto sm:p-6 p-4">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Chi tiết đánh giá
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant={review.reply ? 'default' : 'secondary'}
                className={`${
                  review.reply
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                {review.reply ? (
                  <>
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Đã phản hồi
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3 mr-1" />
                    Chưa phản hồi
                  </>
                )}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="shadow-sm border-l-4 border-l-blue-500">
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
                      <span>Đơn hàng: {snipppetCode.cutCode(review.orderId)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Info */}
          <Card className="shadow-sm border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Thông tin sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 relative">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Image
                    src={review.product.thumbnailUrl || '/placeholder.svg'}
                    alt={`Hình ảnh sản phẩm ${review.product.productName}`}
                    width={100}
                    height={100}
                    className="rounded-xl object-cover border-2 border-gray-100"
                    loading="lazy"
                    onError={() => console.warn('Failed to load product thumbnail')}
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
              <div className="absolute bottom-4 right-4">
                <Button
                  onClick={() => handleDetailsProduct(review.product.productId)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-50 text-black to-indigo-50 px-4 py-2 rounded-full border border-blue-200 shadow-sm"
                  aria-label={`Xem chi tiết sản phẩm ${review.product.productName}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>Loading...</span>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 text-sm font-medium text-blue-700" />
                      Xem chi tiết
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Review Content */}
          <Card className="shadow-sm border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Nội dung đánh giá
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 relative">
              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                  {review.content}
                </p>
              </div>

              {/* Review Images */}
              {review.imageUrls && review.imageUrls.length > 0 && (
                <div className="space-y-4 mb-6">
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
                          alt={`Hình ảnh đánh giá sản phẩm ${review.product.productName} ${index + 1}`}
                          width={200}
                          height={200}
                          className="rounded-lg object-cover cursor-pointer transition-transform hover:scale-105 border-2 border-gray-100"
                          loading="lazy"
                          onError={() => console.warn(`Failed to load image ${index + 1}`)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 right-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full border border-blue-200 shadow-sm">
                  <ThumbsUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-black">{review.helpful} hữu ích</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shop Reply */}
          {review.reply && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm border-l-4 border-l-indigo-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-semibold text-blue-900 text-lg">
                        Phản hồi từ người bán
                      </span>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(review.reply.createdAt)}
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
      <ProductDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        product={productDetails}
      />
    </Dialog>
  );
}
