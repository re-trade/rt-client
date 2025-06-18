'use client';

import { useAuth } from '@/hooks/use-auth';
import { register2FAInternal, verify2FAInternal } from '@/services/2fa.api';
import Image from 'next/image';
import { useState } from 'react';

interface TwoFactorSetupProps {
  onSuccess?: () => void;
}

const TwoFactorSetup = ({ onSuccess }: TwoFactorSetupProps) => {
  const { isAuth, account } = useAuth();
  const [showSetup, setShowSetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSetup(false);
    if (onSuccess) {
      onSuccess();
    }
    isAuth();
  };

  const fetchQrCode = async () => {
    try {
      const blob = await register2FAInternal();
      const url = URL.createObjectURL(blob);
      setQrCodeUrl(url);
    } catch {
      setError('Không thể tải mã QR. Vui lòng thử lại sau.');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setError('Vui lòng nhập mã xác thực 6 chữ số');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const isSuccess = await verify2FAInternal(verificationCode);

      if (isSuccess) {
        setSuccess(true);
        setTimeout(() => {
          handleSuccess();
        }, 1500);
      } else {
        setError('Mã xác thực không đúng. Vui lòng thử lại.');
      }
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setIsVerifying(false);
    }
  };

  const openModal = () => {
    setShowSetup(true);
    setQrCodeUrl(null);
    setVerificationCode('');
    setError(null);
    setSuccess(false);
    fetchQrCode();
  };

  if (!account) {
    return null;
  }
  if (account.using2FA) {
    return (
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 gap-1 shadow-sm border border-green-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-4 h-4 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          2FA đã bật
        </div>
      </div>
    );
  }

  return (
    <div>
      {showSetup ? (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-lg w-full mx-4 relative animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h3 className="text-lg font-bold text-gray-900">Xác thực hai yếu tố</h3>
              <span className="text-sm text-blue-600 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                Chưa kích hoạt
              </span>
              <button
                className="ml-auto text-gray-400 hover:text-gray-500"
                onClick={() => setShowSetup(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {success ? (
                <div className="flex flex-col items-center gap-4 p-6 bg-green-50 rounded-lg border border-green-100">
                  <div className="p-2 bg-green-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">2FA thiết lập thành công!</h3>
                  <p className="text-center text-gray-600">
                    Từ bây giờ, bạn sẽ cần nhập mã từ ứng dụng xác thực mỗi khi đăng nhập.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-[#FFF8E6] to-[#FFF4D6] border border-[#FFE9AF] p-4 rounded-md mb-6 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="text-[#FF9500] shrink-0 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-700">
                      Bạn{' '}
                      <span className="text-blue-600 font-medium">
                        chưa bật xác thực hai yếu tố
                      </span>
                      . Điều này giúp bảo vệ tài khoản của bạn khỏi những truy cập trái phép.
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col items-center mb-6">
                    {qrCodeUrl ? (
                      <Image
                        src={qrCodeUrl}
                        alt="QR Code 2FA"
                        width={200}
                        height={200}
                        priority
                        className="border border-gray-200 rounded p-2 shadow-md"
                      />
                    ) : (
                      <div className="h-[200px] w-[200px] flex items-center justify-center animate-pulse">
                        <svg
                          className="animate-spin h-10 w-10 text-amber-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nhập mã 6 chữ số"
                        className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm transition-all duration-300 hover:border-amber-300"
                        value={verificationCode}
                        onChange={(e) =>
                          setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))
                        }
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <button
                    className="w-full px-4 py-3 rounded-md text-sm font-medium bg-gradient-to-r from-[#FFECBC] to-[#FFE7A8] text-[#976100] hover:from-[#FFE7A8] hover:to-[#FFD280] transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-sm border border-amber-200 hover:shadow-md"
                    onClick={handleVerifyCode}
                    disabled={isVerifying || verificationCode.length !== 6}
                  >
                    {isVerifying ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#976100] opacity-80"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang xác thực...
                      </>
                    ) : (
                      'Bật xác thực hai yếu tố'
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button
          className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-[#FFECBC] to-[#FFE7A8] text-[#976100] hover:from-[#FFE7A8] hover:to-[#FFD280] transition-all duration-300 shadow-sm border border-amber-200 hover:shadow-md"
          onClick={openModal}
        >
          Kích hoạt
        </button>
      )}
    </div>
  );
};

export default TwoFactorSetup;
