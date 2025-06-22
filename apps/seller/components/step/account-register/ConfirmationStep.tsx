import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { District, Province, SellerFormData, Ward } from '@/hooks/useSellerRegistration';
import { CheckCircle } from 'lucide-react';

type ConfirmationStepProps = {
  formData: SellerFormData;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
};

export default function ConfirmationStep({
  formData,
  provinces,
  districts,
  wards,
}: ConfirmationStepProps) {
  const displayField = (label: string, value: string | undefined | null, required = false) => (
    <div className="py-2">
      <div className="grid grid-cols-3 gap-4">
        <dt className="text-sm font-medium text-gray-500">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </dt>
        <dd className="text-sm text-gray-900 col-span-2">
          {value || <span className="text-gray-400 italic">Chưa cung cấp</span>}
        </dd>
      </div>
    </div>
  );

  const getLocationName = () => {
    const provinceName = provinces.find((p) => p.code.toString() === formData.state)?.name || '';
    const districtName = districts.find((d) => d.code.toString() === formData.district)?.name || '';
    const wardName = wards.find((w) => w.code.toString() === formData.ward)?.name || '';

    return {
      provinceName,
      districtName,
      wardName,
    };
  };

  const { provinceName, districtName, wardName } = getLocationName();

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-green-50 p-4 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-green-100 p-3 mb-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-medium text-green-800">Xác nhận thông tin ✅</h2>
          <p className="mt-1 text-sm text-green-700">
            Kiểm tra nhanh thông tin của bạn trước khi hoàn tất nhé!
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">🏪 Thông tin shop của bạn</CardTitle>
        </CardHeader>
        <CardContent>
          <dl>
            {displayField('Tên shop', formData.shopName, true)}
            {displayField('Mô tả shop', formData.description)}
            {displayField('Email liên hệ', formData.email, true)}
            {displayField('SĐT liên hệ', formData.phoneNumber, true)}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">📍 Địa chỉ của bạn</CardTitle>
        </CardHeader>
        <CardContent>
          <dl>
            {displayField('Địa chỉ chi tiết', formData.addressLine, true)}
            {displayField('Phường/Xã', wardName, true)}
            {displayField('Quận/Huyện', districtName, true)}
            {displayField('Tỉnh/Thành phố', provinceName, true)}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">🪪 Thông tin định danh</CardTitle>
        </CardHeader>
        <CardContent>
          <dl>{displayField('Số CMND/CCCD', formData.identityNumber, true)}</dl>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">📸 Ảnh CMND/CCCD</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Mặt trước</p>
                  <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center">
                    {formData.identityFrontImage ? (
                      <span className="text-green-600 font-medium text-sm">Đã tải lên</span>
                    ) : (
                      <span className="text-red-500 font-medium text-sm">Chưa tải lên</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Mặt sau</p>
                  <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center">
                    {formData.identityBackImage ? (
                      <span className="text-green-600 font-medium text-sm">Đã tải lên</span>
                    ) : (
                      <span className="text-red-500 font-medium text-sm">Chưa tải lên</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-700 text-sm">
        <p className="font-medium">💡 Lưu ý quan trọng:</p>
        <p>
          Khi bấm "Đăng ký thông tin", bạn đồng ý với Điều khoản và Chính sách bảo mật của chúng
          mình. Sau đó, bạn cần bấm "Xác minh danh tính" để hoàn tất quá trình đăng ký nhé! Quá
          trình xác minh sẽ mất khoảng 24 giờ, bạn sẽ nhận được thông báo qua email khi tài khoản
          sẵn sàng.
        </p>
      </div>
    </div>
  );
}
