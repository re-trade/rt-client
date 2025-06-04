import CarouselComponent from '@/components/Carousel';
import ProductCard from '@/components/product/ProductCard';
export default function Home() {
  const categories = [
    'Quần áo',
    'Điện tử',
    'Nội thất',
    'Sách',
    'Đồ gia dụng',
    'Đồ chơi',
    'Thể thao',
    'Làm đẹp',
    'Thời trang',
    'Phụ kiện',
    'Xe cộ',
    'Văn phòng phẩm',
    'Nhạc cụ',
    'Thú cưng',
    'Khác',
  ];

  const featuredItems = Array.from({ length: 6 }, (_, i) => ({
    image: ``,
    name: `Đồ cũ #${i + 1}`,
    price: i % 2 === 0 ? 'Trao đổi' : `${(i + 1) * 10}.000đ`,
    id: i + 1,
  }));

  return (
    <>
      <div className="w-full space-y-4">
        <div className="rounded-lg overflow-hidden shadow-md">
          <CarouselComponent />
        </div>
        <div className="bg-white py-4 px-4 rounded-lg shadow-sm container mx-auto">
          <nav className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className="whitespace-nowrap bg-[#FFD2B2] text-amber-900 px-4 py-2 rounded-full hover:bg-amber-300 transition-colors"
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <section className="container mx-auto px-4 max-w-7xl w-full sm:w-[95%] lg:w-[90%] mt-8">
        <div className="flex flex-col space-y-8">
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Được quan tâm</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <ProductCard
                  id={item.id}
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                />
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Mới Đăng Gần Đây</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item, i) => (
                <ProductCard
                  id={item.id}
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                />
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="bg-amber-50 py-12 px-4 mt-8">
        <div className="container mx-auto w-full sm:w-[95%] lg:w-[90%] max-w-7xl">
          <h2 className="text-2xl font-bold text-amber-900 mb-8 text-center">Cách hoạt động</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold mb-2 text-amber-800">1. Đăng đồ bạn muốn trao đổi</h3>
              <p className="text-sm text-amber-700">Miễn phí và dễ dàng.</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2 text-amber-800">2. Tìm món bạn cần</h3>
              <p className="text-sm text-amber-700">Tìm kiếm theo khu vực hoặc danh mục.</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2 text-amber-800">3. Liên hệ & trao đổi</h3>
              <p className="text-sm text-amber-700">Thỏa thuận trực tiếp với người đăng.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
