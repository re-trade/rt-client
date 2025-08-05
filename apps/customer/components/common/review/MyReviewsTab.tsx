'use client';

import { ReviewResponse } from '@/services/product-review.api';
import { Star, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import ImageGallery from '@components/gallery/ImageGallery';

interface MyReviewsTabProps {
  reviews: ReviewResponse[];
  formatDate: (date: string) => string;
}

export function MyReviewsTab({ reviews, formatDate }: MyReviewsTabProps) {

    const [showGallery, setShowGallery] = useState(false);
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [galleryIndex, setGalleryIndex] = useState(0);
  const openGallery = (images: string[], index: number) => {
    setGalleryImages(images);
    setGalleryIndex(index);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  const nextImage = () => {
    setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleGalleryIndexChange = (index: number) => {
    setGalleryIndex(index);
  };


  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Chưa có đánh giá nào</h3>
        <p className="text-gray-500">Bạn chưa đánh giá sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border border-gray-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <img
              src={review.product.thumbnailUrl || '/placeholder-image.png'}
              alt={review.product.productName}
              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">{review.product.productName}</h3>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.vote ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span>{formatDate(review.createdAt)}</span>
                <span>Mã đơn: {review.orderId}</span>
              </div>

              <p className="text-gray-700 mb-4">Nội dung: {review.content}</p>

              {Array.isArray(review.images) && review.images.length > 0 &&  (
                <div className="flex space-x-2 mb-4">
                 {review.images.map((url, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer"
                        onClick={() => openGallery(review.images, index)}
                      >
                        <img
                          src={url}
                          alt={`Hình đánh giá ${index + 1}`}
                          className="w-20 h-20 rounded-lg object-cover border border-orange-100 group-hover:border-orange-300 transition-all duration-200 group-hover:scale-105 shadow-sm"
                        />
                        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200" /> */}
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white px-1 py-0.5 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          {index + 1}/{review.images.length}
                        </div>
                      </div>
                    ))}
                </div>
              )}
                    <ImageGallery
                      images={galleryImages}
                      currentIndex={galleryIndex}
                      isOpen={showGallery}
                      onClose={closeGallery}
                      onNext={nextImage}
                      onPrevious={prevImage}
                      onIndexChange={handleGalleryIndexChange}
                      productName="Hình ảnh đánh giá"
                    />

              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ThumbsUp className="w-4 h-4" />
                <span>{review.helpful} người thấy hữu ích</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
