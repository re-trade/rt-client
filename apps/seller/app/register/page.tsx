// "use client";

// import { useState } from "react";

// const steps = [
//   "Thông tin shop",
//   "Cài đặt vận chuyển",
//   "Thông tin thuế",
//   "Thông tin định danh",
//   "Hoàn tất",
// ];

// type ShippingMethodKey = "express" | "fast" | "economy" | "extra";

// export default function RegisterPage() {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [showModal, setShowModal] = useState(false);

//   const [formData, setFormData] = useState({
//     shopName: "",
//     address: "",
//     email: "",
//     password: "",
//     phone: "",
//     name: "",

//     shippingMethods: {
//       express: false,
//       fast: false,
//       economy: false,
//       extra: false,
//     },

//     receiveEmail: "",
//     identityType: "",

//     businessType: "personal", // default
//     businessAddress: "",
//     taxCode: "",
//     gender: "",
//     dob: "",
//     nationality: "",
//     residenceCountry: "",
//     residenceAddress: "",
//     identityNumber: "",
//   });

//   const toggleShippingMethod = (method: ShippingMethodKey) => {
//     setFormData((prev) => ({
//       ...prev,
//       shippingMethods: {
//         ...prev.shippingMethods,
//         [method]: !prev.shippingMethods[method],
//       },
//     }));
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Validate từng bước
//   const validateStep = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           formData.shopName.trim() !== "" &&
//           formData.email.trim() !== "" &&
//           /\S+@\S+\.\S+/.test(formData.email) &&
//           formData.phone.trim() !== ""
//         );
//       case 1:
//         // Ít nhất chọn 1 phương thức vận chuyển
//         return Object.values(formData.shippingMethods).some((v) => v);
//       case 2:
//         return (
//           formData.businessType.trim() !== "" &&
//           formData.businessAddress.trim() !== "" &&
//           formData.receiveEmail.trim() !== "" &&
//           /\S+@\S+\.\S+/.test(formData.receiveEmail) &&
//           formData.taxCode.trim() !== ""
//         );
//       case 3:
//         return (
//           formData.gender.trim() !== "" &&
//           formData.dob.trim() !== "" &&
//           formData.nationality.trim() !== "" &&
//           formData.residenceCountry.trim() !== "" &&
//           formData.residenceAddress.trim() !== "" &&
//           formData.identityNumber.trim() !== ""
//         );
//       default:
//         return true;
//     }
//   };

//   const nextStep = () => {
//     if (validateStep() && currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
//   };

//   const prevStep = () => {
//     if (currentStep > 0) setCurrentStep(currentStep - 1);
//   };

//   const handleSubmit = () => {
//     if (validateStep()) {
//       alert("Form submitted!\n" + JSON.stringify(formData, null, 2));
//     } else {
//       alert("Vui lòng hoàn thành tất cả thông tin bắt buộc!");
//     }
//   };

//   const shippingOptions: { label: string; key: ShippingMethodKey; note: string }[] = [
//     { label: "Hỏa Tốc", key: "express", note: "[COD đã được kích hoạt]" },
//     { label: "Nhanh", key: "fast", note: "[COD đã được kích hoạt]" },
//     { label: "Tiết Kiệm", key: "economy", note: "[COD đã được kích hoạt]" },
//     { label: "Thêm Đơn Vị Vận Chuyển", key: "extra", note: "" },
//   ];

//   return (
//     <div className="max-w-2xl mx-auto mt-10">
//       {/* Step indicator */}
//       <div className="flex justify-between mb-10 relative">
//         {steps.map((step, index) => (
//           <div key={index} className="flex-1 px-1 text-center relative">
//             <div
//               className={`w-8 h-8 mx-auto rounded-full text-white flex items-center justify-center relative z-10 ${
//                 index === currentStep ? "bg-blue-600" : "bg-gray-300"
//               }`}
//             >
//               {index + 1}
//             </div>
//             <p className="text-sm mt-1">{step}</p>
//             {index < steps.length - 1 && (
//               <div
//                 className={`absolute top-4 right-0 w-full h-0.5 ${
//                   index < currentStep ? "bg-blue-600" : "bg-gray-300"
//                 }`}
//                 style={{ left: "50%", right: "-50%" }}
//               />
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Navigation buttons */}
//       <div className="mt-6 flex justify-between pb-8">
//         <button
//           onClick={prevStep}
//           disabled={currentStep === 0}
//           className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//         >
//           Back
//         </button>
//         {currentStep === steps.length - 1 ? (
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-green-600 text-white rounded"
//           >
//             Submit
//           </button>
//         ) : (
//           <button
//             onClick={nextStep}
//             disabled={!validateStep()}
//             className={`px-4 py-2 rounded text-white ${
//               validateStep() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
//             }`}
//           >
//             Next
//           </button>
//         )}
//       </div>

