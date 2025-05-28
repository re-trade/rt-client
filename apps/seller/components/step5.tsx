import React from "react";

type Props = {
  formData: any;
};

export default function Step5({ formData }: Props) {
  return (
    <div className="mb-4">
      <h3 className="font-semibold text-lg mb-2">Thông tin xác nhận</h3>
      <p>Tên shop: {formData.shopName}</p>
      <p>Email: {formData.email}</p>
      <p>Số điện thoại: {formData.phone}</p>
      <p>Loại hình kinh doanh: {formData.businessType}</p>
      <p>Địa chỉ kinh doanh: {formData.businessAddress}</p>
      <p>Email nhận hóa đơn: {formData.receiveEmail}</p>
      <p>Mã số thuế: {formData.taxCode}</p>
      <p>Giới tính: {formData.gender}</p>
      <p>Ngày sinh: {formData.dob}</p>
      <p>Quốc tịch: {formData.nationality}</p>
      <p>Quốc gia cư trú: {formData.residenceCountry}</p>
      <p>Địa chỉ cư trú: {formData.residenceAddress}</p>
      <p>Số CMND/CCCD/Hộ chiếu: {formData.identityNumber}</p>
    </div>
  );
}
