import React from "react";

type ShippingMethodKey = "express" | "fast" | "economy" | "extra";

type Props = {
  shippingMethods: Record<ShippingMethodKey, boolean>;
  toggleShippingMethod: (method: ShippingMethodKey) => void;
};

export default function Step2({ shippingMethods, toggleShippingMethod }: Props) {
  const shippingOptions: { label: string; key: ShippingMethodKey; note: string }[] = [
    { label: "Hỏa Tốc", key: "express", note: "[COD đã được kích hoạt]" },
    { label: "Nhanh", key: "fast", note: "[COD đã được kích hoạt]" },
    { label: "Tiết Kiệm", key: "economy", note: "[COD đã được kích hoạt]" },
    { label: "Thêm Đơn Vị Vận Chuyển", key: "extra", note: "" },
  ];

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Phương thức vận chuyển</h2>
      {shippingOptions.map((method) => (
        <div key={method.key} className="flex items-center justify-between border-b py-3">
          <div>
            <p className="font-medium">{method.label}</p>
            {method.note && <p className="text-sm text-red-600">{method.note}</p>}
          </div>
          <label className="inline-flex items-center cursor-pointer relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={shippingMethods[method.key]}
              onChange={() => toggleShippingMethod(method.key)}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600
                after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white
                after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
        </div>
      ))}
    </>
  );
}
