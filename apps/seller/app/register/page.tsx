'use client';
import AddressStep from '@/components/step/account-register/AddressStep';
import ConfirmationStep from '@/components/step/account-register/ConfirmationStep';
import IdentityInfoStep from '@/components/step/account-register/IdentityInfoStep';
import ShopInfoStep from '@/components/step/account-register/ShopInfoStep';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSellerRegistration } from '@/hooks/useSellerRegistration';
import { useState } from 'react';

const steps = [
  { id: 1, title: 'Thông tin shop', description: 'Tên shop và mô tả' },
  { id: 2, title: 'Địa chỉ', description: 'Vị trí cửa hàng' },
  { id: 3, title: 'Giấy tờ', description: 'CMND/CCCD' },
  { id: 4, title: 'Hoàn tất', description: 'Xác nhận thông tin' },
];

export default function RegisterPage() {
  const {
    formData,
    currentStep,
    errors,
    isSubmitting,
    loading,
    provinces,
    districts,
    wards,
    updateField,
    handleChange,
    handleFieldBlur,
    handleFileChange,
    submitForm,
    nextStep,
    prevStep,
    goToStep,
  } = useSellerRegistration();

  const [registerSuccess, setRegisterSuccess] = useState(false);

  const getStepContent = () => {
    const stepTitles = [
      'Hãy cho chúng tôi biết về bạn',
      'Bạn đang ở đâu?',
      'Xác minh danh tính',
      'Kiểm tra lại thông tin',
    ];

    return {
      title: stepTitles[currentStep - 1],
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-amber-900 mb-4">Trở thành người bán</h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto leading-relaxed">
            Chia sẻ những món đồ cũ yêu thích và kiếm thêm thu nhập từ những vật dụng không còn sử
            dụng
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-white">
                  <h2 className="text-2xl font-bold">
                    Bước {currentStep} / {steps.length}
                  </h2>
                  <p className="text-amber-100 text-sm mt-1">{getStepContent().title}</p>
                </div>
                <div className="text-white text-right">
                  <div className="text-3xl font-bold">
                    {Math.round((currentStep / steps.length) * 100)}%
                  </div>
                  <div className="text-amber-100 text-sm">Hoàn thành</div>
                </div>
              </div>

              <div className="w-full bg-amber-800/30 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-700 ease-out"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="px-8 py-6 bg-amber-25 border-b border-amber-100">
              <div className="flex justify-between">
                {steps.map((step) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  const isClickable = currentStep >= step.id;

                  return (
                    <div
                      key={step.id}
                      className={`flex-1 text-center cursor-pointer transition-all duration-200 ${
                        isClickable ? 'hover:scale-105' : 'cursor-not-allowed opacity-50'
                      }`}
                      onClick={() => isClickable && goToStep(step.id)}
                    >
                      <div
                        className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                              ? 'bg-amber-600 text-white ring-4 ring-amber-200'
                              : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isCompleted ? '✓' : step.id}
                      </div>
                      <div className="text-xs">
                        <div
                          className={`font-semibold ${isActive || isCompleted ? 'text-amber-900' : 'text-gray-500'}`}
                        >
                          {step.title}
                        </div>
                        <div
                          className={`${isActive || isCompleted ? 'text-amber-600' : 'text-gray-400'}`}
                        >
                          {step.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-8">
              {errors.general && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <p className="text-red-700 font-medium">{errors.general}</p>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="bg-white rounded-xl border border-gray-100 p-6 min-h-96">
                  {currentStep === 1 && (
                    <ShopInfoStep
                      formData={formData}
                      handleChange={handleChange}
                      handleFieldBlur={handleFieldBlur}
                      errors={errors}
                      updateField={updateField}
                    />
                  )}

                  {currentStep === 2 && (
                    <AddressStep
                      formData={formData}
                      handleChange={handleChange}
                      handleFieldBlur={handleFieldBlur}
                      errors={errors}
                      provinces={provinces}
                      districts={districts}
                      wards={wards}
                      loading={loading}
                    />
                  )}

                  {currentStep === 3 && (
                    <IdentityInfoStep
                      formData={formData}
                      handleChange={handleChange}
                      handleFileChange={handleFileChange}
                      handleFieldBlur={handleFieldBlur}
                      errors={errors}
                    />
                  )}

                  {currentStep === 4 && (
                    <>
                      {registerSuccess ? (
                        <div className="text-center py-16">
                          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                              <span className="text-green-500 text-2xl font-bold">✓</span>
                            </div>
                          </div>
                          <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Chúc mừng! Đăng ký thành công
                          </h2>
                          <div className="max-w-md mx-auto mb-8">
                            <p className="text-gray-600 text-lg leading-relaxed">
                              Hồ sơ của bạn đang được xem xét. Chúng tôi sẽ gửi email thông báo kết
                              quả trong vòng 24 giờ.
                            </p>
                          </div>
                          <Button
                            size="lg"
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            onClick={() => (window.location.href = '/')}
                          >
                            Về trang chủ
                          </Button>
                        </div>
                      ) : (
                        <ConfirmationStep
                          formData={formData}
                          provinces={provinces}
                          districts={districts}
                          wards={wards}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1 || isSubmitting || registerSuccess}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl disabled:opacity-40 transition-all duration-200"
                >
                  Quay lại
                </Button>

                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={isSubmitting || loading}
                    size="lg"
                    className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Đang tải...
                      </div>
                    ) : (
                      'Tiếp tục'
                    )}
                  </Button>
                ) : (
                  <>
                    {!registerSuccess && (
                      <Button
                        onClick={async () => {
                          const success = await submitForm();
                          if (success) {
                            setRegisterSuccess(true);
                          }
                        }}
                        disabled={isSubmitting}
                        size="lg"
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Đang xử lý...
                          </div>
                        ) : (
                          'Gửi đăng ký'
                        )}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
