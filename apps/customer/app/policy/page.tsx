'use client';

import {
  ChevronRight,
  Cookie,
  Eye,
  FileText,
  Home,
  RefreshCw,
  Shield,
  ShoppingBag,
  Truck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PolicyPage() {
  const [activeSection, setActiveSection] = useState<string>('privacy');

  const policyNavItems = [
    { id: 'privacy', label: 'Chính sách bảo mật', icon: <Shield className="w-5 h-5" /> },
    { id: 'terms', label: 'Điều khoản dịch vụ', icon: <FileText className="w-5 h-5" /> },
    { id: 'return', label: 'Chính sách đổi trả', icon: <RefreshCw className="w-5 h-5" /> },
    { id: 'shipping', label: 'Chính sách vận chuyển', icon: <Truck className="w-5 h-5" /> },
    { id: 'cookie', label: 'Chính sách cookie', icon: <Cookie className="w-5 h-5" /> },
    { id: 'user', label: 'Thỏa thuận người dùng', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-orange-600 font-medium">Chính sách & Điều khoản</span>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-2xl">
              <Eye className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Chính sách & Điều khoản</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
            Tìm hiểu về các chính sách, điều khoản và quy định của ReTrade - nền tảng mua bán đồ cũ
            an toàn và minh bạch, kết nối cộng đồng yêu thích đồ cũ.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Danh mục chính sách
              </h3>
              <nav className="space-y-2">
                {policyNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    <span className={activeSection === item.id ? 'text-white' : 'text-orange-500'}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-8">
              {activeSection === 'privacy' && <PrivacyPolicyContent />}
              {activeSection === 'terms' && <TermsOfServiceContent />}
              {activeSection === 'return' && <ReturnPolicyContent />}
              {activeSection === 'shipping' && <ShippingPolicyContent />}
              {activeSection === 'cookie' && <CookiePolicyContent />}
              {activeSection === 'user' && <UserAgreementContent />}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-t border-orange-200 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-orange-500 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Cần hỗ trợ thêm?</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Nếu bạn có bất kỳ câu hỏi nào về các chính sách của chúng tôi, đừng ngần ngại liên hệ
            với đội ngũ hỗ trợ khách hàng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Liên hệ hỗ trợ
            </Link>
            <Link
              href="/help"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium border border-orange-200 hover:bg-orange-50 transition-all duration-200"
            >
              Trung tâm trợ giúp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Privacy Policy Content Component
function PrivacyPolicyContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Shield className="w-6 h-6 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 m-0">Chính sách bảo mật</h2>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
        <p className="text-gray-700 m-0">
          <strong>Cập nhật lần cuối:</strong> {new Date().toLocaleDateString('vi-VN')}
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Thu thập thông tin</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            ReTrade thu thập thông tin cá nhân của bạn khi bạn đăng ký tài khoản, đăng bán đồ cũ,
            thực hiện giao dịch, hoặc tương tác với cộng đồng mua bán đồ cũ. Các thông tin này bao
            gồm:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Thông tin cá nhân: Họ tên, email, số điện thoại, địa chỉ</li>
            <li>Thông tin giao dịch: Lịch sử mua bán đồ cũ, phương thức thanh toán</li>
            <li>Thông tin kỹ thuật: Địa chỉ IP, loại thiết bị, trình duyệt</li>
            <li>Thông tin hành vi: Cách bạn sử dụng website, sở thích về đồ cũ</li>
            <li>Thông tin sản phẩm: Ảnh, mô tả đồ cũ bạn đăng bán</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Sử dụng thông tin</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Chúng tôi sử dụng thông tin cá nhân của bạn để:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Xử lý giao dịch mua bán đồ cũ và cung cấp dịch vụ khách hàng</li>
            <li>Cải thiện trải nghiệm người dùng và gợi ý đồ cũ phù hợp</li>
            <li>Gửi thông báo về giao dịch, khuyến mãi và cập nhật dịch vụ</li>
            <li>Phân tích và nghiên cứu để phát triển nền tảng mua bán đồ cũ</li>
            <li>Đảm bảo an toàn và bảo mật cho cộng đồng ReTrade</li>
            <li>Kiểm duyệt sản phẩm đồ cũ để đảm bảo chất lượng</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Chia sẻ thông tin</h3>
          <p className="text-gray-600 leading-relaxed">
            ReTrade cam kết không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ
            ba mà không có sự đồng ý của bạn, trừ các trường hợp sau:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-4">
            <li>Với người mua/người bán để hoàn thành giao dịch đồ cũ</li>
            <li>Với các đối tác dịch vụ để xử lý giao dịch (vận chuyển, thanh toán)</li>
            <li>Khi được yêu cầu bởi pháp luật hoặc cơ quan có thẩm quyền</li>
            <li>Để bảo vệ quyền lợi và an toàn của cộng đồng ReTrade</li>
            <li>Để kiểm duyệt và đảm bảo chất lượng sản phẩm đồ cũ</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">4. Bảo mật thông tin</h3>
          <p className="text-gray-600 leading-relaxed">
            Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ thông tin
            cá nhân của bạn khỏi việc truy cập, sử dụng, tiết lộ, thay đổi hoặc phá hủy trái phép.
            Tuy nhiên, không có phương thức truyền tải qua Internet nào là hoàn toàn an toàn 100%.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">5. Quyền của người dùng</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Bạn có các quyền sau đối với thông tin cá nhân của mình:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Quyền truy cập và xem thông tin cá nhân</li>
            <li>Quyền chỉnh sửa hoặc cập nhật thông tin</li>
            <li>Quyền xóa tài khoản và thông tin cá nhân</li>
            <li>Quyền từ chối nhận email marketing</li>
            <li>Quyền khiếu nại về việc xử lý dữ liệu</li>
            <li>Quyền quản lý sản phẩm đồ cũ đã đăng bán</li>
            <li>Quyền xem lịch sử giao dịch mua bán đồ cũ</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

// Terms of Service Content Component
function TermsOfServiceContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <FileText className="w-6 h-6 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 m-0">Điều khoản dịch vụ</h2>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
        <p className="text-gray-700 m-0">
          <strong>Có hiệu lực từ:</strong> {new Date().toLocaleDateString('vi-VN')}
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Chấp nhận điều khoản</h3>
          <p className="text-gray-600 leading-relaxed">
            Bằng việc truy cập và sử dụng nền tảng ReTrade - nền tảng mua bán đồ cũ, bạn đồng ý tuân
            thủ và bị ràng buộc bởi các điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ
            phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Mô tả dịch vụ</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            ReTrade là nền tảng mua bán đồ cũ chuyên nghiệp cho phép người dùng:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Mua và bán các sản phẩm đồ cũ chất lượng, đã qua sử dụng</li>
            <li>Tạo và quản lý tài khoản cá nhân với hồ sơ mua bán</li>
            <li>Tương tác với người dùng khác thông qua hệ thống nhắn tin</li>
            <li>Đánh giá và nhận xét về sản phẩm đồ cũ và người bán</li>
            <li>Sử dụng các dịch vụ thanh toán và vận chuyển linh hoạt</li>
            <li>Tham gia cộng đồng yêu thích đồ cũ và bảo vệ môi trường</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Đăng ký tài khoản</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Để sử dụng đầy đủ các tính năng của ReTrade, bạn cần:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Cung cấp thông tin chính xác và đầy đủ khi đăng ký</li>
            <li>Duy trì tính bảo mật của tài khoản và mật khẩu</li>
            <li>Chịu trách nhiệm cho tất cả hoạt động dưới tài khoản của bạn</li>
            <li>Thông báo ngay cho chúng tôi nếu phát hiện việc sử dụng trái phép</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">4. Quy tắc sử dụng</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Khi sử dụng ReTrade, bạn cam kết không:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Đăng bán các sản phẩm đồ cũ bị cấm hoặc vi phạm pháp luật</li>
            <li>Cung cấp thông tin sai lệch về tình trạng đồ cũ hoặc bản thân</li>
            <li>Sử dụng ngôn ngữ không phù hợp hoặc có tính chất xúc phạm</li>
            <li>Thực hiện các hành vi gian lận hoặc lừa đảo khi mua bán đồ cũ</li>
            <li>Vi phạm quyền sở hữu trí tuệ của bên thứ ba</li>
            <li>Sử dụng bot hoặc công cụ tự động để thao tác hệ thống</li>
            <li>Đăng bán đồ cũ không đúng tình trạng thực tế</li>
            <li>Gian lận về giá trị hoặc chất lượng đồ cũ</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">5. Giao dịch và thanh toán</h3>
          <p className="text-gray-600 leading-relaxed">
            ReTrade đóng vai trò là nền tảng kết nối người mua và người bán đồ cũ. Chúng tôi không
            chịu trách nhiệm về chất lượng đồ cũ, tính chính xác của mô tả tình trạng, hoặc khả năng
            thực hiện giao dịch của các bên. Tuy nhiên, chúng tôi cung cấp các công cụ và dịch vụ hỗ
            trợ để đảm bảo giao dịch mua bán đồ cũ diễn ra thuận lợi và an toàn.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">6. Chấm dứt dịch vụ</h3>
          <p className="text-gray-600 leading-relaxed">
            ReTrade có quyền tạm ngừng hoặc chấm dứt tài khoản của bạn nếu phát hiện vi phạm các
            điều khoản này hoặc có hành vi có thể gây hại đến nền tảng mua bán đồ cũ và cộng đồng
            người dùng. Bạn cũng có thể tự nguyện đóng tài khoản bất cứ lúc nào.
          </p>
        </section>
      </div>
    </div>
  );
}

function ReturnPolicyContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <RefreshCw className="w-6 h-6 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 m-0">Chính sách đổi trả</h2>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
        <p className="text-gray-700 m-0">
          <strong>Áp dụng cho tất cả giao dịch từ:</strong> {new Date().toLocaleDateString('vi-VN')}
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Điều kiện đổi trả</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            ReTrade hỗ trợ đổi trả đồ cũ trong các trường hợp sau:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Đồ cũ không đúng như mô tả tình trạng của người bán</li>
            <li>Đồ cũ bị hư hỏng thêm trong quá trình vận chuyển</li>
            <li>Nhận nhầm đồ cũ khác với đơn hàng đã đặt</li>
            <li>Đồ cũ có lỗi kỹ thuật không được thông báo trước</li>
            <li>Tình trạng đồ cũ kém hơn so với mô tả ban đầu</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Thời hạn đổi trả</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
            <p className="text-blue-800 font-semibold m-0">
              Thời hạn đổi trả: 7 ngày kể từ khi nhận hàng
            </p>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Bạn có tối đa 7 ngày để yêu cầu đổi trả kể từ ngày nhận được sản phẩm. Sau thời hạn này,
            chúng tôi sẽ không thể hỗ trợ xử lý yêu cầu đổi trả.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Quy trình đổi trả</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Bước 1: Liên hệ người bán</h4>
              <p className="text-gray-600 text-sm">
                Liên hệ trực tiếp với người bán qua tin nhắn để thông báo vấn đề và yêu cầu đổi trả.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Bước 2: Cung cấp bằng chứng</h4>
              <p className="text-gray-600 text-sm">
                Gửi hình ảnh và mô tả chi tiết vấn đề của sản phẩm cho người bán.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Bước 3: Thỏa thuận giải pháp</h4>
              <p className="text-gray-600 text-sm">
                Thảo luận với người bán về cách thức đổi trả, hoàn tiền hoặc giải pháp khác.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Bước 4: Thực hiện đổi trả</h4>
              <p className="text-gray-600 text-sm">
                Thực hiện đổi trả theo thỏa thuận. Nếu không thể giải quyết, liên hệ ReTrade hỗ trợ.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">4. Chi phí đổi trả</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-orange-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Trường hợp
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Chi phí vận chuyển
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">Lỗi từ người bán</td>
                  <td className="border border-gray-300 px-4 py-3 text-green-600 font-medium">
                    Miễn phí
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">Hư hỏng do giao hàng</td>
                  <td className="border border-gray-300 px-4 py-3 text-green-600 font-medium">
                    Người bán chịu trách nhiệm
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">Đổi ý của người mua</td>
                  <td className="border border-gray-300 px-4 py-3 text-orange-600 font-medium">
                    Người mua chịu
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">5. Hoàn tiền</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Sau khi nhận và kiểm tra sản phẩm trả lại, chúng tôi sẽ xử lý hoàn tiền theo quy trình
            sau:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Hoàn tiền qua phương thức thanh toán ban đầu trong vòng 3-5 ngày làm việc</li>
            <li>Đối với thanh toán bằng tiền mặt: hoàn tiền vào ví ReTrade</li>
            <li>Phí dịch vụ (nếu có) sẽ được hoàn lại theo chính sách cụ thể</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            6. Sản phẩm không được đổi trả
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-semibold mb-3">
              Các sản phẩm sau không áp dụng chính sách đổi trả:
            </p>
            <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
              <li>Sản phẩm đã qua sử dụng với dấu hiệu hư hỏng do người mua</li>
              <li>Sản phẩm vệ sinh cá nhân</li>
              <li>Sản phẩm có giá trị dưới 50,000 VNĐ (trừ lỗi từ người bán)</li>
              <li>Sản phẩm được bán với điều kiện "không đổi trả"</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function ShippingPolicyContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Truck className="w-6 h-6 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 m-0">Chính sách vận chuyển</h2>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
        <p className="text-gray-700 m-0">
          <strong>Cập nhật:</strong> {new Date().toLocaleDateString('vi-VN')} |
          <strong className="ml-4">Áp dụng toàn quốc</strong>
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Phương thức giao hàng</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Trên ReTrade, người bán chịu trách nhiệm giao hàng trực tiếp đến người mua. Điều này
            giúp tạo ra sự linh hoạt và tiết kiệm chi phí cho cả hai bên:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Giao hàng tận nơi</h4>
              <p className="text-gray-600 text-sm">
                Người bán giao hàng trực tiếp đến địa chỉ của bạn
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Hẹn gặp trực tiếp</h4>
              <p className="text-gray-600 text-sm">
                Thỏa thuận địa điểm gặp mặt thuận tiện cho cả hai bên
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Dịch vụ ship</h4>
              <p className="text-gray-600 text-sm">
                Người bán có thể sử dụng dịch vụ ship theo thỏa thuận
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            2. Thời gian và phí giao hàng
          </h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Thời gian và phí giao hàng được thỏa thuận trực tiếp giữa người mua và người bán.
            ReTrade khuyến khích các bên thảo luận rõ ràng về các điều khoản này trước khi hoàn tất
            giao dịch.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-3">⏰ Thời gian giao hàng</h4>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>• Được thỏa thuận giữa người mua và người bán</li>
                <li>• Thường từ 1-3 ngày tùy theo khoảng cách</li>
                <li>• Có thể giao ngay nếu gặp trực tiếp</li>
                <li>• Linh hoạt theo lịch trình của cả hai bên</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-3">💰 Phí giao hàng</h4>
              <ul className="text-green-700 space-y-2 text-sm">
                <li>• Miễn phí nếu gặp trực tiếp</li>
                <li>• Chi phí ship thực tế nếu sử dụng dịch vụ</li>
                <li>• Có thể thỏa thuận chia sẻ chi phí</li>
                <li>• Hiển thị rõ ràng trong thông tin sản phẩm</li>
              </ul>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <p className="text-yellow-800 text-sm">
              <strong>💡 Lưu ý:</strong> ReTrade khuyến khích người mua và người bán thỏa thuận rõ
              ràng về thời gian, địa điểm và phí giao hàng trước khi xác nhận đơn hàng để tránh hiểu
              lầm.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Trách nhiệm của các bên</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-3">👤 Trách nhiệm người bán</h4>
              <ul className="text-green-700 space-y-2 text-sm">
                <li>• Đóng gói sản phẩm cẩn thận, an toàn</li>
                <li>• Giao hàng đúng thời gian đã thỏa thuận</li>
                <li>• Thông báo kịp thời nếu có thay đổi</li>
                <li>• Đảm bảo sản phẩm đúng như mô tả</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-3">� Trách nhiệm người mua</h4>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>• Cung cấp địa chỉ nhận hàng chính xác</li>
                <li>• Có mặt tại thời gian đã hẹn</li>
                <li>• Kiểm tra hàng hóa khi nhận</li>
                <li>• Thanh toán đúng số tiền đã thỏa thuận</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">4. Quy trình giao nhận</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h5 className="font-semibold text-gray-800">Xác nhận đơn hàng</h5>
                <p className="text-gray-600 text-sm">
                  Người bán xác nhận đơn hàng và thỏa thuận thời gian, địa điểm giao hàng
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h5 className="font-semibold text-gray-800">Chuẩn bị hàng hóa</h5>
                <p className="text-gray-600 text-sm">
                  Người bán đóng gói cẩn thận và chuẩn bị giao hàng theo thỏa thuận
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h5 className="font-semibold text-gray-800">Giao hàng</h5>
                <p className="text-gray-600 text-sm">
                  Người bán giao hàng trực tiếp hoặc qua dịch vụ ship đã thỏa thuận
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h5 className="font-semibold text-gray-800">Nhận hàng và xác nhận</h5>
                <p className="text-gray-600 text-sm">
                  Người mua kiểm tra hàng hóa và xác nhận hoàn thành giao dịch
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">5. Lưu ý quan trọng</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <ul className="text-yellow-800 space-y-2">
              <li>• Thỏa thuận rõ ràng về thời gian, địa điểm và phí giao hàng trước khi mua</li>
              <li>• Cung cấp thông tin liên hệ chính xác để người bán có thể liên lạc</li>
              <li>• Kiểm tra kỹ hàng hóa ngay khi nhận và báo ngay nếu có vấn đề</li>
              <li>• Giữ liên lạc với người bán trong suốt quá trình giao dịch</li>
              <li>• Liên hệ ReTrade nếu gặp tranh chấp không thể giải quyết</li>
              <li>• Đánh giá trung thực về người bán sau khi hoàn thành giao dịch</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function CookiePolicyContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Cookie className="w-6 h-6 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 m-0">Chính sách cookie</h2>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
        <p className="text-gray-700 m-0">
          <strong>Hiệu lực:</strong> {new Date().toLocaleDateString('vi-VN')} |
          <strong className="ml-4">Áp dụng cho tất cả người dùng</strong>
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Cookie là gì?</h3>
          <p className="text-gray-600 leading-relaxed">
            Cookie là các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi bạn truy cập
            website. Chúng giúp website ghi nhớ thông tin về lần truy cập của bạn, làm cho lần truy
            cập tiếp theo dễ dàng hơn và website trở nên hữu ích hơn đối với bạn.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            2. Các loại cookie chúng tôi sử dụng
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-3">🔧 Cookie cần thiết</h4>
              <p className="text-blue-700 text-sm mb-3">
                Những cookie này cần thiết để website hoạt động và không thể tắt trong hệ thống của
                chúng tôi.
              </p>
              <ul className="text-blue-600 text-sm space-y-1">
                <li>• Đăng nhập và xác thực</li>
                <li>• Giỏ hàng và thanh toán</li>
                <li>• Bảo mật website</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-3">📊 Cookie phân tích</h4>
              <p className="text-green-700 text-sm mb-3">
                Giúp chúng tôi hiểu cách người dùng tương tác với website để cải thiện trải nghiệm.
              </p>
              <ul className="text-green-600 text-sm space-y-1">
                <li>• Google Analytics</li>
                <li>• Thống kê lượt truy cập</li>
                <li>• Phân tích hành vi người dùng</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-800 mb-3">🎯 Cookie marketing</h4>
              <p className="text-purple-700 text-sm mb-3">
                Được sử dụng để hiển thị quảng cáo phù hợp với sở thích của bạn.
              </p>
              <ul className="text-purple-600 text-sm space-y-1">
                <li>• Facebook Pixel</li>
                <li>• Google Ads</li>
                <li>• Quảng cáo được cá nhân hóa</li>
              </ul>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h4 className="font-semibold text-orange-800 mb-3">⚙️ Cookie tùy chỉnh</h4>
              <p className="text-orange-700 text-sm mb-3">
                Ghi nhớ các tùy chọn của bạn để cải thiện trải nghiệm sử dụng.
              </p>
              <ul className="text-orange-600 text-sm space-y-1">
                <li>• Ngôn ngữ hiển thị</li>
                <li>• Sở thích cá nhân</li>
                <li>• Cài đặt giao diện</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Quản lý cookie</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Bạn có thể kiểm soát và quản lý cookie theo nhiều cách khác nhau:
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-3">Cài đặt trình duyệt</h4>
            <p className="text-gray-600 text-sm mb-3">
              Hầu hết các trình duyệt cho phép bạn kiểm soát cookie thông qua cài đặt:
            </p>
            <ul className="text-gray-600 text-sm space-y-1 ml-4">
              <li>• Chặn tất cả cookie</li>
              <li>• Chỉ chấp nhận cookie từ website hiện tại</li>
              <li>• Xóa cookie khi đóng trình duyệt</li>
              <li>• Nhận thông báo trước khi cookie được lưu</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">4. Tác động khi tắt cookie</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800 font-semibold mb-3">⚠️ Lưu ý quan trọng</p>
            <p className="text-yellow-700 text-sm mb-3">
              Việc tắt cookie có thể ảnh hưởng đến trải nghiệm sử dụng website:
            </p>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Không thể duy trì trạng thái đăng nhập</li>
              <li>• Giỏ hàng có thể bị mất khi chuyển trang</li>
              <li>• Một số tính năng có thể không hoạt động</li>
              <li>• Cần nhập lại thông tin nhiều lần</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function UserAgreementContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Users className="w-6 h-6 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 m-0">Thỏa thuận người dùng</h2>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
        <p className="text-gray-700 m-0">
          <strong>Phiên bản:</strong> 2.0 | <strong>Ngày cập nhật:</strong>{' '}
          {new Date().toLocaleDateString('vi-VN')}
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Cam kết của ReTrade</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-3">🛡️ An toàn & Bảo mật</h4>
              <ul className="text-green-700 text-sm space-y-2">
                <li>• Bảo vệ thông tin cá nhân tuyệt đối</li>
                <li>• Hệ thống thanh toán an toàn</li>
                <li>• Kiểm duyệt đồ cũ nghiêm ngặt</li>
                <li>• Hỗ trợ 24/7 khi có vấn đề</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-3">⭐ Chất lượng dịch vụ</h4>
              <ul className="text-blue-700 text-sm space-y-2">
                <li>• Giao diện thân thiện, dễ sử dụng</li>
                <li>• Tìm kiếm đồ cũ thông minh và chính xác</li>
                <li>• Giao dịch trực tiếp, linh hoạt</li>
                <li>• Chính sách đổi trả phù hợp với đồ cũ</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Quyền lợi của người dùng</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">
                ✓
              </div>
              <div>
                <h5 className="font-semibold text-gray-800">Mua bán đồ cũ miễn phí</h5>
                <p className="text-gray-600 text-sm">
                  Không mất phí đăng ký, duyệt đồ cũ và thực hiện giao dịch
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">
                ✓
              </div>
              <div>
                <h5 className="font-semibold text-gray-800">Bảo vệ quyền lợi</h5>
                <p className="text-gray-600 text-sm">
                  Được bảo vệ bởi chính sách đổi trả và hoàn tiền phù hợp với đồ cũ
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">
                ✓
              </div>
              <div>
                <h5 className="font-semibold text-gray-800">Hỗ trợ tận tình</h5>
                <p className="text-gray-600 text-sm">
                  Đội ngũ CSKH chuyên nghiệp, hiểu rõ đặc thù mua bán đồ cũ
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            3. Trách nhiệm của người dùng
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h4 className="font-semibold text-red-800 mb-3">📋 Cam kết tuân thủ</h4>
            <ul className="text-red-700 text-sm space-y-2">
              <li>• Cung cấp thông tin chính xác khi đăng ký</li>
              <li>• Không sử dụng tài khoản cho mục đích bất hợp pháp</li>
              <li>• Tôn trọng quyền lợi của người bán và người mua khác</li>
              <li>• Báo cáo kịp thời các hành vi vi phạm</li>
              <li>• Tuân thủ các quy định về thanh toán và giao nhận</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">4. Chương trình khuyến mãi</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            ReTrade thường xuyên tổ chức các chương trình ưu đãi dành cho người dùng:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <h5 className="font-semibold text-purple-800 mb-2">🎁 Thành viên mới</h5>
              <p className="text-purple-600 text-sm">Voucher 50k cho đơn hàng đầu tiên</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <h5 className="font-semibold text-blue-800 mb-2">💎 Thành viên VIP</h5>
              <p className="text-blue-600 text-sm">Miễn phí ship và ưu đãi độc quyền</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <h5 className="font-semibold text-green-800 mb-2">🏆 Người bán xuất sắc</h5>
              <p className="text-green-600 text-sm">Giảm phí dịch vụ và hỗ trợ marketing</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">5. Liên hệ và hỗ trợ</h3>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <p className="text-orange-800 font-semibold mb-4">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn!
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-orange-700 font-medium">📞 Hotline: 1900 1234</p>
                <p className="text-orange-600">Thời gian: 8:00 - 21:00 hàng ngày</p>
              </div>
              <div>
                <p className="text-orange-700 font-medium">✉️ Email: support@retrade.vn</p>
                <p className="text-orange-600">Phản hồi trong vòng 24 giờ</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
