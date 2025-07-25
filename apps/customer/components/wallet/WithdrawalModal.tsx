import BankAccountSelectionModal from '@/components/wallet/BankAccountSelectionModal';
import { BankAccountResponse, BankResponse, getBankByBin } from '@services/payment-method.api';
import { FormEvent, useEffect, useState } from 'react';

interface WithdrawalModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  withdrawContent: string;
  setWithdrawContent: (content: string) => void;
  selectedBankAccount: BankAccountResponse | null;
  setSelectedBankAccount: (account: BankAccountResponse) => void;
  bankAccountModalOpen: boolean;
  setBankAccountModalOpen: (open: boolean) => void;
  userBankAccounts: BankAccountResponse[];
  loadingBankAccounts: boolean;
  balance: number;
  processingWithdrawal: boolean;
  onSubmit: () => Promise<boolean>;
  formatCurrency: (amount: number) => string;
}

const WithdrawalModal = ({
  isModalOpen,
  setIsModalOpen,
  withdrawAmount,
  setWithdrawAmount,
  withdrawContent,
  setWithdrawContent,
  selectedBankAccount,
  setSelectedBankAccount,
  bankAccountModalOpen,
  setBankAccountModalOpen,
  userBankAccounts,
  loadingBankAccounts,
  balance,
  processingWithdrawal,
  onSubmit,
  formatCurrency,
}: WithdrawalModalProps) => {
  const [selectedBankInfo, setSelectedBankInfo] = useState<BankResponse | null>(null);

  // Fetch bank information when selectedBankAccount changes
  useEffect(() => {
    const fetchBankInfo = async () => {
      if (selectedBankAccount?.bankBin) {
        try {
          const bankInfo = await getBankByBin(selectedBankAccount.bankBin);
          setSelectedBankInfo(bankInfo || null);
        } catch (error) {
          console.error('Error fetching bank info:', error);
          setSelectedBankInfo(null);
        }
      } else {
        setSelectedBankInfo(null);
      }
    };

    fetchBankInfo();
  }, [selectedBankAccount]);

  const handleWithdrawalSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!selectedBankAccount || !withdrawAmount || !withdrawContent) {
      return;
    }

    // Validate amount
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > balance) {
      return;
    }

    const success = await onSubmit();
    if (success) {
      setIsModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setWithdrawAmount('');
    setWithdrawContent('');
    setSelectedBankAccount(null);
  };

  return (
    <>
      <dialog id="withdraw_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="bg-white text-[#121212] rounded-xl shadow-xl w-11/12 max-w-3xl p-0 overflow-hidden">
          <div className="bg-[#FFD2B2] px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-[#121212]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <h3 className="text-xl font-bold text-[#121212]">Rút tiền từ ví</h3>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-[#121212] hover:bg-white/40 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleWithdrawalSubmit} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="withdrawAmount"
                className="block text-sm font-semibold text-[#121212] mb-1"
              >
                Số tiền rút
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="withdrawAmount"
                  name="withdrawAmount"
                  min="50000"
                  max={balance}
                  step="10000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="input w-full px-4 py-2.5 border border-[#525252]/20 text-[#121212] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all pr-16"
                  placeholder="Nhập số tiền cần rút"
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-medium text-[#525252] bg-[#FFD2B2] px-2 py-1 rounded">
                  VND
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <p className="text-[#525252]">
                  Số dư hiện tại:{' '}
                  <span className="font-semibold text-[#121212]">{formatCurrency(balance)}</span>
                </p>
                <p className="text-[#525252] font-medium">Tối đa: {formatCurrency(balance)}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#121212] mb-1">
                Tài khoản ngân hàng
              </label>
              <button
                type="button"
                onClick={() => setBankAccountModalOpen(true)}
                className={`block w-full rounded-lg border ${
                  selectedBankAccount
                    ? 'border-[#525252]/20 bg-white'
                    : 'border-dashed border-[#525252]/40 bg-[#FFD2B2]/10'
                } py-3 px-4 text-left hover:border-[#FFD2B2] focus:border-[#FFD2B2] focus:ring-2 focus:ring-[#FFD2B2]/20 transition-all duration-200`}
              >
                {selectedBankAccount ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 mr-3 bg-white rounded-lg border border-[#525252]/20 flex items-center justify-center overflow-hidden">
                        {selectedBankInfo?.url ? (
                          <img
                            src={selectedBankInfo.url}
                            alt={selectedBankInfo.name}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-8 h-8 bg-[#FFD2B2] rounded flex items-center justify-center ${selectedBankInfo?.url ? 'hidden' : ''}`}
                        >
                          <span className="text-[#121212] font-bold text-sm">
                            {selectedBankAccount.bankName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#525252] truncate">
                          {selectedBankAccount.accountNumber} • {selectedBankAccount.userBankName}
                        </p>
                      </div>
                    </div>
                    <div className="text-[#525252]">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-[#525252]">
                    <div className="w-10 h-10 mr-3 bg-[#FFD2B2] rounded-lg flex items-center justify-center">
                      <span className="text-[#121212] font-bold">+</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#121212]">Chọn tài khoản ngân hàng</span>
                      <p className="text-sm text-[#525252]">Nhấn để chọn từ tài khoản đã lưu</p>
                    </div>
                  </div>
                )}
              </button>
            </div>

            <div>
              <label
                htmlFor="withdrawContent"
                className="block text-sm font-semibold text-[#121212] mb-1"
              >
                Nội dung rút tiền
              </label>
              <textarea
                id="withdrawContent"
                name="withdrawContent"
                value={withdrawContent}
                onChange={(e) => setWithdrawContent(e.target.value)}
                className="input w-full px-4 py-2.5 border border-[#525252]/20 text-[#121212] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all resize-none"
                placeholder="Nhập mô tả cho yêu cầu rút tiền (ví dụ: Rút tiền về tài khoản cá nhân)"
                rows={3}
                required
              />
              <p className="text-xs text-[#525252] mt-1">
                Mô tả này sẽ giúp bạn dễ dàng theo dõi và quản lý các giao dịch rút tiền
              </p>
            </div>

            <div className="bg-[#FFD2B2]/20 border border-[#FFD2B2] rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-[#121212]" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-[#121212]">Lưu ý quan trọng</h3>
                  <div className="mt-2 text-sm text-[#525252]">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Thời gian xử lý: 1-3 ngày làm việc</li>
                      <li>Kiểm tra kỹ thông tin tài khoản trước khi xác nhận</li>
                      <li>Phí rút tiền có thể được áp dụng</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-[#525252]/10 text-[#121212] rounded-lg hover:bg-[#525252]/20 transition-colors font-medium"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FFD2B2] text-[#121212] font-semibold rounded-lg hover:bg-[#FFB980] transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  !selectedBankAccount ||
                  !withdrawAmount ||
                  !withdrawContent ||
                  parseFloat(withdrawAmount) <= 0 ||
                  parseFloat(withdrawAmount) > balance ||
                  isNaN(parseFloat(withdrawAmount)) ||
                  processingWithdrawal
                }
              >
                {processingWithdrawal ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận rút tiền'
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
      </dialog>

      <BankAccountSelectionModal
        bankAccountModalOpen={bankAccountModalOpen}
        setBankAccountModalOpen={setBankAccountModalOpen}
        userBankAccounts={userBankAccounts}
        loadingBankAccounts={loadingBankAccounts}
        setSelectedBankAccount={setSelectedBankAccount}
      />
    </>
  );
};

export default WithdrawalModal;
