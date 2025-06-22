'use client';
import AddressStep from '@/components/step/account-register/AddressStep';
import ConfirmationStep from '@/components/step/account-register/ConfirmationStep';
import IdentityInfoStep from '@/components/step/account-register/IdentityInfoStep';
import ShopInfoStep from '@/components/step/account-register/ShopInfoStep';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSellerRegistration } from '@/hooks/useSellerRegistration';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

const steps = [
  { id: 1, title: 'Thông tin shop' },
  { id: 2, title: 'Địa chỉ shop' },
  { id: 3, title: 'Thông tin định danh' },
  { id: 4, title: 'Xác nhận' },
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

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 py-10">
      <div className="container max-w-4xl mx-auto px-4">
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-center mb-8">🛍️ Đăng ký trở thành người bán</h1>
            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-between">
                {steps.map((step) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <div
                      key={step.id}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => goToStep(step.id)}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full
                        ${isCompleted ? 'bg-green-600' : isActive ? 'bg-blue-600' : 'bg-gray-200'}
                        transition-colors duration-200 z-10`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : (
                          <span className="text-white font-medium">{step.id}</span>
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs sm:text-sm font-medium
                        ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'}`}
                      >
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>{errors.general}</p>
              </div>
            )}

            <div className="my-8">
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
                  {verificationSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-green-700 mb-2">
                        Gửi xác minh thành công! ✨
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Chúng tôi đã nhận được thông tin của bạn và đang xem xét. Quá trình xác minh
                        sẽ mất khoảng 24 giờ. Bạn sẽ nhận được email khi tài khoản bán hàng của bạn
                        được kích hoạt.
                      </p>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => (window.location.href = '/')}
                      >
                        Quay về trang chủ
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

            <div className="flex justify-between mt-10">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting || isVerifying || verificationSuccess}
                className="px-6"
              >
                Quay lại
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={isSubmitting || loading}
                  className="px-6 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Đang tải...' : 'Tiếp theo'}
                </Button>
              ) : (
                <>
                  {verificationSuccess ? null : (
                    <div className="space-x-4">
                      {isVerifying ? (
                        <Button
                          onClick={async () => {
                            // Simulating identity verification success
                            await new Promise((resolve) => setTimeout(resolve, 1500));
                            setIsVerifying(false);
                            setVerificationSuccess(true);
                          }}
                          disabled={isSubmitting}
                          className="px-6 bg-purple-600 hover:bg-purple-700"
                        >
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang xác minh...
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={async () => {
                              const success = await submitForm();
                              if (success) {
                                setIsVerifying(true);
                              }
                            }}
                            disabled={isSubmitting}
                            className="px-6 bg-blue-600 hover:bg-blue-700"
                          >
                            {isSubmitting ? 'Đang xử lý...' : '1. Đăng ký thông tin'}
                          </Button>

                          <Button
                            onClick={() => {
                              if (formData.identityFrontImage && formData.identityBackImage) {
                                setIsVerifying(true);
                              } else {
                                alert('Vui lòng tải lên đầy đủ ảnh CMND/CCCD để xác minh');
                              }
                            }}
                            disabled={isSubmitting}
                            className="px-6 bg-green-600 hover:bg-green-700"
                          >
                            2. Xác minh danh tính
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
