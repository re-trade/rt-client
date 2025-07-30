'use client';

import { BankAccountResponse, BankResponse, getBankByBin } from '@/services/payment-method.api';
import { useEffect, useState } from 'react';

interface BankAccountDropdownProps {
  bankAccounts: BankAccountResponse[];
  banks: BankResponse[];
  selectedAccount: BankAccountResponse | null;
  onSelectAccount: (account: BankAccountResponse) => void;
  onAddNew: () => void;
  loading?: boolean;
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
    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-orange-200 flex items-center justify-center">
      {!imageError && bankInfo?.url ? (
        <img
          src={bankInfo.url}
          alt={bankInfo.name}
          className="w-8 h-8 object-contain p-1"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
          <span className="text-sm font-bold text-orange-600">{account.bankName.charAt(0)}</span>
        </div>
      )}
    </div>
  );
};

const BankAccountDropdown = ({
  bankAccounts,
  banks,
  selectedAccount,
  onSelectAccount,
  onAddNew,
  loading = false,
}: BankAccountDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <label className="block text-sm font-semibold text-[#121212] mb-1">Tài khoản ngân hàng</label>

      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`block w-full rounded-lg border ${
          selectedAccount
            ? 'border-orange-200 bg-white'
            : 'border-dashed border-orange-300 bg-orange-50'
        } py-3 px-4 text-left hover:border-orange-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200`}
      >
        {selectedAccount ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BankIcon account={selectedAccount} />
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {selectedAccount.bankName}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {selectedAccount.accountNumber} • {selectedAccount.userBankName}
                </p>
              </div>
            </div>
            <div className="text-[#525252]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-[#525252]/20 rounded-lg shadow-lg max-h-80 overflow-auto">
          {loading ? (
            <div className="py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#FFD2B2]"></div>
              <p className="mt-2 text-[#525252] text-sm">Đang tải...</p>
            </div>
          ) : bankAccounts.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-12 h-12 mx-auto bg-[#FFD2B2] rounded-lg flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-[#121212]"
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
              <p className="text-[#121212] font-medium text-sm">Chưa có tài khoản ngân hàng</p>
              <p className="text-[#525252] text-xs mt-1 mb-3">Thêm tài khoản để bắt đầu</p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onAddNew();
                }}
                className="bg-[#FFD2B2] hover:bg-[#FFB980] text-[#121212] px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Thêm tài khoản
              </button>
            </div>
          ) : (
            <>
              {bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="p-3 cursor-pointer hover:bg-[#FFD2B2]/10 transition-colors border-b border-[#525252]/10 last:border-b-0"
                  onClick={() => {
                    onSelectAccount(account);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <BankIcon account={account} />
                    <div className="ml-3 flex-1 min-w-0">
                      <h4 className="font-semibold text-[#121212] text-sm truncate">
                        {account.bankName}
                      </h4>
                      <p className="text-xs text-[#525252] truncate">
                        {account.accountNumber} • {account.userBankName}
                      </p>
                      <p className="text-xs text-[#525252] mt-1">
                        Thêm:{' '}
                        {account.addedDate
                          ? new Date(account.addedDate).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="text-[#525252] hover:text-[#FFD2B2] transition-colors">
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Account Option */}
              <div
                className="p-3 cursor-pointer hover:bg-[#FFD2B2]/10 transition-colors border-t border-[#525252]/20"
                onClick={() => {
                  setIsOpen(false);
                  onAddNew();
                }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#FFD2B2] rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[#121212]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-[#121212] text-sm">Thêm tài khoản mới</h4>
                    <p className="text-xs text-[#525252]">Thêm tài khoản ngân hàng khác</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export default BankAccountDropdown;
