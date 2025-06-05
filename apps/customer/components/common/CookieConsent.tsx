'use client';

import { useEffect, useState } from 'react';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4 z-50 border border-orange-200 animate-in slide-in-from-bottom duration-500">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-orange-500 hover:text-orange-600 w-6 h-6 flex items-center justify-center text-xl font-medium"
      >
        ×
      </button>
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="cookie" className="text-xl">
            🍪
          </span>
          <h3 className="text-orange-600 font-medium">Cookie của chúng tôi</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Chúng tôi sử dụng cookie để mang đến trải nghiệm tốt nhất cho bạn. Bằng cách tiếp tục, bạn
          đồng ý với chính sách của chúng tôi.
        </p>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => setIsVisible(false)}
            className="px-3 py-1.5 text-sm text-orange-600 hover:text-orange-700 transition-colors"
          >
            Để sau
          </button>
          <button
            onClick={handleAccept}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 text-sm rounded-md transition-colors font-medium"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};
