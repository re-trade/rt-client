import BankSelectionModal from '@/components/wallet/BankSelectionModal';
import { BankResponse } from '@services/payment-method.api';
import { CreateWithdrawalRequest } from '@services/wallet.api';
import { FormEvent } from 'react';

interface WithdrawalModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  accountNumber: string;
  setAccountNumber: (number: string) => void;
  accountName: string;
  setAccountName: (name: string) => void;
  selectedBank: BankResponse | null;
  setSelectedBank: (bank: BankResponse) => void;
  bankModalOpen: boolean;
  setBankModalOpen: (open: boolean) => void;
  bankSearch: string;
  setBankSearch: (search: string) => void;
  balance: number;
  processingWithdrawal: boolean;
  onSubmit: (data: CreateWithdrawalRequest) => Promise<boolean>;
  formatCurrency: (amount: number) => string;
}

const WithdrawalModal = ({
  isModalOpen,
  setIsModalOpen,
  withdrawAmount,
  setWithdrawAmount,
  accountNumber,
  setAccountNumber,
  accountName,
  setAccountName,
  selectedBank,
  setSelectedBank,
  bankModalOpen,
  setBankModalOpen,
  bankSearch,
  setBankSearch,
  balance,
  processingWithdrawal,
  onSubmit,
  formatCurrency,
}: WithdrawalModalProps) => {
  const handleWithdrawalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBank || !withdrawAmount || !accountNumber || !accountName) return;

    const data: CreateWithdrawalRequest = {
      amount: parseFloat(withdrawAmount),
      bankBin: selectedBank.bin,
      accountNumber,
      accountName,
    };

    const success = await onSubmit(data);
    if (success) {
      setIsModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setWithdrawAmount('');
    setAccountNumber('');
    setAccountName('');
    setSelectedBank(null);
  };

  return (
    <>
      <dialog id="withdraw_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box w-full max-w-md bg-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-[#121212]">Rút tiền</h3>

          <form onSubmit={handleWithdrawalSubmit} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="withdrawAmount"
                className="block text-sm font-medium text-[#525252] mb-1"
              >
                Số tiền rút
              </label>
              <div className="mt-1 relative">
                <input
                  type="number"
                  id="withdrawAmount"
                  name="withdrawAmount"
                  min="50000"
                  max={balance}
                  step="10000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="block w-full rounded-md border border-[#525252]/20 shadow-sm py-2 px-3 focus:border-[#FFD2B2] focus:ring focus:ring-[#FFD2B2] focus:ring-opacity-50"
                  placeholder="Nhập số tiền cần rút"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-[#525252]">
                  VND
                </div>
              </div>
              <p className="mt-1 text-xs text-[#525252]">
                Số dư hiện tại: {formatCurrency(balance)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#525252] mb-1">Ngân hàng</label>
              <button
                type="button"
                onClick={() => setBankModalOpen(true)}
                className={`block w-full rounded-md border ${
                  selectedBank ? 'border-[#525252]/20' : 'border-dashed border-[#525252]/40'
                } shadow-sm py-2 px-3 text-left focus:border-[#FFD2B2] focus:ring focus:ring-[#FFD2B2] focus:ring-opacity-50`}
              >
                {selectedBank ? (
                  <div className="flex items-center">
                    {selectedBank.url && (
                      <img
                        src={selectedBank.url}
                        alt={selectedBank.name}
                        className="w-6 h-6 mr-2 object-contain"
                      />
                    )}
                    <span>{selectedBank.name}</span>
                  </div>
                ) : (
                  <span className="text-[#525252]">Chọn ngân hàng</span>
                )}
              </button>
            </div>

            <div>
              <label
                htmlFor="accountNumber"
                className="block text-sm font-medium text-[#525252] mb-1"
              >
                Số tài khoản
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="block w-full rounded-md border border-[#525252]/20 shadow-sm py-2 px-3 focus:border-[#FFD2B2] focus:ring focus:ring-[#FFD2B2] focus:ring-opacity-50"
                placeholder="Nhập số tài khoản ngân hàng"
                required
              />
            </div>

            <div>
              <label
                htmlFor="accountName"
                className="block text-sm font-medium text-[#525252] mb-1"
              >
                Tên chủ tài khoản
              </label>
              <input
                type="text"
                id="accountName"
                name="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="block w-full rounded-md border border-[#525252]/20 shadow-sm py-2 px-3 focus:border-[#FFD2B2] focus:ring focus:ring-[#FFD2B2] focus:ring-opacity-50"
                placeholder="Nhập tên chủ tài khoản"
                required
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3 modal-action">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-outline border border-[#525252]/20 rounded-lg text-[#525252] hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary bg-[#FFD2B2] hover:bg-[#FFB980] rounded-lg text-[#121212] font-medium transition-colors flex items-center"
                disabled={
                  !selectedBank ||
                  !withdrawAmount ||
                  !accountNumber ||
                  !accountName ||
                  processingWithdrawal
                }
              >
                {processingWithdrawal ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#121212]"
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
                  'Xác nhận'
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
      </dialog>

      <BankSelectionModal
        bankModalOpen={bankModalOpen}
        setBankModalOpen={setBankModalOpen}
        bankSearch={bankSearch}
        setBankSearch={setBankSearch}
        selectedBank={selectedBank}
        setSelectedBank={setSelectedBank}
      />
    </>
  );
};

export default WithdrawalModal;
