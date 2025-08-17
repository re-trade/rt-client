'use client';

import { BankAccountResponse, BankResponse, getBankByBin } from '@/services/payment-method.api';
import { ChevronDown, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface BankAccountDropdownProps {
  selectedBankAccount: BankAccountResponse | null;
  userBankAccounts: BankAccountResponse[];
  loadingBankAccounts: boolean;
  onSelectBankAccount: (account: BankAccountResponse) => void;
  onCreateNewAccount: () => void;
  onFetchBankAccounts?: () => void;
}

const BankIcon = ({ account }: { account: BankAccountResponse }) => {
  const [bankInfo, setBankInfo] = useState<BankResponse | null>(null);

  useEffect(() => {
    const fetchBankInfo = async () => {
      if (account.bankBin) {
        try {
          const response = await getBankByBin(account.bankBin);
          if (response) {
            setBankInfo(response);
          }
        } catch (error) {
          console.error('Error fetching bank info:', error);
        }
      }
    };

    fetchBankInfo();
  }, [account.bankBin]);

  return (
    <div className="w-10 h-10 mr-3 bg-white rounded-lg border border-orange-200 flex items-center justify-center overflow-hidden">
      {bankInfo?.url ? (
        <Image src={bankInfo.url} alt={account.bankName} className="w-full h-full object-contain" />
      ) : (
        <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-500 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">{account.bankName?.charAt(0) || 'B'}</span>
        </div>
      )}
    </div>
  );
};

export default function BankAccountDropdown({
  selectedBankAccount,
  userBankAccounts,
  loadingBankAccounts,
  onSelectBankAccount,
  onCreateNewAccount,
  onFetchBankAccounts,
}: BankAccountDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAccountSelect = (account: BankAccountResponse) => {
    onSelectBankAccount(account);
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    onCreateNewAccount();
    setIsOpen(false);
  };

  const handleDropdownToggle = () => {
    if (!isOpen && onFetchBankAccounts) {
      onFetchBankAccounts();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-800 mb-2">Tài khoản ngân hàng</label>

      <button
        type="button"
        onClick={handleDropdownToggle}
        className={`block w-full rounded-xl border ${
          selectedBankAccount
            ? 'border-orange-200 bg-white shadow-sm'
            : 'border-dashed border-orange-300 bg-gradient-to-r from-orange-50 to-orange-100'
        } py-4 px-4 text-left hover:border-orange-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-200 hover:shadow-md`}
      >
        {selectedBankAccount ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BankIcon account={selectedBankAccount} />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 truncate">
                  {selectedBankAccount.bankName}
                </h4>
                <p className="text-sm text-gray-600 truncate">
                  {selectedBankAccount.accountNumber} • {selectedBankAccount.userBankName}
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Chọn tài khoản ngân hàng</p>
                <p className="text-sm text-gray-500">Nhấn để chọn hoặc thêm tài khoản mới</p>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-orange-200 rounded-xl shadow-xl overflow-hidden">
          {loadingBankAccounts ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-3"></div>
              <p className="text-gray-600">Đang tải tài khoản...</p>
            </div>
          ) : userBankAccounts.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center">
                <Plus className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Chưa có tài khoản ngân hàng
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Vui lòng thêm tài khoản ngân hàng trước khi rút tiền
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                Thêm tài khoản ngân hàng
              </button>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              <div className="p-2">
                {userBankAccounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleAccountSelect(account)}
                    className="w-full p-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-200 text-left group border border-transparent hover:border-orange-200"
                  >
                    <div className="flex items-center">
                      <BankIcon account={account} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate group-hover:text-orange-700">
                          {account.bankName}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {account.accountNumber} • {account.userBankName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Thêm ngày:{' '}
                          {account.addedDate
                            ? new Date(account.addedDate).toLocaleDateString('vi-VN')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-orange-100 p-2">
                <button
                  onClick={handleCreateNew}
                  className="w-full p-3 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-200 text-left border border-orange-200 hover:border-orange-300"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 mr-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-orange-700">Thêm tài khoản mới</p>
                      <p className="text-sm text-orange-600">Tạo tài khoản ngân hàng mới</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
