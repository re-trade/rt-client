function OrderItem({ shopInitial, shopName, product, onPrimaryClick, onSecondaryClick }) {
  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-4 space-y-6 mb-6">
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

      {/* Product info */}
      <a href={product.link} className="flex space-x-4 items-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 object-cover rounded"
        />
        <div>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">Phân loại hàng: {product.variant}</p>
          <p className="text-sm mt-1">x{product.quantity}</p>
          <p className="mt-2">
            <span className="line-through text-gray-400 mr-2">₫{product.oldPrice}</span>
            <span className="text-red-600 font-bold">₫{product.price}</span>
          </p>
        </div>
      </a>

      {/* Đánh giá phần */}
      <div className="yyqgYp border-t pt-4 space-y-4">
        <div className="iwUeSD flex flex-col space-y-1">
          {/* Bạn có thể thêm text trạng thái ở đây nếu cần */}
        </div>

        <section className="po9nwN grYckU flex flex-wrap gap-2 justify-center">
          <div className="aAXjeK">
            <button
              className="stardust-button stardust-button--primary QY7kZh bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              type="button"
              onClick={onPrimaryClick}
            >
              Đánh giá
            </button>
          </div>
          <div className="hbQXWm">
            <button
              className="stardust-button stardust-button--secondary QY7kZh border border-gray-400 px-4 py-2 rounded hover:bg-gray-100 transition"
              type="button"
              onClick={onSecondaryClick}
            >
              Yêu cầu Trả hàng/Hoàn tiền
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function OrderList() {
  const orders = [
    {
      shopInitial: "P",
      shopName: "Poermax Tech",
      product: {
        name: "Túi đựng phụ kiện cáp sạc đa năng Poermax-SM03",
        variant: "SM03 Cao Cấp-Xanh",
        quantity: 1,
        oldPrice: "75.000",
        price: "59.000",
        image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8wwljzi6ts4ec_tn",
        link: "/product",
      },
    },
    {
      shopInitial: "S",
      shopName: "Shopee Official",
      product: {
        name: "Tai nghe Bluetooth ShopeeX S200",
        variant: "Màu Đen",
        quantity: 2,
        oldPrice: "500.000",
        price: "450.000",
        image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-xxxxxxx_tn",
        link: "/product/2",
      },
    },
  ];

  // Hàm demo click nút
  const handlePrimaryClick = (shopName) => {
    alert(`Bạn chọn Đánh giá đơn hàng của ${shopName}`);
  };

  const handleSecondaryClick = (shopName) => {
    alert(`Bạn chọn Yêu cầu Trả hàng/Hoàn tiền đơn hàng của ${shopName}`);
  };

  return (
    <div className="space-y-8 p-4">
      {orders.map((order, idx) => (
        <OrderItem
          key={idx}
          shopInitial={order.shopInitial}
          shopName={order.shopName}
          product={order.product}
          onPrimaryClick={() => handlePrimaryClick(order.shopName)}
          onSecondaryClick={() => handleSecondaryClick(order.shopName)}
        />
      ))}
    </div>
  );
}
