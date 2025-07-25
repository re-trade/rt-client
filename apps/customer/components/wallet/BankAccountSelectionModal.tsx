'use client';

import { BankAccountResponse, BankResponse, getBankByBin } from '@/services/payment-method.api';
import { useEffect, useState } from 'react';

interface BankAccountSelectionModalProps {
  bankAccountModalOpen: boolean;
  setBankAccountModalOpen: (open: boolean) => void;
  userBankAccounts: BankAccountResponse[];
  loadingBankAccounts: boolean;
  setSelectedBankAccount: (account: BankAccountResponse) => void;
}

// Bank Icon Component
const BankIcon = ({ account }: { account: BankAccountResponse }) => {
  const [bankInfo, setBankInfo] = useState<BankResponse | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchBankInfo = async () => {
      if (account.bankBin) {
        try {
          const info = await getBankByBin(account.bankBin);
          setBankInfo(info || null);
        } catch (error) {
          console.error('Error fetching bank info:', error);
        }
      }
    };
    fetchBankInfo();
  }, [account.bankBin]);

  return (
    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-[#525252]/20 flex items-center justify-center">
      {!imageError && bankInfo?.url ? (
        <img
          src={bankInfo.url}
          alt={bankInfo.name}
          className="w-10 h-10 object-contain p-1"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-10 h-10 bg-[#FFD2B2] rounded flex items-center justify-center">
          <span className="text-sm font-bold text-[#121212]">{account.bankName.charAt(0)}</span>
        </div>
      )}
    </div>
  );
};

const BankAccountSelectionModal = ({
  bankAccountModalOpen,
  setBankAccountModalOpen,
  userBankAccounts,
  loadingBankAccounts,
  setSelectedBankAccount,
}: BankAccountSelectionModalProps) => {
  return (
    <dialog id="bank_account_modal" className={`modal ${bankAccountModalOpen ? 'modal-open' : ''}`}>
      <div className="bg-white text-[#121212] rounded-xl shadow-xl w-11/12 max-w-4xl p-0 overflow-hidden">
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <h3 className="text-xl font-bold text-[#121212]">Chọn tài khoản ngân hàng</h3>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-[#121212] hover:bg-white/40 transition-colors"
            onClick={() => setBankAccountModalOpen(false)}
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

        <div className="p-6">
          {loadingBankAccounts ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD2B2]"></div>
              <p className="mt-3 text-[#525252] font-medium">Đang tải danh sách tài khoản...</p>
            </div>
          ) : userBankAccounts.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-24 h-24 mx-auto bg-[#FFD2B2] rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-[#121212]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#121212] mb-2">Chưa có tài khoản ngân hàng</h3>
              <p className="text-[#525252] mb-6">
                Vui lòng thêm tài khoản ngân hàng trước khi rút tiền
              </p>
              <button
                onClick={() => setBankAccountModalOpen(false)}
                className="bg-[#FFD2B2] hover:bg-[#FFB980] text-[#121212] px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto font-medium shadow-md hover:shadow-lg"
              >
                <span>Đóng</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {userBankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="relative group border border-[#525252]/20 rounded-xl p-4 hover:border-[#FFD2B2] hover:shadow-lg transition-all duration-300 bg-white cursor-pointer"
                  onClick={() => {
                    setSelectedBankAccount(account);
                    setBankAccountModalOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <BankIcon account={account} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[#121212] truncate">{account.bankName}</h4>
                      <p className="text-sm text-[#525252] truncate">
                        {account.accountNumber} • {account.userBankName}
                      </p>
                      <p className="text-xs text-[#525252] mt-1">
                        Thêm ngày:{' '}
                        {account.addedDate
                          ? new Date(account.addedDate).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="text-[#525252] group-hover:text-[#FFD2B2] transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {userBankAccounts.length > 0 && (
            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setBankAccountModalOpen(false)}
                className="px-6 py-2.5 bg-[#525252]/10 text-[#121212] rounded-lg hover:bg-[#525252]/20 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="modal-backdrop" onClick={() => setBankAccountModalOpen(false)}></div>
    </dialog>
  );
};

export default BankAccountSelectionModal;
