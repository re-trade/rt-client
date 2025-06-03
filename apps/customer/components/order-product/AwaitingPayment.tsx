// Component con: hiển thị 1 đơn hàng
function OrderItem({ shopName, shopInitial, product, status }) {
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

      {/* Product info */}
      <a href={product.link} className="flex space-x-4 items-center">
        <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
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

      {/* Trạng thái đơn hàng */}
      <div className="border-t pt-4 space-y-4">
        <div className="iwUeSD">
          <div>
            <span className="CDsaN0" aria-label={status.ariaLabel} tabIndex={0}>
              {status.message}{' '}
              <div className="shopee-drawer inline" id={status.drawerId} tabIndex={0}>
                <u className="GQOPby" aria-describedby={status.ariaDescId}>
                  {status.date}
                </u>
              </div>
              .
            </span>
          </div>
        </div>

        <section className="flex space-x-4">
          {status.primaryButton && (
            <button className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
              {status.primaryButton}
            </button>
          )}
          {status.secondaryButton && (
            <button className="flex-1 border border-gray-400 text-gray-700 py-2 rounded font-semibold hover:bg-gray-100 transition">
              {status.secondaryButton}
            </button>
          )}
        </section>
      </div>
    </div>
  );
}

// Component cha: list nhiều đơn hàng
export default function OrderList() {
  const orders = [
    {
      shopName: 'Poermax Tech',
      shopInitial: 'P',
      product: {
        name: 'Túi đựng phụ kiện cáp sạc đa năng Poermax-SM03',
        variant: 'SM03 Cao Cấp-Xanh',
        quantity: 1,
        oldPrice: '75.000',
        price: '59.000',
        image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8wwljzi6ts4ec_tn',
        link: '/product',
      },
      status: {
        message: 'Đơn hàng sẽ được chuẩn bị và chuyển đi trước',
        date: '02-06-2025',
        ariaLabel: 'Đơn hàng sẽ được chuẩn bị và chuyển đi trước 02-06-2025.',
        drawerId: 'pc-drawer-id-5',
        ariaDescId: '0.5800405151018034',
        primaryButton: 'Liên hệ Người bán',
        secondaryButton: 'Hủy đơn hàng',
      },
    },
    {
      shopName: 'Shopee Official',
      shopInitial: 'S',
      product: {
        name: 'Tai nghe Bluetooth ShopeeX S200',
        variant: 'Màu Đen',
        quantity: 2,
        oldPrice: '500.000',
        price: '450.000',
        image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-xxxxxxx_tn', // đổi link thật nhé
        link: '/product/2',
      },
      status: {
        message: 'Đánh giá sản phẩm trước',
        date: '23-06-2025',
        ariaLabel: 'Đánh giá sản phẩm trước 23-06-2025',
        drawerId: 'pc-drawer-id-7',
        ariaDescId: '0.5771625905748851',
        primaryButton: 'Đánh giá',
        secondaryButton: 'Yêu cầu Trả hàng/Hoàn tiền',
      },
    },
    {
      shopName: 'ABC Store',
      shopInitial: 'A',
      product: {
        name: 'Balo du lịch ABC 30L',
        variant: 'Màu Xám',
        quantity: 1,
        oldPrice: '800.000',
        price: '700.000',
        image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-yyyyyyy_tn', // đổi link thật nhé
        link: '/product/3',
      },
      status: {
        message: 'Đã hủy bởi bạn',
        date: '',
        ariaLabel: 'Đã hủy bởi bạn',
        drawerId: '',
        ariaDescId: '',
        primaryButton: 'Mua lại',
        secondaryButton: 'Xem chi tiết Hủy đơn',
      },
    },
  ];

  return (
    <div className="space-y-8 p-4">
      {orders.map((order, idx) => (
        <OrderItem key={idx} {...order} />
      ))}
    </div>
  );
}
