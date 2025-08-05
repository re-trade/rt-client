'use client';

import { fileApi } from '@/services/file.api';
import { CreateReview, ProductNoReview, reviewApi } from '@/services/product-review.api';
import { Send, Star, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ReviewFormProps {
  product: ProductNoReview;
  onSubmit: (reviewData: { rating: number; comment: string; images: string[] }) => void;
  onCancel: () => void;
}

export default function ReviewForm({ product, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createReview, setCreateReview] = useState<CreateReview>({
    orderId: product.orderId,
    content: '',
    vote: 1,
    productId: product.product.id,
    imageReview: [],
  });

  // Đồng bộ createReview với rating, comment, images
  useEffect(() => {
    setCreateReview((prev) => ({
      ...prev,
      content: comment,
      vote: rating,
      imageReview: images,
    }));
  }, [comment, rating, images]);
  const handleChooseFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).slice(0, 5 - selectedFiles.length); // Giới hạn 5 ảnh

    setSelectedFiles((prev) => [...prev, ...fileList]);

    const previewUrls = fileList.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...previewUrls]);

    e.target.value = ''; // Cho phép chọn lại cùng file
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Vui lòng chọn số sao');
      return;
    }
    if (comment.trim().length < 10) {
      alert('Vui lòng viết đánh giá ít nhất 10 ký tự');
      return;
    }

    setIsSubmitting(true);
    try {
      let reviewImageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        const res = await fileApi.fileBulkUpload(selectedFiles);
        reviewImageUrls = res.content;
      }
      const request: CreateReview = {
        orderId: product.orderComboId || '',
        content: comment.trim(),
        vote: rating,
        imageReview: reviewImageUrls,
        productId: product.product.id,
      };
      console.log('data send create review', request);
      await reviewApi.createReview(request);
      await onSubmit({
        rating,
        comment: comment.trim(),
        images,
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Gửi đánh giá thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return 'Rất không hài lòng';
      case 2:
        return 'Không hài lòng';
      case 3:
        return 'Bình thường';
      case 4:
        return 'Hài lòng';
      case 5:
        return 'Rất hài lòng';
      default:
        return 'Chọn đánh giá';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mt-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Viết đánh giá</h4>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá của bạn *</label>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {getRatingText(hoveredRating || rating)}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét của bạn *</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 resize-none"
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            maxLength={500}
            required
          />
          <div className="text-right text-xs text-gray-500 mt-1">{comment.length}/500</div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình ảnh (Tùy chọn)
          </label>
          <div className="space-y-3">
            {/* Upload Button */}
            <div className="flex items-center">
              <label
                className={`cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg px-4 py-2 hover:border-orange-300 transition-colors flex items-center space-x-2 ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {isUploading ? 'Đang tải...' : 'Thêm hình ảnh'}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleChooseFiles}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              <span className="text-xs text-gray-500 ml-3">Tối đa 5 hình ảnh</span>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={rating === 0 || comment.trim() === '' || isSubmitting || isUploading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
