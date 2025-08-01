'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { MdCheck, MdContentCopy, MdFacebook, MdShare } from 'react-icons/md';

interface ShareButtonProps {
  productName: string;
  productDescription?: string;
  productImage?: string;
  url?: string;
}

export default function ShareButton({
  productName,
  productDescription,
  productImage,
  url,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shareOnFacebook = () => {
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(productName);
    const encodedDescription = encodeURIComponent(productDescription || '');

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle} - ${encodedDescription}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const shareOnInstagram = () => {
    const text = `${productName} - ${productDescription || ''}\n\n${currentUrl}`;
    const encodedText = encodeURIComponent(text);

    if (navigator.share) {
      navigator
        .share({
          title: productName,
          text: productDescription,
          url: currentUrl,
        })
        .catch(() => {
          copyToClipboard();
        });
    } else {
      const instagramUrl = `https://www.instagram.com/`;
      window.open(instagramUrl, '_blank');
      copyToClipboard();
    }
    setIsOpen(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full border border-orange-200 hover:bg-orange-50 transition-colors hover:scale-105 group"
        title="Chia sẻ sản phẩm"
      >
        <MdShare size={20} className="text-orange-600 group-hover:text-orange-700" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-orange-100 py-2 min-w-[200px] z-50"
          >
            <div className="px-4 py-2 border-b border-orange-100">
              <p className="text-sm font-semibold text-gray-800">Chia sẻ sản phẩm</p>
            </div>

            <button
              onClick={shareOnFacebook}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3"
            >
              <MdFacebook size={20} className="text-blue-600" />
              <span className="text-gray-700">Chia sẻ lên Facebook</span>
            </button>

            <button
              onClick={shareOnInstagram}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3"
            >
              <div className="w-5 h-5 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">IG</span>
              </div>
              <span className="text-gray-700">Chia sẻ lên Instagram</span>
            </button>

            <button
              onClick={copyToClipboard}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3"
            >
              {copied ? (
                <>
                  <MdCheck size={20} className="text-green-600" />
                  <span className="text-green-600">Đã sao chép!</span>
                </>
              ) : (
                <>
                  <MdContentCopy size={20} className="text-gray-600" />
                  <span className="text-gray-700">Sao chép liên kết</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full right-0 mt-1 bg-green-500 text-white px-3 py-1 rounded-lg text-sm shadow-lg"
        >
          Đã sao chép liên kết!
        </motion.div>
      )}
    </div>
  );
}
