'use client';

import ColorThief from 'colorthief';
import { useEffect, useState } from 'react';

export function useBankGradient(imageUrl: string, bankCode: string) {
  const [gradient, setGradient] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    const cached = localStorage.getItem(`bank-gradient-${bankCode}`);
    if (cached) {
      setGradient(cached);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const thief = new ColorThief();
        const [r, g, b] = thief.getColor(img);
        const darker = [r - 30, g - 30, b - 30].map((v) => Math.max(0, v));
        const cssGradient = `linear-gradient(to right, rgb(${r},${g},${b}), rgb(${darker.join(',')}))`;
        localStorage.setItem(`bank-gradient-${bankCode}`, cssGradient);
        setGradient(cssGradient);
      } catch (err) {
        console.error('ColorThief error:', err);
      }
    };
  }, [imageUrl, bankCode]);

  return gradient;
}
