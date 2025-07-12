'use client';

import { useAuth } from '@/hooks/use-auth';
import { disable2FAInternal, register2FAInternal, verify2FAInternal } from '@/services/2fa.api';
import Image from 'next/image';
import { useState } from 'react';

interface TwoFactorSetupProps {
  onSuccess?: () => void;
}

const TwoFactorSetup = ({ onSuccess }: TwoFactorSetupProps) => {
  const { isAuth, account } = useAuth();
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSetup(false);
    setShowDisable(false);
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

  const handleDisable2FA = async () => {
    if (!disablePassword.trim()) {
      setError('Vui lòng nhập mật khẩu để xác nhận');
      return;
    }

    setIsDisabling(true);
    setError(null);

    try {
      const isSuccess = await disable2FAInternal(disablePassword);

      if (isSuccess) {
        setSuccess(true);
        setTimeout(() => {
          handleSuccess();
        }, 1500);
      } else {
        setError('Mật khẩu không đúng. Vui lòng thử lại.');
      }
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setIsDisabling(false);
    }
  };

  const openSetupModal = () => {
    setShowSetup(true);
    setQrCodeUrl(null);
    setVerificationCode('');
    setError(null);
    setSuccess(false);
    fetchQrCode();
  };

  const openDisableModal = () => {
    setShowDisable(true);
    setDisablePassword('');
    setError(null);
    setSuccess(false);
  };

  if (!account) {
    return null;
  }

  if (account.using2FA) {
    return (
      <div>
        <button
          className="px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-red-100 to-red-200 text-red-700 hover:from-red-200 hover:to-red-300 transition-all duration-300 shadow-sm border border-red-200 hover:shadow-md"
          onClick={openDisableModal}
        >
          Tắt 2FA
        </button>
        {showDisable && (
          <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center animate-in fade-in duration-300 p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-lg w-full relative animate-in slide-in-from-bottom-4 fade-in duration-300 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-gray-200 p-3 sm:p-4 sticky top-0 bg-white rounded-t-xl">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 pr-2">
                  Tắt xác thực hai yếu tố
                </h3>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                    <span className="hidden sm:inline">Đang tắt</span>
                  </span>
                  <button
                    className="text-gray-400 hover:text-gray-500 p-1"
                    onClick={() => setShowDisable(false)}
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
              </div>

              <div className="p-3 sm:p-6">
                {success ? (
                  <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-green-50 rounded-lg border border-green-100">
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
                    <h3 className="text-base sm:text-lg font-medium text-gray-800 text-center">
                      2FA đã được tắt!
                    </h3>
                    <p className="text-center text-gray-600 text-sm sm:text-base">
                      Xác thực hai yếu tố đã được tắt thành công. Tài khoản của bạn sẽ chỉ yêu cầu
                      mật khẩu khi đăng nhập.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-[#FEE2E2] to-[#FECACA] border border-[#FCA5A5] p-3 sm:p-4 rounded-md mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="text-[#DC2626] shrink-0 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
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
                      <div className="text-xs sm:text-sm text-gray-700">
                        <strong className="text-red-700 font-medium">Cảnh báo:</strong> Tắt xác thực
                        hai yếu tố sẽ làm giảm bảo mật tài khoản của bạn. Hãy chắc chắn rằng bạn
                        muốn thực hiện hành động này.
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm mb-3 sm:mb-4">
                        {error}
                      </div>
                    )}

                    <div className="mb-3 sm:mb-4">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Nhập mật khẩu để xác nhận
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="Mật khẩu của bạn"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm transition-all duration-300 hover:border-red-300 text-sm sm:text-base"
                          value={disablePassword}
                          onChange={(e) => setDisablePassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 border border-gray-200 order-2 sm:order-1"
                        onClick={() => setShowDisable(false)}
                      >
                        Hủy
                      </button>
                      <button
                        className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-sm hover:shadow-md order-1 sm:order-2"
                        onClick={handleDisable2FA}
                        disabled={isDisabling || !disablePassword.trim()}
                      >
                        {isDisabling ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white"
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
                            <span className="text-xs sm:text-sm">Đang tắt...</span>
                          </>
                        ) : (
                          'Tắt 2FA'
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {showSetup ? (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center animate-in fade-in duration-300 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-lg w-full relative animate-in slide-in-from-bottom-4 fade-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 p-3 sm:p-4 sticky top-0 bg-white rounded-t-xl">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 pr-2">
                Xác thực hai yếu tố
              </h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm text-blue-600 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="hidden sm:inline">Chưa kích hoạt</span>
                </span>
                <button
                  className="text-gray-400 hover:text-gray-500 p-1"
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
            </div>

            <div className="p-3 sm:p-6">
              {success ? (
                <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-green-50 rounded-lg border border-green-100">
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
                  <h3 className="text-base sm:text-lg font-medium text-gray-800 text-center">
                    2FA thiết lập thành công!
                  </h3>
                  <p className="text-center text-gray-600 text-sm sm:text-base">
                    Từ bây giờ, bạn sẽ cần nhập mã từ ứng dụng xác thực mỗi khi đăng nhập.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-[#FFF8E6] to-[#FFF4D6] border border-[#FFE9AF] p-3 sm:p-4 rounded-md mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="text-[#FF9500] shrink-0 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5"
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
                    <div className="text-xs sm:text-sm text-gray-700">
                      Bạn{' '}
                      <span className="text-blue-600 font-medium">
                        chưa bật xác thực hai yếu tố
                      </span>
                      . Điều này giúp bảo vệ tài khoản của bạn khỏi những truy cập trái phép.
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm mb-3 sm:mb-4">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col items-center mb-4 sm:mb-6">
                    {qrCodeUrl ? (
                      <Image
                        src={qrCodeUrl}
                        alt="QR Code 2FA"
                        width={160}
                        height={160}
                        priority
                        className="border border-gray-200 rounded p-2 shadow-md w-40 h-40 sm:w-[200px] sm:h-[200px]"
                      />
                    ) : (
                      <div className="h-40 w-40 sm:h-[200px] sm:w-[200px] flex items-center justify-center animate-pulse">
                        <svg
                          className="animate-spin h-8 w-8 sm:h-10 sm:w-10 text-amber-400"
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

                  <div className="mb-3 sm:mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nhập mã 6 chữ số"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm transition-all duration-300 hover:border-amber-300 text-sm sm:text-base text-center sm:text-left"
                        value={verificationCode}
                        onChange={(e) =>
                          setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))
                        }
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <button
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm font-medium bg-gradient-to-r from-[#FFECBC] to-[#FFE7A8] text-[#976100] hover:from-[#FFE7A8] hover:to-[#FFD280] transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-sm border border-amber-200 hover:shadow-md"
                    onClick={handleVerifyCode}
                    disabled={isVerifying || verificationCode.length !== 6}
                  >
                    {isVerifying ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-[#976100] opacity-80"
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
                        <span className="text-xs sm:text-sm">Đang xác thực...</span>
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
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium bg-gradient-to-r from-[#FFECBC] to-[#FFE7A8] text-[#976100] hover:from-[#FFE7A8] hover:to-[#FFD280] transition-all duration-300 shadow-sm border border-amber-200 hover:shadow-md"
          onClick={openSetupModal}
        >
          Kích hoạt
        </button>
      )}
    </div>
  );
};

export default TwoFactorSetup;
