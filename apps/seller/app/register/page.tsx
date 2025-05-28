
"use client";
import Step1 from "@/components/step1";
import Step2 from "@/components/step2";
import Step3 from "@/components/step3";
import Step4 from "@/components/step4";
import Step5 from "@/components/step5";
import React, { useState } from "react";
const steps = [
  "Thông tin shop",
  "Cài đặt vận chuyển",
  "Thông tin thuế",
  "Thông tin định danh",
  "Hoàn tất",
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    shopName: "",
    email: "",
    phone: "",
    businessType: "personal",
    businessAddress: "",
    receiveEmail: "",
    taxCode: "",
    gender: "male",
    dob: "",
    nationality: "",
    residenceCountry: "",
    residenceAddress: "",
    identityNumber: "",
  });

  const [shippingMethods, setShippingMethods] = useState({
    express: true,
    fast: true,
    economy: true,
    extra: false,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function toggleShippingMethod(method: keyof typeof shippingMethods) {
    setShippingMethods((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-4 max-w-3xl border rounded shadow">
        <div className="flex justify-between mb-10 relative">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = step === stepNumber;
            const isCompleted = step > stepNumber;

            return (
              <div
                key={label}
                className="flex-1 px-1 text-center relative cursor-pointer"
                onClick={() => setStep(stepNumber)}
              >
                <div
                  className={`w-8 h-8 mx-auto rounded-full text-white flex items-center justify-center relative z-10 ${
                    isActive
                      ? "bg-blue-600"
                      : isCompleted
                        ? "bg-green-600"
                        : "bg-gray-300"
                  }`}
                >
                  {stepNumber}
                </div>
                <p className="text-sm mt-1">{label}</p>

                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-4 right-0 w-full h-0.5 ${
                      isCompleted ? "bg-green-600" : "bg-gray-300"
                    }`}
                    style={{ left: "50%", right: "-50%" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <Step1
            formData={formData}
            handleChange={handleChange}
            setShowModal={() => {}}
          />
        )}
        {step === 2 && (
          <Step2
            shippingMethods={shippingMethods}
            toggleShippingMethod={toggleShippingMethod}
          />
        )}
        {step === 3 && (
          <Step3 formData={formData} handleChange={handleChange} />
        )}
        {step === 4 && (
          <Step4 formData={formData} handleChange={handleChange} />
        )}
        {step === 5 && <Step5 formData={formData} />}

        <div className="flex justify-between mt-6">
          <button
            disabled={step === 1}
            onClick={() => setStep((s) => s - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Quay lại
          </button>

          {step < 5 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Tiếp theo
            </button>
          ) : (
            <button
              onClick={() => {
                alert("Lưu form hoặc gửi dữ liệu đi!");
              }}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Lưu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
