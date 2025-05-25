// import Head from "next/head";
import CarouselComponent from "@/components/Carousel";
import Footer from "@/components/common/Footer";

export default function Home() {
  const categories = [
    "Quần áo",
    "Điện tử",
    "Nội thất",
    "Sách",
    "Đồ gia dụng",
    "Đồ chơi",
    "Thể thao",
    "Làm đẹp",
    "Thời trang",
    "Phụ kiện",
    "Xe cộ",
    "Văn phòng phẩm",
    "Nhạc cụ",
    "Thú cưng",
    "Khác",
    "Đồ gia dụng",
    "Đồ chơi",
    "Thể thao",
    "Làm đẹp",
    "Thời trang",
    "Phụ kiện",
    "Xe cộ",
    "Văn phòng phẩm",
    "Nhạc cụ",
    "Thú cưng",
    "Khác",
  ];
  const featuredItems = Array.from({ length: 6 }, (_, i) => ({
    title: `Đồ cũ #${i + 1}`,
    price: i % 2 === 0 ? "Trao đổi" : `${(i + 1) * 10}.000đ`,
  }));

  return (
    <>
      <div className="grid grid-cols-8 gap-6 mt-6 bg-white">
        <div className="col-span-1 hidden md:flex flex-col">
          <div className="flex-1 bg-white rounded p-4 flex items-center justify-center">
            <p className="text-amber-900 font-bold">Banner Left</p>
          </div>
        </div>

        <div className="col-span-8 md:col-span-6 flex flex-col gap-6 bg-orange">
          <CarouselComponent />

          <div className="bg-white py-4 px-2 rounded">
            <nav className="flex gap-4 overflow-x-auto px-2 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  className="whitespace-nowrap bg-[#FFD2B2] text-amber-900 px-4 py-2 rounded-full hover:bg-amber-300 transition"
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>

          <section className="bg-white p-4 shadow">
            <h2 className="text-xl font-bold text-amber-900 mb-3">
              Đồ đang được quan tâm
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {featuredItems.map((item, i) => (
                <div
                  key={i}
                  className="border rounded p-3 hover:shadow-md transition"
                >
                  <div className="bg-amber-100 h-40 mb-2 rounded" />
                  <h3 className="font-medium text-amber-800">{item.title}</h3>
                  <p className="text-amber-700 font-semibold">{item.price}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-4 shadow">
            <h2 className="text-xl font-bold text-amber-900 mb-3">
              Đồ đang được quan tâm
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {featuredItems.map((item, i) => (
                <div
                  key={i}
                  className="border rounded p-3 hover:shadow-md transition"
                >
                  <div className="bg-amber-100 h-40 mb-2 rounded" />
                  <h3 className="font-medium text-amber-800">{item.title}</h3>
                  <p className="text-amber-700 font-semibold">{item.price}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-1 hidden md:flex flex-col">
          <div className="flex-1 bg-white  rounded p-4 flex items-center justify-center">
            <p className="text-amber-900 font-bold">Banner Right</p>
          </div>
        </div>
      </div>

      <section className="bg-amber-50 p-6 mt-6 text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">
          Cách hoạt động
        </h2>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div>
            <h3 className="font-semibold mb-1 text-amber-800">
              1. Đăng đồ bạn muốn trao đổi
            </h3>
            <p className="text-sm text-amber-700">Miễn phí và dễ dàng.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1 text-amber-800">
              2. Tìm món bạn cần
            </h3>
            <p className="text-sm text-amber-700">
              Tìm kiếm theo khu vực hoặc danh mục.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1 text-amber-800">
              3. Liên hệ & trao đổi
            </h3>
            <p className="text-sm text-amber-700">
              Thỏa thuận trực tiếp với người đăng.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