//       {/* Step content */}
//       <div className="border p-6 rounded shadow bg-white">
//         {currentStep === 0 && (
//           <>
//             <div className="flex items-center mb-4">
//               <label className="w-32 text-sm font-medium">Tên Shop</label>
//               <input
//                 name="shopName"
//                 value={formData.shopName}
//                 onChange={handleChange}
//                 className="flex-grow p-2 border rounded"
//                 placeholder="Tên shop"
//               />
//             </div>

//             <div className="flex items-center mb-4">
//               <label className="w-32 text-sm font-medium">Email</label>
//               <input
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 type="email"
//                 className="flex-grow p-2 border rounded"
//                 placeholder="you@example.com"
//               />
//             </div>

//             <div className="flex items-center mb-4">
//               <label className="text-sm font-medium w-32">Địa chỉ nhận hàng</label>
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Thêm thông tin khác
//               </button>
//             </div>

//             <div className="flex items-center mb-4">
//               <label className="w-32 text-sm font-medium">Số điện thoại</label>
//               <input
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 type="tel"
//                 className="flex-grow p-2 border rounded"
//                 placeholder="0123456789"
//               />
//             </div>
//           </>
//         )}

//         {currentStep === 1 && (
//           <>
//             <h2 className="text-lg font-semibold mb-4">Phương thức vận chuyển</h2>
//             {shippingOptions.map((method) => (
//               <div
//                 key={method.key}
//                 className="flex items-center justify-between border-b py-3"
//               >
//                 <div>
//                   <p className="font-medium">{method.label}</p>
//                   {method.note && <p className="text-sm text-red-600">{method.note}</p>}
//                 </div>
//                 <label className="inline-flex items-center cursor-pointer relative">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={formData.shippingMethods[method.key]}
//                     onChange={() => toggleShippingMethod(method.key)}
//                   />
//                   <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
//                 </label>
//               </div>
//             ))}
//           </>
//         )}

//         {currentStep === 2 && (
//           <>
//             <div className="bg-blue-100 text-blue-700 p-3 text-sm rounded mb-4 border border-blue-300">
//               Việc thu thập Thông Tin Thuế và Thông Tin Định Danh là bắt buộc...
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1 font-medium text-sm">Loại hình kinh doanh</label>
//               <div className="flex gap-4">
//                 {["personal", "household", "company"].map((type) => (
//                   <label key={type} className="flex items-center gap-1">
//                     <input
//                       type="radio"
//                       name="businessType"
//                       value={type}
//                       checked={formData.businessType === type}
//                       onChange={handleChange}
//                     />
//                     {type === "personal"
//                       ? "Cá nhân"
//                       : type === "household"
//                       ? "Hộ kinh doanh"
//                       : "Công ty"}
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <div className="mb-4">
//               <label className="font-medium block mb-1 text-sm">Địa chỉ đăng ký kinh doanh</label>
//               <input
//                 name="businessAddress"
//                 value={formData.businessAddress}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="font-medium block mb-1 text-sm">Email nhận hóa đơn điện tử</label>
//               <input
//                 name="receiveEmail"
//                 value={formData.receiveEmail}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="font-medium block mb-1 text-sm">Mã số thuế</label>
//               <input
//                 name="taxCode"
//                 maxLength={14}
//                 value={formData.taxCode}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//           </>
//         )}

