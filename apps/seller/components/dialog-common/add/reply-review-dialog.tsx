'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReviewResponse } from '@/service/review.api';
import { CheckCircle, Star } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: ReviewResponse | null;
  onSubmitReply: (reviewId: string, replyContent: string) => void;
}

export function ReplyDialog({ open, onOpenChange, review, onSubmitReply }: ReplyDialogProps) {
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    if (review?.reply) {
      setReplyContent(review.reply.content);
    } else {
      setReplyContent('');
    }
  }, [review]);

  if (!review) return null;

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

  const handleSubmit = () => {
    if (replyContent.trim()) {
      onSubmitReply(review.id, replyContent.trim());
      onOpenChange(false);
    }
  };

  const getSuggestedReplies = (rating: number) => {
    if (rating >= 4) {
      return [
        'Cảm ơn bạn đã đánh giá tích cực! Shop rất vui khi bạn hài lòng với sản phẩm.',
        'Cảm ơn bạn đã ủng hộ seller! Hy vọng sẽ được phục vụ bạn trong những lần mua sắm tiếp theo.',
        'Shop rất cảm kích sự tin tưởng của bạn. Chúc bạn sử dụng sản phẩm vui vẻ!',
      ];
    } else if (rating >= 3) {
      return [
        'Cảm ơn bạn đã đánh giá! Shop sẽ cố gắng cải thiện chất lượng sản phẩm và dịch vụ.',
        'Shop ghi nhận ý kiến của bạn và sẽ khắc phục những điểm chưa tốt. Cảm ơn bạn!',
        'Cảm ơn phản hồi của bạn. Shop sẽ nỗ lực hơn để mang đến trải nghiệm tốt hơn.',
      ];
    } else {
      return [
        'Shop rất xin lỗi vì trải nghiệm chưa tốt. Vui lòng liên hệ seller để được hỗ trợ giải quyết.',
        'Shop chân thành xin lỗi và sẽ khắc phục vấn đề này. Vui lòng inbox để seller hỗ trợ bạn.',
        'Cảm ơn phản hồi của bạn. Shop sẽ cải thiện và bồi thường thỏa đáng cho bạn.',
      ];
    }
  };

  const suggestedReplies = getSuggestedReplies(review.vote);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{review.reply ? 'Chỉnh sửa phản hồi' : 'Phản hồi đánh giá'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Review Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.author.avatarUrl || '/placeholder.svg'} />
                <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{review.author.name}</span>
                  {review.isVerifiedPurchase && <CheckCircle className="h-4 w-4 text-green-600" />}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(review.vote)}
                  <span className="text-sm text-muted-foreground">({review.vote}/5)</span>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <Image
                    src={review.product.thumbnailUrl || '/placeholder.svg'}
                    alt={review.product.productName}
                    width={40}
                    height={40}
                    className="rounded object-cover"
                  />
                  <span className="text-sm font-medium">{review.product.productName}</span>
                </div>
                <h4 className="font-medium mb-1">Nội dung</h4>
                <p className="text-sm text-muted-foreground">{review.content}</p>
              </div>
            </div>
          </div>

          {/* Suggested Replies */}
          <div>
            <Label className="text-sm font-medium">Gợi ý phản hồi:</Label>
            <div className="mt-2 space-y-2">
              {suggestedReplies.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setReplyContent(suggestion)}
                  className="w-full text-left p-3 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Reply Input */}
          <div>
            <Label htmlFor="reply">Nội dung phản hồi</Label>
            <Textarea
              id="reply"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Nhập phản hồi của bạn..."
              className="mt-2 min-h-[120px]"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {replyContent.length}/500 ký tự
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} disabled={!replyContent.trim()} className="flex-1">
              {review.reply ? 'Cập nhật phản hồi' : 'Gửi phản hồi'}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
