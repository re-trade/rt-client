'use client';

import { register2FAInternal } from '@/services/2fa.api';
import { useEffect, useState } from 'react';

const TwoFactor = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const blob = await register2FAInternal();
        console.log(blob);
        const url = URL.createObjectURL(blob);
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Lỗi khi lấy QR code:', error);
      }
    };

    fetchQrCode();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold">Xác thực hai yếu tố (2FA)</h2>
      <p>Quét mã QR bằng ứng dụng Google Authenticator hoặc Authy.</p>
      {qrCodeUrl ? (
        <img
          src={qrCodeUrl}
          alt="QR Code 2FA"
          className="w-60 h-60 border rounded-md"
          width={240}
          height={240}
        />
      ) : (
        <p>Đang tải mã QR...</p>
      )}
    </div>
  );
};

export default TwoFactor;
