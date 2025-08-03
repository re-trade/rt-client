'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';
import { MdArrowBack, MdArrowForward, MdClose } from 'react-icons/md';

interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onIndexChange: (index: number) => void;
  productName: string;
}

export default function ImageGallery({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  onIndexChange,
  productName,
}: ImageGalleryProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-3 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors shadow-lg"
            aria-label="Đóng gallery"
          >
            <MdClose size={24} className="text-white" />
          </button>

          <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            {currentIndex + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={onPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-4 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentIndex === 0}
                aria-label="Ảnh trước"
              >
                <MdArrowBack size={28} className="text-white" />
              </button>

              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-4 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentIndex === images.length - 1}
                aria-label="Ảnh tiếp theo"
              >
                <MdArrowForward size={28} className="text-white" />
              </button>
            </>
          )}

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full max-w-5xl max-h-[90vh] mx-4"
          >
            <Image
              src={images[currentIndex] || '/image_login.jpg'}
              alt={`${productName} - Ảnh ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
            />
          </motion.div>

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 px-4 py-2 rounded-full">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => onIndexChange(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-orange-500 scale-125 shadow-lg'
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`Chuyển đến ảnh ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
