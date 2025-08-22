'use client';

import StepProgress from '@/components/registration/StepProgress';
import AddressStep from '@/components/registration/steps/AddressStep';
import ConfirmationStep from '@/components/registration/steps/ConfirmationStep';
import IdentityInfoStep from '@/components/registration/steps/IdentityInfoStep';
import ShopInfoStep from '@/components/registration/steps/ShopInfoStep';
import SuccessStep from '@/components/registration/steps/SuccessStep';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RegistrationProvider, useRegistration } from '@/context/RegistrationContext';
import { useRegistrationSubmission } from '@/hooks/use-registration-submission';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

function RegistrationContent() {
  const { currentStep, isSubmitting, prevStep, goToStep } = useRegistration();

  const { handleNextStep } = useRegistrationSubmission();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ShopInfoStep />;
      case 2:
        return <AddressStep />;
      case 3:
        return <IdentityInfoStep />;
      case 4:
        return <ConfirmationStep />;
      case 5:
        return <SuccessStep />;
      default:
        return <ShopInfoStep />;
    }
  };

  const canGoBack = currentStep > 1 && currentStep < 5;
  const canGoNext = currentStep < 4;
  const isConfirmationStep = currentStep === 4;
  const isSuccessStep = currentStep === 5;

  const getNextButtonText = () => {
    if (isConfirmationStep) {
      return 'Hoàn tất đăng ký';
    }
    return 'Tiếp tục';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        {!isSuccessStep && (
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-orange-900 mb-4">Trở thành người bán</h1>
            <p className="text-xl text-orange-700 max-w-2xl mx-auto leading-relaxed">
              Chia sẻ những món đồ cũ yêu thích và kiếm thêm thu nhập từ những vật dụng không còn sử
              dụng
            </p>
          </div>
        )}

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Progress Header */}
            {!isSuccessStep && <StepProgress />}

            {/* Step Content */}
            <div className="p-8">
              <div className="min-h-96">{renderCurrentStep()}</div>
            </div>

            {/* Navigation Footer */}
            {!isSuccessStep && (
              <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  {/* Back Button */}
                  <div>
                    {canGoBack && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={isSubmitting}
                        className="border-orange-300 text-orange-700 hover:bg-orange-50 px-6 py-3"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Quay lại
                      </Button>
                    )}
                  </div>

                  {/* Step Navigation Dots */}
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4].map((step) => (
                      <button
                        key={step}
                        onClick={() => goToStep(step)}
                        disabled={isSubmitting || step > currentStep}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          step === currentStep
                            ? 'bg-orange-600 scale-125'
                            : step < currentStep
                              ? 'bg-orange-400 hover:bg-orange-500'
                              : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    {canGoNext || isConfirmationStep ? (
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            {getNextButtonText()}
                            {!isConfirmationStep && <ChevronRight className="w-4 h-4 ml-2" />}
                          </>
                        )}
                      </Button>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {!isSuccessStep && (
          <div className="text-center mt-8">
            <p className="text-orange-600 text-sm">
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <a href="/terms" className="underline hover:text-orange-700">
                Điều khoản sử dụng
              </a>{' '}
              và{' '}
              <a href="/privacy" className="underline hover:text-orange-700">
                Chính sách bảo mật
              </a>{' '}
              của chúng tôi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <RegistrationProvider>
      <RegistrationContent />
    </RegistrationProvider>
  );
}
