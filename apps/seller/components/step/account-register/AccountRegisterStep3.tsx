'use client';

import { useState } from 'react';

const ShopeeTaxForm = () => {
  const [businessType, setBusinessType] = useState('personal');
  const [emailList, setEmailList] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');

  const handleAddEmail = () => {
    if (emailInput && emailList.length < 5) {
      setEmailList([...emailList, emailInput]);
      setEmailInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-md p-8 mt-10 ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl">Thông tin thuế</h1>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 text-sm mb-6">
        Việc thu thập Thông Tin Thuế và Thông Tin Định Danh là bắt buộc theo quy định của Luật an
        ninh mạng, Thương mại điện tử và Thuế của Việt Nam. Thông Tin Thuế và Thông Tin Định Danh sẽ
        được bảo vệ theo chính sách bảo mật của Shopee. Người bán hoàn toàn chịu trách nhiệm về
        tính chính xác của thông tin.
      </div>

      <form className="space-y-6">
        <div>
          <label className="block font-medium mb-2 text-sm">Loại hình kinh doanh <span className="text-red-500">*</span></label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={businessType === 'personal'}
                onChange={() => setBusinessType('personal')}
              />
              Cá nhân
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={businessType === 'household'}
                onChange={() => setBusinessType('household')}
              />
              Hộ kinh doanh
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={businessType === 'company'}
                onChange={() => setBusinessType('company')}
              />
              Công ty
            </label>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2 text-sm">Địa chỉ đăng ký kinh doanh <span className="text-red-500">*</span></label>
          <select className="w-full border rounded-md px-3 py-2 text-sm">
            <option>An Giang / Huyện An Phú / Thị Trấn An Phú</option>
          </select>
          <textarea
            placeholder="Địa chỉ chi tiết"
            className="w-full mt-2 border rounded-md px-3 py-2 text-sm resize-none"
            rows={2}
            defaultValue="Testing"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium mb-2 text-sm">Email nhận hóa đơn điện tử <span className="text-red-500">*</span></label>
          <input
            type="email"
            value="testing111@yopmail.com"
            readOnly
            className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100"
          />
          
        </div>

        <div>
          <label className="block font-medium mb-2 text-sm">Mã số thuế</label>
          <input
            type="text"
            maxLength={14}
            placeholder="Nhập vào"
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
          <p className="text-gray-500 text-xs mt-1">
            Theo Nghị định 52/2013/NĐ-CP, người bán phải cung cấp thông tin Mã số thuế cho sàn thương mại điện tử.
          </p>
        </div>

        
      </form>
    </div>
  );
};

export default ShopeeTaxForm;
