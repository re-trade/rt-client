'use client';

import { useToast } from '@/context/ToastContext';
import { usePaymentMethod } from '@/hooks/use-payment-method';
import BankAccountDropdown from '@components/bank/BankAccountDropdown';
import BankAccountModal from '@components/bank/BankAccountModal';
import Toast from '@components/toast/Toast';
import { BankAccountResponse } from '@services/payment-method.api';
import { Building2, Lock, Shield, Wallet } from 'lucide-react';
import { useState } from 'react';

export default function BankAccountsPage() {
  const {
    banks,
    bankAccounts,
    editingAccount,
    isBankAccountLoading,
    setEditingAccount,
    createBankAccount,
    form,
    setForm,
    isModalOpen,
    setIsModalOpen,
    updateUserBankAccount,
  } = usePaymentMethod();
  const { messages, removeToast } = useToast();

  // State for dropdown selection
  const [selectedAccount, setSelectedAccount] = useState<BankAccountResponse | null>(null);

  const openAddModal = () => {
    setForm({ selectedBankBin: '', accountNumber: '', userBankName: '' });
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const openEditModal = (account: BankAccountResponse) => {
    setForm({
      id: account.id,
      selectedBankBin: account.bankBin,
      accountNumber: account.accountNumber,
      userBankName: account.userBankName,
    });
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ selectedBankBin: '', accountNumber: '', userBankName: '', id: '' });
    setEditingAccount(null);
  };

  const handleDelete = async (id: string) => {
    // Clear selected account if it's the one being deleted
    if (selectedAccount?.id === id) {
      setSelectedAccount(null);
    }
    // Add actual delete logic here when the API is available
    console.log('Delete account with id:', id);
  };

  const handleSave = async () => {
    if (!form.id) {
      await createBankAccount({
        userBankName: form.userBankName,
        accountNumber: form.accountNumber,
        selectedBankBin: form.selectedBankBin,
      });
    } else {
      await updateUserBankAccount(
        {
          userBankName: form.userBankName,
          accountNumber: form.accountNumber,
          selectedBankBin: form.selectedBankBin,
        },
        form.id,
      );
    }

    closeModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-orange-50 p-6">
      <Toast messages={messages} onRemove={removeToast} />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-md border border-orange-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Tài khoản ngân hàng</h1>
                  <p className="text-gray-600 mt-1">Quản lý tài khoản ngân hàng cho thanh toán</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Tổng số tài khoản</p>
                <p className="text-2xl font-bold text-gray-800">{bankAccounts.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bảo mật</p>
                <p className="text-lg font-bold text-gray-800">256-bit SSL</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Wallet className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã lưu</p>
                <p className="text-lg font-bold text-gray-800">{bankAccounts.length} tài khoản</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-white to-orange-50 rounded-xl shadow-lg p-8 border border-orange-200 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quản lý tài khoản ngân hàng</h2>
            <p className="text-gray-600 text-sm">
              Chọn tài khoản ngân hàng để quản lý hoặc thêm tài khoản mới
            </p>
          </div>

          {/* Bank Account Dropdown */}
          <div className="mb-6">
            <BankAccountDropdown
              bankAccounts={bankAccounts}
              banks={banks}
              selectedAccount={selectedAccount}
              onSelectAccount={setSelectedAccount}
              onAddNew={openAddModal}
              loading={isBankAccountLoading}
            />
          </div>

          {/* Selected Account Details */}
          {selectedAccount && (
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Chi tiết tài khoản</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => openEditModal(selectedAccount)}
                    className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 p-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedAccount.id)}
                    className="flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 p-2.5 rounded-lg transition-all duration-200 border border-red-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Ngân hàng</label>
                  <p className="text-gray-800 font-semibold">{selectedAccount.bankName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Số tài khoản
                  </label>
                  <p className="text-gray-800 font-semibold font-mono">
                    {selectedAccount.accountNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Tên chủ tài khoản
                  </label>
                  <p className="text-gray-800 font-semibold">{selectedAccount.userBankName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Ngày thêm</label>
                  <p className="text-gray-800 font-semibold">
                    {selectedAccount.addedDate
                      ? new Date(selectedAccount.addedDate).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl shadow-md p-6 border border-amber-200">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-amber-500 rounded-xl">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">🔒 Bảo mật thông tin</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                Thông tin tài khoản ngân hàng của bạn được mã hóa và bảo vệ bằng công nghệ SSL
                256-bit. Chúng tôi tuân thủ các tiêu chuẩn bảo mật ngân hàng và không lưu trữ thông
                tin nhạy cảm.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BankAccountModal
        open={isModalOpen}
        editingAccount={editingAccount}
        form={form}
        banks={banks}
        loading={isBankAccountLoading}
        onChange={(k, v) => setForm({ ...form, [k]: v })}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  );
}
