import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

function DiagonalBackground() {
  return (
    <div className="absolute inset-0 h-full w-full">
      {/* Mảng màu trái #FFD2B2 */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundColor: "#FFD2B2",
          clipPath: "polygon(0 0, 0 20%, 100% 0)",
        }}
      ></div>

      {/* Mảng màu phải #FDFEF9 */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundColor: "#FDFEF9",
          clipPath: "polygon(0 20%, 0 100%, 100% 100%, 100% 0)",
        }}
      ></div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative w-full py-12 h-[400px] ">
      {/* Background chéo */}
      <DiagonalBackground />

      <div className="relative max-w-[1440px] mx-auto px-6 grid grid-cols-4 gap-8 h-full pt-16">
        {/* Dịch vụ khách hàng */}
        <div>
          <h3 className="font-['Reddit_Sans'] font-semibold text-2xl text-[#121212] mb-4">
            {" "}
            Dịch vụ khách hàng
          </h3>
          <div className="flex flex-col gap-3">
            {[
              "Chính sách hỗ trợ khách hàng",
              "Hướng dẫn Mua hàng/ Đặt hàng",
              "Hướng dẫn bán hàng",
              "Trả hàng/ Hoàn tiền",
              "Chính sách bảo hành",
              "Đơn vị vận chuyển",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="font-['Reddit_Sans'] font-normal text-1.5xl text-[#121212] hover:text-[#525252]"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Về chúng tôi */}
        <div>
          <h3 className="font-['Reddit_Sans'] font-semibold text-2xl text-base text-[#121212] mb-4">
            Về chúng tôi
          </h3>
          <div className="flex flex-col gap-3">
            {[
              "Về Retrade Shop",
              "Tuyển dụng",
              "Chính sách bảo mật",
              "Kênh người bán",
              "Tiếp thị liên kết",
              "Liên hệ truyền thông",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="font-['Reddit_Sans'] font-normal text-1.5xl text-[#121212] hover:text-[#525252]"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Liên hệ chúng tôi */}
        <div>
          <h3 className="font-['Reddit_Sans'] font-semibold text-2xl text-[#121212] mb-4">
            Liên hệ chúng tôi
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="w-5 h-5 text-[#121212]" />
            <span className="font-['Reddit_Sans'] font-normal  text-1.5xl text-[#121212]">
              Tòa nhà Vietcomreal, 68 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.
              HCM
            </span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <FaEnvelope className="w-5 h-5 text-[#121212]" />
            <span className="font-['Reddit_Sans'] font-normal text-1.5xl text-[#121212]">
              retradeshopsupport@gmail.com
            </span>
          </div>
          <h3 className="font-['Reddit_Sans'] font-semibold text-base text-[#121212] mb-4">
            Theo dõi chúng tôi tại
          </h3>
          <div className="flex gap-4">
            {[
              { icon: FaFacebookF, href: "#" },
              { icon: FaInstagram, href: "#" },
              { icon: FaYoutube, href: "#" },
              { icon: FaTiktok, href: "#" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="w-10 h-10 flex items-center justify-center border border-[#525252] rounded-full hover:bg-[#8C8C8C] transition-colors"
              >
                <social.icon className="w-5 h-5 text-[#121212]" />
              </a>
            ))}
          </div>
        </div>

        {/* Liên hệ hỗ trợ */}
        <div>
          <h3 className="font-['Reddit_Sans'] font-semibold text-2xl text-[#121212] mb-4">
            Liên hệ hỗ trợ
          </h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Tên tài khoản"
              className="w-full h-9 border border-[#121212] rounded-xl opacity-50 font-['Reddit_Sans'] text-sm text-[#121212] px-3"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full h-9 border border-[#121212] rounded-xl opacity-50 font-['Reddit_Sans'] text-sm text-[#121212] px-3"
            />
            <button className="w-[107px] h-9 bg-[#FFD2B2] rounded-full font-['Reddit_Sans'] font-medium text-xs text-[#121212] flex items-center justify-center">
              Gửi
            </button>
          </div>
        </div>
      </div>

      {/* Phần dưới cùng */}
      <div className="relative max-w-[1440px] mx-auto px-6 mt-12 pt-6 border-t border-[#525252]/20 flex justify-between items-center text-[#525252] font-['Reddit_Sans'] text-[10px]">
        <span>© 2021 All Rights Reserved</span>
        <div className="flex gap-6">
          {[
            "Privacy Policy",
            "Terms of Use",
            "Sales and Refunds",
            "Legal",
            "Site Map",
          ].map((item) => (
            <a key={item} href="#" className="hover:text-[#121212]">
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
