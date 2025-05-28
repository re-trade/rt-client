import React from 'react';

type Props = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AccountRegisterStep1({ formData, handleChange, setShowModal }: Props) {
  return (
    <>
      <div className="flex items-center mb-4">
        <label className="w-32 text-sm font-medium">Tên Shop</label>
        <input
          name="shopName"
          value={formData.shopName}
          onChange={handleChange}
          className="flex-grow p-2 border rounded"
          placeholder="Tên shop"
        />
      </div>

      <div className="flex items-center mb-4">
        <label className="w-32 text-sm font-medium">Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          className="flex-grow p-2 border rounded"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex items-center mb-4">
        <label className="text-sm font-medium w-32">Địa chỉ nhận hàng</label>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Thêm thông tin khác
        </button>
      </div>

      <div className="flex items-center mb-4">
        <label className="w-32 text-sm font-medium">Số điện thoại</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          type="tel"
          className="flex-grow p-2 border rounded"
          placeholder="0123456789"
        />
      </div>
    </>
  );
}
