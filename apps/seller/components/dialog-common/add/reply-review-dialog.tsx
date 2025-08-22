'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReviewResponse } from '@/service/review.api';
import { textModApi } from '@/service/textmod.api';
import { CheckCircle, MessageSquare, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
interface ReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: ReviewResponse | null;
  onSubmitReply: (reviewId: string, replyContent: string) => void;
}

export function ReplyDialog({ open, onOpenChange, review, onSubmitReply }: ReplyDialogProps) {
  const [replyContent, setReplyContent] = useState('');
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (review?.reply) {
      setReplyContent(review.reply.content);
    } else {
      setReplyContent('');
    }

    const fetchSuggestions = async () => {
      if (review) {
        setIsLoadingSuggestions(true);
        try {
          const response = await textModApi.suggestReply({
            review: review.content,
            rating: review.vote,
          });
          setSuggestedReplies(response.data.suggestions);
        } catch (error) {
          console.error('Error fetching reply suggestions:', error);
          setSuggestedReplies(getDefaultSuggestedReplies(review.vote));
        } finally {
          setIsLoadingSuggestions(false);
        }
      }
    };

    fetchSuggestions();
  }, [review]);

  if (!review) return null;

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

  const handleSubmit = () => {
    if (replyContent.trim()) {
      onSubmitReply(review.id, replyContent.trim());
      onOpenChange(false);
    }
  };

  const getDefaultSuggestedReplies = (rating: number) => {
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

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-orange-600" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              {review.reply ? 'Chỉnh sửa phản hồi' : 'Phản hồi đánh giá'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Review Summary */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 ring-3 ring-orange-100 shadow-lg">
                <AvatarImage src={review.author.avatarUrl || '/placeholder.svg'} />
                <AvatarFallback className="bg-orange-500 text-white font-semibold">
                  {review.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-semibold text-gray-900">{review.author.name}</span>
                  {review.isVerifiedPurchase && (
                    <div className="flex items-center gap-1 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700">Đã mua hàng</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  {renderStars(review.vote)}
                  <span className={`text-sm font-medium ${getRatingColor(review.vote)}`}>
                    {review.vote}/5
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getRatingBadge(review.vote)}`}
                  >
                    {review.vote >= 4
                      ? 'Hài lòng'
                      : review.vote >= 3
                        ? 'Bình thường'
                        : 'Không hài lòng'}
                  </span>
                </div>

                <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                    Sản Phẩm
                  </h4>
                  <div className="flex items-center gap-4">
                    <Image
                      src={review.product.thumbnailUrl || '/placeholder.svg'}
                      alt={review.product.productName}
                      width={48}
                      height={48}
                      className="rounded-xl object-cover shadow-md ring-2 ring-orange-100"
                    />
                    <span className="text-sm font-medium text-gray-900 line-clamp-2">
                      {review.product.productName}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                    Nội dung đánh giá
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                    {review.content}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Replies */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <Label className="text-base font-semibold text-gray-900">
                Gợi ý phản hồi thông minh
              </Label>
            </div>
            <div className="grid gap-3">
              {isLoadingSuggestions ? (
                <div className="text-center py-4">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-orange-500 border-r-transparent"></div>
                  <p className="mt-2 text-sm text-gray-600">Đang tạo gợi ý phản hồi...</p>
                </div>
              ) : suggestedReplies.length > 0 ? (
                suggestedReplies.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setReplyContent(suggestion)}
                    className="group w-full text-left p-4 bg-white hover:bg-orange-50 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                        {suggestion}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-center py-4 text-sm text-gray-600">
                  Không có gợi ý phản hồi nào. Vui lòng thử lại sau.
                </p>
              )}
            </div>
          </div>

          {/* Reply Input */}
          <div className="space-y-3">
            <Label htmlFor="reply" className="text-base font-semibold text-gray-900">
              Nội dung phản hồi của bạn
            </Label>
            <div className="relative">
              <Textarea
                id="reply"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Nhập phản hồi của bạn để tương tác với khách hàng..."
                className="min-h-[140px] resize-none border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl shadow-sm"
                maxLength={500}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span
                  className={`text-xs font-medium ${
                    replyContent.length > 450 ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  {replyContent.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              onClick={handleSubmit}
              disabled={!replyContent.trim()}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {review.reply ? 'Cập nhật phản hồi' : 'Gửi phản hồi'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
            >
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
