'use client';

import { useRegistration } from '@/context/RegistrationContext';
import { registrationSteps } from '@/types/registration';
import { CheckCircle, Circle } from 'lucide-react';

export default function StepProgress() {
  const { currentStep } = useRegistration();

  const getStepTitles = () => {
    return [
      'Hãy cho chúng tôi biết về bạn',
      'Bạn đang ở đâu?',
      'Xác minh danh tính',
      'Kiểm tra lại thông tin',
      'Hoàn tất!',
    ];
  };

  const stepTitles = getStepTitles();

  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-white">
          <h2 className="text-2xl font-bold">
            Bước {Math.min(currentStep, 4)} / {registrationSteps.length}
          </h2>
          <p className="text-orange-100 text-sm mt-1">{stepTitles[currentStep - 1]}</p>
        </div>
        <div className="text-white text-right">
          <div className="text-3xl font-bold">
            {Math.round((Math.min(currentStep, 4) / registrationSteps.length) * 100)}%
          </div>
          <div className="text-orange-100 text-sm">Hoàn thành</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-orange-800/30 rounded-full h-2 mb-6">
        <div
          className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${(Math.min(currentStep, 4) / registrationSteps.length) * 100}%`,
          }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {registrationSteps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          const isUpcoming = currentStep < stepNumber;

          return (
            <div key={step.id} className="flex flex-col items-center">
              {/* Step Circle */}
              <div className="relative">
                {isCompleted ? (
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-orange-600" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-orange-600 rounded-full" />
                  </div>
                ) : (
                  <div className="w-10 h-10 border-2 border-orange-300 rounded-full flex items-center justify-center">
                    <Circle className="w-6 h-6 text-orange-300" />
                  </div>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center">
                <div
                  className={`text-xs font-medium ${
                    isCompleted || isCurrent ? 'text-white' : 'text-orange-200'
                  }`}
                >
                  {step.title}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    isCompleted || isCurrent ? 'text-orange-100' : 'text-orange-300'
                  }`}
                >
                  {step.description}
                </div>
              </div>

              {/* Connector Line */}
              {index < registrationSteps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 ${
                    isCompleted ? 'bg-white' : 'bg-orange-800/30'
                  }`}
                  style={{
                    transform: 'translateX(50%)',
                    width: 'calc(100vw / 4 - 2.5rem)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
