function OrderItemProduct({ product }) {
  return (
    <a href={product.link} className="flex space-x-4 items-center">
      <img
        src={product.img}
        alt={product.name}
        className="w-20 h-20 object-cover rounded"
      />
      <div>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.variant}</p>
        <p className="text-sm mt-1">x{product.quantity}</p>
        <p className="mt-2">
          <span className="line-through text-gray-400 mr-2">{product.priceOld}</span>
          <span className="text-red-600 font-bold">{product.priceNew}</span>
        </p>
      </div>
    </a>
  );
}

function OrderItem({ order }) {
  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-4 space-y-6">
      {/* Shop info */}
      <div className="flex items-center space-x-4">
        <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
          {order.shopInitial}
        </div>
        <div className="font-semibold text-lg">{order.shopName}</div>
        <button className="ml-auto bg-blue-600 text-white px-3 py-1 rounded flex items-center space-x-1">
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

      {/* List products */}
      <div className="space-y-4">
        {order.products.map((product) => (
          <OrderItemProduct key={product.id} product={product} />
        ))}
      </div>

      {/* Status and buttons */}
      <div className="border-t pt-4 space-y-4">
        <div className="iwUeSD">
          <div>
            <span
              className="CDsaN0"
              aria-label={`Đơn hàng sẽ được chuẩn bị và chuyển đi trước ${order.deliveryDate}.`}
              tabIndex={0}
            >
              Đơn hàng sẽ được chuẩn bị và chuyển đi trước{' '}
              <div className="shopee-drawer inline" tabIndex={0}>
                <u className="GQOPby">{order.deliveryDate}</u>
              </div>
              .
            </span>
          </div>
        </div>

        <section className="flex space-x-4">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
            Liên hệ Người bán
          </button>
          <button className="flex-1 border border-gray-400 text-gray-700 py-2 rounded font-semibold hover:bg-gray-100 transition">
            Hủy đơn hàng
          </button>
        </section>
      </div>
    </div>
  );
}

export default function OrderList() {
  const orders = [
    {
      id: 1,
      shopInitial: 'P',
      shopName: 'Poermax Tech',
      deliveryDate: '02-06-2025',
      products: [
        {
          id: 1,
          name: 'Túi đựng phụ kiện cáp sạc đa năng Poermax-SM03',
          variant: 'Phân loại hàng: SM03 Cao Cấp-Xanh',
          quantity: 1,
          priceOld: '₫75.000',
          priceNew: '₫59.000',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8wwljzi6ts4ec_tn',
          link: '/product',
        },
      ],
    },
    {
      id: 2,
      shopInitial: 'S',
      shopName: 'Super Gadgets',
      deliveryDate: '10-06-2025',
      products: [
        {
          id: 2,
          name: 'Sạc nhanh 20W PD PowerMax',
          variant: 'Màu sắc: Trắng',
          quantity: 2,
          priceOld: '₫200.000',
          priceNew: '₫170.000',
          img: 'https://example.com/sac-nhanh.jpg',
          link: '/product/2',
        },
        {
          id: 3,
          name: 'Cáp sạc Type-C bền bỉ PowerMax',
          variant: 'Chiều dài: 1.2m - Đen',
          quantity: 1,
          priceOld: '₫50.000',
          priceNew: '₫45.000',
          img: 'https://example.com/cap-sac.jpg',
          link: '/product/3',
        },
      ],
    },
  ];

  return (
    <div className="space-y-10">
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} />
      ))}
    </div>
  );
}
