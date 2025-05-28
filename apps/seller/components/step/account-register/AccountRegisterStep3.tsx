import React from 'react';

type Props = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export default function AccountResisterStep3({ formData, handleChange }: Props) {
  return (
    <>
      <div className="mb-4">
        <label className="font-medium block mb-2 text-sm">Ảnh mặt trước CMND/CCCD</label>
        <input type="file" accept="image/*" className="w-full border rounded p-2" />
      </div>

      <div className="mb-4">
        <label className="font-medium block mb-2 text-sm">Ảnh mặt sau CMND/CCCD</label>
        <input type="file" accept="image/*" className="w-full border rounded p-2" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-sm">Giới tính</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleChange}
            />
            Nam
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleChange}
            />
            Nữ
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-sm">Ngày sinh</label>
        <input
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          type="date"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-sm">Quốc tịch</label>
        <select
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Chọn quốc tịch --</option>
          <option value="vietnamese">Việt Nam</option>
          <option value="usa">Hoa Kỳ</option>
          <option value="other">Khác</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-sm">Quốc gia cư trú</label>
        <input
          name="residenceCountry"
          value={formData.residenceCountry}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-sm">Địa chỉ cư trú</label>
        <input
          name="residenceAddress"
          value={formData.residenceAddress}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-sm">Số CMND/CCCD/Hộ chiếu</label>
        <input
          name="identityNumber"
          value={formData.identityNumber}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
    </>
  );
}