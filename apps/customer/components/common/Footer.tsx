import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandYoutube,
  IconChevronRight,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSend,
} from '@tabler/icons-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-white to-orange-50 border-t border-orange-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
                ReTrade
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Nền tảng thương mại điện tử hàng đầu, kết nối người mua và người bán với những sản
                phẩm chất lượng cao.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <IconMapPin size={18} className="text-orange-500 flex-shrink-0" />
                <span className="text-sm">
                  Tòa nhà Vietcomreal, 68 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. HCM
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <IconPhone size={18} className="text-orange-500 flex-shrink-0" />
                <span className="text-sm">1900 1234 (8:00 - 21:00)</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <IconMail size={18} className="text-orange-500 flex-shrink-0" />
                <span className="text-sm">support@retrade.vn</span>
              </div>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-6">Dịch vụ khách hàng</h3>
            <div className="space-y-3">
              {[
                'Trung tâm hỗ trợ',
                'Hướng dẫn mua hàng',
                'Hướng dẫn bán hàng',
                'Chính sách đổi trả',
                'Chính sách bảo hành',
                'Phương thức thanh toán',
                'Chính sách vận chuyển',
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors duration-200 text-sm group"
                >
                  <IconChevronRight
                    size={14}
                    className="text-orange-400 group-hover:translate-x-1 transition-transform duration-200"
                  />
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-6">Về ReTrade</h3>
            <div className="space-y-3">
              {[
                'Giới thiệu về chúng tôi',
                'Tuyển dụng',
                'Chính sách bảo mật',
                'Điều khoản dịch vụ',
                'Chính sách cookie',
                'Liên hệ truyền thông',
                'Bán hàng cùng ReTrade',
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors duration-200 text-sm group"
                >
                  <IconChevronRight
                    size={14}
                    className="text-orange-400 group-hover:translate-x-1 transition-transform duration-200"
                  />
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-6">Kết nối với chúng tôi</h3>

            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-4">
                Đăng ký nhận thông tin khuyến mãi và sản phẩm mới
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-2 border border-orange-200 rounded-lg
                 text-black focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm"
                />
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <IconSend size={16} />
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-gray-800 font-semibold mb-4">Theo dõi chúng tôi</p>
              <div className="flex gap-3">
                {[
                  { icon: IconBrandFacebook, href: '#', color: 'hover:bg-blue-600' },
                  { icon: IconBrandInstagram, href: '#', color: 'hover:bg-pink-600' },
                  { icon: IconBrandYoutube, href: '#', color: 'hover:bg-red-600' },
                  { icon: IconBrandTiktok, href: '#', color: 'hover:bg-black' },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 flex items-center justify-center bg-white border-2 border-orange-200 rounded-lg text-gray-600 hover:text-white ${social.color} transition-all duration-200 hover:scale-110 hover:shadow-lg`}
                  >
                    <social.icon size={20} />
                  </Link>
                ))}
              </div>
            </div>

            {/* App Download */}
            <div className="mt-6">
              <p className="text-gray-800 font-semibold mb-3">Tải ứng dụng</p>
              <div className="space-y-2">
                <button className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium">
                  Download on App Store
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium">
                  Get it on Google Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-orange-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm text-center lg:text-left">
              © {currentYear} ReTrade. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end gap-6 text-sm">
              {[
                'Chính sách bảo mật',
                'Điều khoản sử dụng',
                'Chính sách đổi trả',
                'Pháp lý',
                'Sơ đồ trang web',
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-200 whitespace-nowrap"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-t border-orange-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-center items-center gap-8 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">✓</span>
              </div>
              <span>Thanh toán an toàn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">⚡</span>
              </div>
              <span>Giao hàng nhanh chóng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">★</span>
              </div>
              <span>Chất lượng đảm bảo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
