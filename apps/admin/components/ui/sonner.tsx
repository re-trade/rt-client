'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      expand={true}
      position="top-right"
      closeButton={true}
      toastOptions={{
        style: {
          fontSize: '1rem',
          padding: '1rem',
          borderWidth: '2px',
          borderStyle: 'solid',
          background: 'white',
          color: '#333',
          minWidth: '320px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px',
        },
      }}
      style={
        {
          '--normal-bg': '#f0f9ff',
          '--normal-text': '#0369a1',
          '--normal-border': '#7dd3fc',

          '--success-bg': '#ecfdf5',
          '--success-text': '#047857',
          '--success-border': '#6ee7b7',

          '--error-bg': '#fef2f2',
          '--error-text': '#dc2626',
          '--error-border': '#f87171',

          '--warning-bg': '#fffbeb',
          '--warning-text': '#d97706',
          '--warning-border': '#fcd34d',

          '--info-bg': '#eff6ff',
          '--info-text': '#2563eb',
          '--info-border': '#93c5fd',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
