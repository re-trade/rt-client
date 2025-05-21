import Head from 'next/head';

export default function Home() {
  const categories = ['Quần áo', 'Điện tử', 'Nội thất', 'Sách', 'Đồ gia dụng'];
  const featuredItems = Array.from({ length: 6 }, (_, i) => ({
    title: `Đồ cũ #${i + 1}`,
    price: i % 2 === 0 ? 'Trao đổi' : `${(i + 1) * 10}.000đ`,
  }));

  return (
    <>
      <Head>
        <title>Trao Đổi Đồ Cũ</title>
      </Head>

      {/* Navbar */}
      <nav className="bg-amber-900 text-white px-4 py-3 flex justify-between items-center shadow">
        <div className="text-xl font-bold">Đổi Đồ Cũ</div>
        <input
          type="text"
          placeholder="Tìm kiếm đồ cũ..."
          className="px-3 py-1 rounded w-1/2 text-black"
        />
        <div className="space-x-4">
          <button className="hover:underline">Đăng nhập</button>
          <button className="bg-white text-amber-900 px-3 py-1 rounded font-semibold">
            Đăng tin
          </button>
        </div>
      </nav>

      {/* Banner */}
      <div className="h-64 bg-amber-200 flex flex-col justify-center items-center text-center p-4">
        <h1 className="text-4xl font-bold text-amber-900 mb-2">
          Biến đồ cũ thành món quà cho người khác!
        </h1>
        <p className="text-lg text-amber-800">Đăng đồ bạn không dùng nữa và tìm món bạn cần</p>
      </div>

      {/* Categories */}
      <section className="bg-white p-4 shadow mt-4">
        <h2 className="text-xl font-bold text-amber-900 mb-3">Danh mục phổ biến</h2>
        <div className="flex gap-4 overflow-x-auto">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="min-w-[100px] text-center p-3 bg-amber-100 rounded hover:bg-amber-200 cursor-pointer"
            >
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 border" />
              <p className="text-sm text-amber-800">{cat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Items */}
      <section className="bg-white p-4 mt-6 shadow">
        <h2 className="text-xl font-bold text-amber-900 mb-3">Đồ đang được quan tâm</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {featuredItems.map((item, i) => (
            <div key={i} className="border rounded p-3 hover:shadow-md transition">
              <div className="bg-amber-100 h-32 mb-2 rounded" />
              <h3 className="font-medium text-amber-800">{item.title}</h3>
              <p className="text-amber-700 font-semibold">{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-amber-50 p-6 mt-6 text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Cách hoạt động</h2>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div>
            <h3 className="font-semibold mb-1 text-amber-800">1. Đăng đồ bạn muốn trao đổi</h3>
            <p className="text-sm text-amber-700">Miễn phí và dễ dàng.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1 text-amber-800">2. Tìm món bạn cần</h3>
            <p className="text-sm text-amber-700">Tìm kiếm theo khu vực hoặc danh mục.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1 text-amber-800">3. Liên hệ & trao đổi</h3>
            <p className="text-sm text-amber-700">Thỏa thuận trực tiếp với người đăng.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-white p-4 text-center mt-10">
        &copy; {new Date().getFullYear()} Đổi Đồ Cũ. Một sản phẩm vì cộng đồng.
      </footer>
    </>
  );
}
