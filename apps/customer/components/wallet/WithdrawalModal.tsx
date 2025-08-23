import BankAccountDropdown from '@/components/wallet/BankAccountDropdown';
import { BankAccountResponse } from '@services/payment-method.api';
import { FormEvent, useEffect } from 'react';

interface WithdrawalModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  withdrawContent: string;
  setWithdrawContent: (content: string) => void;
  selectedBankAccount: BankAccountResponse | null;
  setSelectedBankAccount: (account?: BankAccountResponse) => void;
  userBankAccounts: BankAccountResponse[];
  loadingBankAccounts: boolean;
  balance: number;
  processingWithdrawal: boolean;
  onSubmit: () => Promise<boolean>;
  formatCurrency: (amount: number) => string;
  onCreateNewBankAccount: () => void;
  onFetchBankAccounts: () => void;
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
  userBankAccounts,
  loadingBankAccounts,
  balance,
  processingWithdrawal,
  onSubmit,
  formatCurrency,
  onCreateNewBankAccount,
  onFetchBankAccounts,
}: WithdrawalModalProps) => {
  const handleWithdrawalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBankAccount || !withdrawAmount || !withdrawContent) {
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 3000 || amount > balance) {
      return;
    }

    const success = await onSubmit();
    if (success) {
      setIsModalOpen(false);
      resetForm();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      const amountInput = document.getElementById('withdrawAmount');
      if (amountInput) {
        setTimeout(() => {
          amountInput.focus();
        }, 100);
      }
    }
  }, [isModalOpen]);

  const resetForm = () => {
    setWithdrawAmount('');
    setWithdrawContent('');
    setSelectedBankAccount();
  };

  const handleAmountChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');

    if (cleanValue === '') {
      setWithdrawAmount('');
      return;
    }

    const numericValue = parseInt(cleanValue, 10);
    const maxAmount = Math.min(balance, 2000000);

    if (numericValue <= maxAmount) {
      setWithdrawAmount(cleanValue);
    }
  };

  return (
    <dialog id="withdraw_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
      <div className="bg-gradient-to-r from-white to-orange-50 text-gray-800 rounded-xl shadow-xl w-11/12 max-w-3xl p-0 overflow-hidden border border-orange-200 hover:shadow-2xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-white"
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
            </div>
            <h3 className="text-xl font-bold text-white">Rút tiền từ ví</h3>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
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
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Số tiền rút
            </label>
            <div className="relative">
              <input
                type="text"
                id="withdrawAmount"
                name="withdrawAmount"
                value={withdrawAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full px-4 py-3 border border-orange-200 text-gray-800 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all pr-16 shadow-sm hover:shadow-md"
                placeholder="Nhập số tiền cần rút"
                required
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1.5 rounded-lg shadow-md">
                VND
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <p className="text-gray-600">
                Số dư hiện tại:{' '}
                <span className="font-semibold text-gray-800">{formatCurrency(balance)}</span>
              </p>
              <p className="text-gray-600 font-medium">
                Tối đa: {formatCurrency(Math.min(balance, 2000000))}
              </p>
            </div>
            {withdrawAmount && parseFloat(withdrawAmount) > Math.min(balance, 3000000) && (
              <p className="text-red-500 text-sm mt-1">Số tiền vượt quá giới hạn cho phép</p>
            )}
            {withdrawAmount && parseFloat(withdrawAmount) < 3000 && (
              <p className="text-red-500 text-sm mt-1">Số tiền tối thiểu là 3,000 VND</p>
            )}
          </div>

          <BankAccountDropdown
            selectedBankAccount={selectedBankAccount}
            userBankAccounts={userBankAccounts}
            loadingBankAccounts={loadingBankAccounts}
            onSelectBankAccount={setSelectedBankAccount}
            onCreateNewAccount={onCreateNewBankAccount}
            onFetchBankAccounts={onFetchBankAccounts}
          />

          <div>
            <label
              htmlFor="withdrawContent"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Nội dung rút tiền
            </label>
            <textarea
              id="withdrawContent"
              name="withdrawContent"
              value={withdrawContent}
              onChange={(e) => setWithdrawContent(e.target.value)}
              className="w-full px-4 py-3 border border-orange-200 text-gray-800 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all resize-none shadow-sm hover:shadow-md"
              placeholder="Nhập mô tả cho yêu cầu rút tiền (ví dụ: Rút tiền về tài khoản cá nhân)"
              rows={3}
              required
            />
            <p className="text-xs text-gray-600 mt-2">
              Mô tả này sẽ giúp bạn dễ dàng theo dõi và quản lý các giao dịch rút tiền
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-gray-800">Lưu ý quan trọng</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Thời gian xử lý: 1-3 ngày làm việc</li>
                    <li>Kiểm tra kỹ thông tin tài khoản trước khi xác nhận</li>
                    <li>Phí rút tiền có thể được áp dụng</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
              disabled={
                !selectedBankAccount ||
                !withdrawAmount ||
                !withdrawContent ||
                parseFloat(withdrawAmount) < 3000 ||
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
  );
};

export default WithdrawalModal;
