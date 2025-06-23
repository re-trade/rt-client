import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { District, Province, SellerFormData, Ward } from '@/hooks/useSellerRegistration';
import { AlertCircle, CheckCircle, IdCard, MapPin, Store } from 'lucide-react';

type ConfirmationStepProps = {
  formData: SellerFormData;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
};

export default function ConfirmationStep({
  formData,
  districts,
  wards,
  provinces,
}: ConfirmationStepProps) {
  const displayField = (label: string, value: string | undefined | null, required = false) => (
    <div className="py-3 border-b border-amber-100 last:border-b-0">
      <div className="flex justify-between items-start">
        <dt className="text-sm font-medium text-amber-800 flex-shrink-0 w-1/3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </dt>
        <dd className="text-sm text-gray-700 font-medium flex-grow text-right">
          {value || <span className="text-gray-400 italic font-normal">Chưa cung cấp</span>}
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
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-900 mb-2">Xác nhận thông tin đăng ký</h1>
          <p className="text-amber-700">
            Vui lòng kiểm tra kỹ thông tin của bạn trước khi hoàn tất đăng ký
          </p>
        </div>
      </div>

      <Card className="border-amber-200 shadow-sm">
        <CardHeader className="bg-amber-50 border-b border-amber-100">
          <CardTitle className="text-lg text-amber-900 flex items-center">
            <Store className="h-5 w-5 mr-2" />
            Thông tin cửa hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <dl className="space-y-0">
            {displayField('Tên cửa hàng', formData.shopName, true)}
            {displayField('Mô tả cửa hàng', formData.description)}
            {displayField('Email liên hệ', formData.email, true)}
            {displayField('Số điện thoại', formData.phoneNumber, true)}
          </dl>
        </CardContent>
      </Card>

      <Card className="border-amber-200 shadow-sm">
        <CardHeader className="bg-amber-50 border-b border-amber-100">
          <CardTitle className="text-lg text-amber-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Địa chỉ cửa hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <dl className="space-y-0">
            {displayField('Địa chỉ chi tiết', formData.addressLine, true)}
            {displayField('Phường/Xã', wardName, true)}
            {displayField('Quận/Huyện', districtName, true)}
            {displayField('Tỉnh/Thành phố', provinceName, true)}
          </dl>
        </CardContent>
      </Card>

      <Card className="border-amber-200 shadow-sm">
        <CardHeader className="bg-amber-50 border-b border-amber-100">
          <CardTitle className="text-lg text-amber-900 flex items-center">
            <IdCard className="h-5 w-5 mr-2" />
            Thông tin định danh
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <dl className="space-y-0 mb-6">
            {displayField('Số CMND/CCCD', formData.identityNumber, true)}
          </dl>

          <Separator className="my-6 bg-amber-100" />

          <div className="space-y-4">
            <h4 className="text-base font-semibold text-amber-900 mb-4">Hình ảnh CMND/CCCD</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-800">Mặt trước</p>
                <div className="h-36 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-200 rounded-lg flex items-center justify-center">
                  {formData.identityFrontImage ? (
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <span className="text-green-700 font-medium text-sm">Đã tải lên</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <span className="text-red-600 font-medium text-sm">Chưa tải lên</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-800">Mặt sau</p>
                <div className="h-36 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-200 rounded-lg flex items-center justify-center">
                  {formData.identityBackImage ? (
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <span className="text-green-700 font-medium text-sm">Đã tải lên</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <span className="text-red-600 font-medium text-sm">Chưa tải lên</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-grow">
            <p className="font-semibold text-blue-900 mb-2">Lưu ý quan trọng</p>
            <p className="text-blue-800 text-sm leading-relaxed">
              Khi nhấn "Đăng ký thông tin", bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật
              của chúng tôi. Sau đó, vui lòng nhấn "Xác minh danh tính" để hoàn tất quá trình đăng
              ký. Quá trình xác minh sẽ diễn ra trong vòng 24 giờ và bạn sẽ nhận được thông báo qua
              email khi tài khoản được kích hoạt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
