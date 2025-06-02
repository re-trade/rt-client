import React, { useState, useRef } from "react";

function ProductItem({ product }) {
  return (
    <a href="/product" className="flex space-x-4 items-center mb-4 last:mb-0">
      <img
        src={product.productImage}
        alt={product.productName}
        className="w-20 h-20 object-cover rounded"
      />
      <div>
        <h3 className="font-semibold">{product.productName}</h3>
        <p className="text-sm text-gray-500">{product.productVariant}</p>
        <p className="text-sm mt-1">x{product.quantity}</p>
        <p className="mt-2">
          <span className="line-through text-gray-400 mr-2">
            ₫{product.originalPrice.toLocaleString()}
          </span>
          <span className="text-red-600 font-bold">
            ₫{product.salePrice.toLocaleString()}
          </span>
        </p>
      </div>
    </a>
  );
}

function OrderItem({
  shopInitial,
  shopName,
  products,
  refundAmount,
  cancelLink,
}) {
  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-4 space-y-6 mb-8">
      {/* Shop info */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
          {shopInitial}
        </div>
        <div className="font-semibold text-lg">{shopName}</div>
        <button className="ml-auto bg-blue-600 text-white px-3 py-1 rounded flex items-center space-x-1 hover:bg-blue-700 transition">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z"
            />
          </svg>
          <span>Chat</span>
        </button>
      </div>

      {/* Products */}
      <div>
        {products.map((product, idx) => (
          <ProductItem key={idx} product={product} />
        ))}
      </div>

      {/* Refund amount */}
      <div className="StRLL0 mt-6 border-t pt-4">
        <div className="GRRslw flex justify-between items-center">
          <div className="QAZWyi font-semibold text-gray-700">Số tiền hoàn lại</div>
          <div className="mNMT7T font-bold text-red-600 text-lg">
            ₫{refundAmount.toLocaleString()}
          </div>
        </div>
        <div className="PaVcnT mt-2">
          <div className="C2ojvz h-1 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Cancel status & buttons */}
      <div className="yyqgYp mt-4 space-y-4">
        <div className="iwUeSD">
          <div>
            <span
              aria-label="Đã hủy bởi bạn"
              tabIndex={0}
              className="text-red-600 font-semibold"
            >
              Đã hủy bởi bạn
            </span>
          </div>
        </div>

        <section className="po9nwN space-y-3">
          <h3 className="a11y-hidden"></h3>

          <div className="aAXjeK">
            <button
              className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              type="button"
            >
              Mua lại
            </button>
          </div>

          <div className="hbQXWm">
            <a href={cancelLink} className="block w-full">
              <button
                className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                type="button"
              >
                Xem chi tiết Hủy đơn
              </button>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function OrderListPage() {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const orders = [
    {
      shopInitial: "P",
      shopName: "Poermax Tech",
      refundAmount: 56221,
      cancelLink: "/user/purchase/cancellation/200657080280946",
      products: [
        {
          productImage:
            "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8wwljzi6ts4ec_tn",
          productName: "Túi đựng phụ kiện cáp sạc đa năng Poermax-SM03",
          productVariant: "Phân loại hàng: SM03 Cao Cấp-Xanh",
          quantity: 1,
          originalPrice: 75000,
          salePrice: 59000,
        },
        {
          productImage:
            "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8wwljzi6ts4ec_tn",
          productName: "Sạc nhanh USB-C 65W",
          productVariant: "Màu trắng",
          quantity: 2,
          originalPrice: 300000,
          salePrice: 250000,
        },
      ],
    },
    {
      shopInitial: "T",
      shopName: "TechShop",
      refundAmount: 120000,
      cancelLink: "/user/purchase/cancellation/200657080280947",
      products: [
        {
          productImage:
            "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8wwljzi6ts4ec_tn",
          productName: "Tai nghe Bluetooth không dây",
          productVariant: "Màu sắc: Đen",
          quantity: 1,
          originalPrice: 500000,
          salePrice: 450000,
        },
      ],
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      

      {orders.map((order, idx) => (
        <OrderItem key={idx} {...order} />
      ))}
    </div>
  );
}
