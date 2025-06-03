export default function OrderList() {
  function ProductItem({ product }) {
    const { productImage, productName, productVariant, quantity, originalPrice, salePrice } =
      product;

    return (
      <a href="/product" className="flex space-x-4 items-center mb-4 last:mb-0">
        <img src={productImage} alt={productName} className="w-20 h-20 object-cover rounded" />
        <div>
          <h3 className="font-semibold">{productName}</h3>
          <p className="text-sm text-gray-500">{productVariant}</p>
          <p className="text-sm mt-1">x{quantity}</p>
          <p className="mt-2">
            <span className="line-through text-gray-400 mr-2">
              ₫{originalPrice.toLocaleString()}
            </span>
            <span className="text-red-600 font-bold">₫{salePrice.toLocaleString()}</span>
          </p>
        </div>
      </a>
    );
  }

  function OrderItem({ order }) {
    const { shopName, shopInitial, products, cancelLink } = order;

    return (
      <div className="max-w-md mx-auto bg-white shadow rounded-lg p-4 space-y-6 mb-6">
        {/* Shop info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
            {shopInitial}
          </div>
          <div className="font-semibold text-lg">{shopName}</div>
          <button className="ml-auto bg-blue-600 text-white px-3 py-1 rounded flex items-center space-x-1 hover:bg-blue-700 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Danh sách sản phẩm */}
        <div>
          {products.map((product, index) => (
            <ProductItem key={index} product={product} />
          ))}
        </div>

        {/* Chỉ hiển thị nút Mua lại và link xem chi tiết hủy đơn */}
        <div className="mt-4 space-y-4">
          <div>
            <span aria-label="Đã hủy bởi bạn" tabIndex={0} className="text-red-600 font-semibold">
              Đã hủy bởi bạn
            </span>
          </div>

          <button
            className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            type="button"
          >
            Mua lại
          </button>

          {cancelLink && (
            <a href={cancelLink} className="block w-full mt-2">
              <button
                className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                type="button"
              >
                Xem chi tiết Hủy đơn
              </button>
            </a>
          )}
        </div>
      </div>
    );
  }

  // Thêm nhiều đơn bị hủy với nhiều sản phẩm hơn
  const orders = [
    {
      shopName: 'Poermax Tech',
      shopInitial: 'P',
      status: 'cancelled',
      cancelLink: '/user/purchase/cancellation/200657080280946',
      products: [
        {
          productImage:
            'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8wwljzi6ts4ec_tn',
          productName: 'Túi đựng phụ kiện cáp sạc đa năng Poermax-SM03',
          productVariant: 'Phân loại hàng: SM03 Cao Cấp-Xanh',
          quantity: 1,
          originalPrice: 75000,
          salePrice: 59000,
        },
        {
          productImage:
            'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8wwljzi6ts4ec_tn',
          productName: 'Sạc nhanh USB-C 65W',
          productVariant: 'Màu trắng',
          quantity: 2,
          originalPrice: 300000,
          salePrice: 250000,
        },
      ],
    },
    {
      shopName: 'Fashion Store',
      shopInitial: 'F',
      status: 'cancelled',
      cancelLink: '/user/purchase/cancellation/200657080280947',
      products: [
        {
          productImage:
            'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8wwljzi6ts4ec_tn',
          productName: 'Áo thun cotton trơn',
          productVariant: 'Size: L, Màu: Trắng',
          quantity: 3,
          originalPrice: 150000,
          salePrice: 120000,
        },
      ],
    },
    {
      shopName: 'Gadget Store',
      shopInitial: 'G',
      status: 'cancelled',
      cancelLink: '/user/purchase/cancellation/200657080280948',
      products: [
        {
          productImage:
            'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8wwljzi6ts4ec_tn',
          productName: 'Đế sạc không dây đa năng',
          productVariant: 'Phiên bản 2025',
          quantity: 1,
          originalPrice: 300000,
          salePrice: 280000,
        },
        {
          productImage:
            'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8wwljzi6ts4ec_tn',
          productName: 'Cáp sạc Lightning',
          productVariant: 'Dài 1m, màu trắng',
          quantity: 2,
          originalPrice: 90000,
          salePrice: 75000,
        },
        {
          productImage:
            'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8wwljzi6ts4ec_tn',
          productName: 'Tai nghe Bluetooth',
          productVariant: 'Màu đen',
          quantity: 1,
          originalPrice: 450000,
          salePrice: 400000,
        },
      ],
    },
  ];

  const cancelledOrders = orders.filter((order) => order.status === 'cancelled');

  return (
    <div>
      {cancelledOrders.length > 0 ? (
        cancelledOrders.map((order, idx) => <OrderItem key={idx} order={order} />)
      ) : (
        <p className="text-center text-gray-500 mt-10">Không có đơn hàng mua lại</p>
      )}
    </div>
  );
}
