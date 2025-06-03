'use client';
import { useState } from 'react';

const initialMethods = [
  { id: 1, type: 'Visa', last4: '1234', expiry: '12/24' },
  { id: 2, type: 'MasterCard', last4: '5678', expiry: '09/25' },
];

export default function ManagePaymentMethods() {
  const [methods, setMethods] = useState(initialMethods);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [form, setForm] = useState({
    type: '',
    cardNumber: '',
    expiry: '',
  });

  const openAddModal = () => {
    setForm({ type: '', cardNumber: '', expiry: '' });
    setEditingMethod(null);
    setModalOpen(true);
  };

  const openEditModal = (method) => {
    setForm({
      type: method.type,
      cardNumber: '**** **** **** ' + method.last4,
      expiry: method.expiry,
    });
    setEditingMethod(method);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ type: '', cardNumber: '', expiry: '' });
    setEditingMethod(null);
  };

  const handleDelete = (id) => {
    if (confirm('Bạn chắc chắn muốn xóa phương thức thanh toán này?')) {
      setMethods((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleSave = () => {
    if (!form.type || !form.cardNumber || !form.expiry) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    let last4 = form.cardNumber.replace(/\D/g, '').slice(-4);
    if (editingMethod) {
      setMethods((prev) =>
        prev.map((m) =>
          m.id === editingMethod.id ? { ...m, type: form.type, last4, expiry: form.expiry } : m,
        ),
      );
    } else {
      setMethods((prev) => [
        ...prev,
        { id: Date.now(), type: form.type, last4, expiry: form.expiry },
      ]);
    }
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-3">Quản lý phương thức thanh toán</h1>
        <p className="text-gray-600 mb-6">Thêm, sửa hoặc xóa các phương thức thanh toán của bạn.</p>

        <div className="space-y-4">
          {methods.map((method) => (
            <div
              key={method.id}
              className="flex justify-between items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
            >
              <div>
                <p className="text-lg font-semibold">{method.type}</p>
                <p className="text-gray-600 tracking-widest">**** **** **** {method.last4}</p>
                <p className="text-gray-400 text-sm">Hạn dùng {method.expiry}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => openEditModal(method)}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                  aria-label={`Sửa ${method.type} số cuối ${method.last4}`}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(method.id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                  aria-label={`Xóa ${method.type} số cuối ${method.last4}`}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}

          {/* Thẻ thêm mới */}
          <button
            onClick={openAddModal}
            className="flex justify-center items-center bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-blue-600 hover:text-blue-600 font-semibold transition"
            aria-label="Thêm phương thức thanh toán mới"
          >
            + Thêm phương thức thanh toán mới
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={closeModal} />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6">
                {editingMethod ? 'Sửa phương thức thanh toán' : 'Thêm phương thức thanh toán'}
              </h2>

              <label className="block mb-4">
                <span className="text-gray-700">Loại thẻ</span>
                <input
                  type="text"
                  placeholder="Visa, MasterCard..."
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block mb-4">
                <span className="text-gray-700">Số thẻ</span>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  value={form.cardNumber}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^\d ]/g, '');
                    setForm({ ...form, cardNumber: val });
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block mb-6">
                <span className="text-gray-700">Hạn dùng (MM/YY)</span>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={form.expiry}
                  onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  {editingMethod ? 'Lưu thay đổi' : 'Thêm thẻ'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