//         {currentStep === 3 && (
//           <>
//             <div className="mb-4">
//               <label className="font-medium block mb-2 text-sm">Ảnh mặt trước CMND/CCCD</label>
//               <input type="file" accept="image/*" className="w-full border rounded p-2" />
//             </div>

//             <div className="mb-4">
//               <label className="font-medium block mb-2 text-sm">Ảnh mặt sau CMND/CCCD</label>
//               <input type="file" accept="image/*" className="w-full border rounded p-2" />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-1 font-medium text-sm">Giới tính</label>
//               <div className="flex gap-4">
//                 <label className="flex items-center gap-1">
//                   <input
//                     type="radio"
//                     name="gender"
//                     value="male"
//                     checked={formData.gender === "male"}
//                     onChange={handleChange}
//                   />
//                   Nam
//                 </label>
//                 <label className="flex items-center gap-1">
//                   <input
//                     type="radio"
//                     name="gender"
//                     value="female"
//                     checked={formData.gender === "female"}
//                     onChange={handleChange}
//                   />
//                   Nữ
//                 </label>
//               </div>
//             </div>

//             <div className="mb-4">
//               <label className="block mb-1 font-medium text-sm">Ngày sinh</label>
//               <input
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 type="date"
//                 className="w-full p-2 border rounded"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-1 font-medium text-sm">Quốc tịch</label>
//               <select
//                 name="nationality"
//                 value={formData.nationality}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="">-- Chọn quốc tịch --</option>
//                 <option value="vietnamese">Việt Nam</option>
//                 <option value="usa">Hoa Kỳ</option>
//                 <option value="other">Khác</option>
//               </select>
//             </div>

//             <div className="mb-4">
//               <label className="block mb-1 font-medium text-sm">Quốc gia cư trú</label>
//               <input
//                 name="residenceCountry"
//                 value={formData.residenceCountry}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-1 font-medium text-sm">Địa chỉ cư trú</label>
//               <input
//                 name="residenceAddress"
//                 value={formData.residenceAddress}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-1 font-medium text-sm">Số CMND/CCCD/Hộ chiếu</label>
//               <input
//                 name="identityNumber"
//                 value={formData.identityNumber}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//           </>
//         )}

//         {currentStep === 4 && (
//           <>
//             <div className="mb-4">
//               <h3 className="font-semibold text-lg mb-2">Thông tin xác nhận</h3>
//               <p>Tên shop: {formData.shopName}</p>
//               <p>Email: {formData.email}</p>
//               <p>Số điện thoại: {formData.phone}</p>
//               <p>Loại hình kinh doanh: {formData.businessType}</p>
//               <p>Địa chỉ kinh doanh: {formData.businessAddress}</p>
//               <p>Email nhận hóa đơn: {formData.receiveEmail}</p>
//               <p>Mã số thuế: {formData.taxCode}</p>
//               <p>Giới tính: {formData.gender}</p>
//               <p>Ngày sinh: {formData.dob}</p>
//               <p>Quốc tịch: {formData.nationality}</p>
//               <p>Quốc gia cư trú: {formData.residenceCountry}</p>
//               <p>Địa chỉ cư trú: {formData.residenceAddress}</p>
//               <p>Số CMND/CCCD/Hộ chiếu: {formData.identityNumber}</p>
//               <p>
//                 Phương thức vận chuyển đã chọn:{" "}
//                 {Object.entries(formData.shippingMethods)
//                   .filter(([_, val]) => val)
//                   .map(([key]) => key)
//                   .join(", ") || "Chưa chọn"}
//               </p>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Modal ví dụ */}
//       {showModal && (
//         <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded max-w-md w-full">
//             <h2 className="text-lg font-bold mb-4">Thêm thông tin khác</h2>
//             <textarea
//               className="w-full border p-2 rounded"
//               placeholder="Nhập thêm địa chỉ nhận hàng..."
//               rows={4}
//               value={formData.address}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, address: e.target.value }))
//               }
//             />
//             <div className="flex justify-end mt-4 gap-2">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 rounded"
//               >
//                 Hủy
//               </button>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded"
//               >
//                 Lưu
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import Footer from "@/components/Footer";
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

        {/* Nội dung bước hiện tại */}
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
      <Footer />
    </div>
  );
}
