'use client';

import {
  Calendar,
  CreditCard,
  Edit3,
  Lock,
  Plus,
  Shield,
  Star,
  Trash2,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';

interface PaymentMethod {
  id: number;
  type: 'Visa' | 'MasterCard' | 'JCB' | 'American Express';
  last4: string;
  expiry: string;
  holderName: string;
  isDefault: boolean;
  addedDate: string;
}

const initialMethods: PaymentMethod[] = [
  {
    id: 1,
    type: 'Visa',
    last4: '1234',
    expiry: '12/24',
    holderName: 'NGUYEN VAN A',
    isDefault: true,
    addedDate: '15/03/2023',
  },
  {
    id: 2,
    type: 'MasterCard',
    last4: '5678',
    expiry: '09/25',
    holderName: 'NGUYEN VAN A',
    isDefault: false,
    addedDate: '20/06/2023',
  },
];

const cardTypeStyles = {
  Visa: 'from-blue-500 to-blue-600',
  MasterCard: 'from-red-500 to-orange-500',
  JCB: 'from-green-500 to-teal-600',
  'American Express': 'from-purple-500 to-indigo-600',
};

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    type: 'Visa' as PaymentMethod['type'],
    cardNumber: '',
    expiry: '',
    holderName: '',
    cvv: '',
  });

  const openAddModal = () => {
    setForm({ type: 'Visa', cardNumber: '', expiry: '', holderName: '', cvv: '' });
    setEditingMethod(null);
    setModalOpen(true);
  };

  const openEditModal = (method: PaymentMethod) => {
    setForm({
      type: method.type,
      cardNumber: '**** **** **** ' + method.last4,
      expiry: method.expiry,
      holderName: method.holderName,
      cvv: '',
    });
    setEditingMethod(method);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ type: 'Visa', cardNumber: '', expiry: '', holderName: '', cvv: '' });
    setEditingMethod(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn chắc chắn muốn xóa phương thức thanh toán này?')) {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMethods((prev) => prev.filter((m) => m.id !== id));
      setIsLoading(false);
    }
  };

  const setAsDefault = async (id: number) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!form.type || !form.cardNumber || !form.expiry || !form.holderName) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const last4 = form.cardNumber.replace(/\D/g, '').slice(-4);

    if (editingMethod) {
      setMethods((prev) =>
        prev.map((m) =>
          m.id === editingMethod.id
            ? { ...m, type: form.type, last4, expiry: form.expiry, holderName: form.holderName }
            : m,
        ),
      );
    } else {
      const newMethod: PaymentMethod = {
        id: Date.now(),
        type: form.type,
        last4,
        expiry: form.expiry,
        holderName: form.holderName,
        isDefault: methods.length === 0,
        addedDate: new Date().toLocaleDateString('vi-VN'),
      };
      setMethods((prev) => [...prev, newMethod]);
    }

    setIsLoading(false);
    closeModal();
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen bg-[#FDFEF9] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md border border-[#525252]/20 overflow-hidden">
          <div className="bg-[#FFD2B2] p-6 text-[#121212]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Phương thức thanh toán</h1>
                  <p className="text-[#121212] mt-1">
                    Quản lý thẻ tín dụng và phương thức thanh toán
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#121212]">Tổng số thẻ</p>
                <p className="text-2xl font-bold">{methods.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Thẻ mặc định</p>
                <p className="text-lg font-bold text-gray-800">
                  {methods.find((m) => m.isDefault)?.type || 'Chưa có'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bảo mật</p>
                <p className="text-lg font-bold text-gray-800">256-bit SSL</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã lưu</p>
                <p className="text-lg font-bold text-gray-800">{methods.length} thẻ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods List */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-[#525252]/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Danh sách thẻ thanh toán</h2>
            <button
              onClick={openAddModal}
              className="bg-[#FFD2B2] hover:bg-[#FFBB99] text-[#121212] px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 font-medium shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm thẻ mới</span>
            </button>
          </div>

          {methods.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                <CreditCard className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có thẻ thanh toán</h3>
              <p className="text-gray-600 mb-6">
                Thêm thẻ tín dụng để thanh toán dễ dàng và nhanh chóng
              </p>
              <button
                onClick={openAddModal}
                className="bg-[#FFD2B2] hover:bg-[#FFBB99] text-[#121212] px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto font-medium shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm thẻ đầu tiên</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {methods.map((method) => (
                <div
                  key={method.id}
                  className="relative group border border-gray-200 rounded-2xl p-6 hover:border-[#FFD2B2] hover:shadow-lg transition-all duration-300"
                >
                  {/* Card Visual */}
                  <div
                    className={`relative bg-gradient-to-r ${cardTypeStyles[method.type]} rounded-xl p-4 text-white mb-4 shadow-lg`}
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="text-lg font-bold">{method.type}</div>
                      {method.isDefault && (
                        <div className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                          Mặc định
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="text-xl font-mono tracking-widest">
                        •••• •••• •••• {method.last4}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs opacity-75">Chủ thẻ</div>
                          <div className="text-sm font-medium">{method.holderName}</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-75">Hết hạn</div>
                          <div className="text-sm font-medium">{method.expiry}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Thêm ngày: {method.addedDate}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => setAsDefault(method.id)}
                        disabled={isLoading}
                        className="flex-1 bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        Đặt mặc định
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(method)}
                      className="flex items-center justify-center bg-blue-100 text-blue-700 hover:bg-blue-200 p-2 rounded-lg transition-colors"
                      aria-label={`Sửa thẻ ${method.type}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(method.id)}
                      disabled={isLoading}
                      className="flex items-center justify-center bg-red-100 text-red-700 hover:bg-red-200 p-2 rounded-lg transition-colors disabled:opacity-50"
                      aria-label={`Xóa thẻ ${method.type}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl shadow-md p-6 border border-amber-200">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-amber-500 rounded-xl">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">🔒 Bảo mật thông tin</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                Thông tin thẻ của bạn được mã hóa và bảo vệ bằng công nghệ SSL 256-bit. Chúng tôi
                không lưu trữ thông tin CVV và tuân thủ các tiêu chuẩn bảo mật PCI DSS.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeModal} />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {editingMethod ? 'Sửa thông tin thẻ' : 'Thêm thẻ mới'}
              </h2>

              <div className="space-y-4">
                {/* Card Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại thẻ</label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value as PaymentMethod['type'] })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all"
                  >
                    <option value="Visa">Visa</option>
                    <option value="MasterCard">MasterCard</option>
                    <option value="JCB">JCB</option>
                    <option value="American Express">American Express</option>
                  </select>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên chủ thẻ
                  </label>
                  <input
                    type="text"
                    placeholder="NGUYEN VAN A"
                    value={form.holderName}
                    onChange={(e) => setForm({ ...form, holderName: e.target.value.toUpperCase() })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số thẻ</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={form.cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      if (formatted.length <= 19) {
                        setForm({ ...form, cardNumber: formatted });
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hạn dùng</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={form.expiry}
                      onChange={(e) => {
                        const formatted = formatExpiry(e.target.value);
                        setForm({ ...form, expiry: formatted });
                      }}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all font-mono"
                    />
                  </div>

                  {/* CVV */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="password"
                      placeholder="123"
                      maxLength={4}
                      value={form.cvv}
                      onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '') })}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl bg-[#FFD2B2] hover:bg-[#FFBB99] text-[#121212] transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#121212] border-t-transparent"></div>
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <span>{editingMethod ? 'Cập nhật' : 'Thêm thẻ'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
