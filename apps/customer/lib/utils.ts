import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString('vi-VN')} VND`;
};

export const formatCurrencyAbbreviated = (amount: number): string => {
  if (amount >= 1000000000) {
    const value = (amount / 1000000000).toFixed(1);
    return `${value.endsWith('.0') ? value.slice(0, -2) : value}B VND`;
  }
  if (amount >= 1000000) {
    const value = (amount / 1000000).toFixed(1);
    return `${value.endsWith('.0') ? value.slice(0, -2) : value}M VND`;
  }
  if (amount >= 1000) {
    const value = (amount / 1000).toFixed(1);
    return `${value.endsWith('.0') ? value.slice(0, -2) : value}K VND`;
  }
  return `${amount.toLocaleString('vi-VN')} VND`;
};

export const formatCurrencyFull = (amount: number): string => {
  return `${amount.toLocaleString('vi-VN')} VND`;
};
