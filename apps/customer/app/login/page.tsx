import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen bg-blue-600 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-2">
            <Image
              src="https://statictuoitre.mediacdn.vn/thumb_w/730/2017/2-1512755474917.jpg" 
              alt="Retrade Shop Logo"
              width={30}
              height={30}
            />
            <span className="text-lg font-bold">Retrade Shop</span>
            <span className="text-lg">Đăng nhập</span>
          </div>
          <Link href="#" className="text-sm hover:underline">
            Bạn cần giúp đỡ?
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Left Side: Logo and Slogan */}
          <div className="md:w-1/2 text-white text-center md:text-left mb-6 md:mb-0">
            <div className="flex justify-center md:justify-start items-center space-x-4">
              <Image
                src="https://statictuoitre.mediacdn.vn/thumb_w/730/2017/3-1512755474923.jpg" // Replace with Retrade Shop logo
                alt="Retrade Shop Logo"
                width={100}
                height={100}
              />
              <h1 className="text-5xl font-bold">Retrade Shop</h1>
            </div>
            <p className="mt-4 text-lg">
              Nền tảng thương mại điện tử được yêu thích ở Đông Nam Á & Đài Loan
            </p>
          </div>

          {/* Right Side: Login Form */}
          <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Đăng nhập</h2>
            <div className="flex justify-between items-center mb-4">
              <span>Đăng nhập với mã</span>
              <div className="flex space-x-2">
                <button className="text-yellow-500">QR</button>
                <button>
                  <Image
                    src="https://statictuoitre.mediacdn.vn/thumb_w/730/2017/3-1512755474923.jpg" // Replace with QR icon
                    alt="QR Code"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
            <input
              type="text"
              placeholder="Email/Số điện thoại/Tên đăng nhập"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button className="w-full bg-[#fb5533] text-white py-2 rounded hover:bg-[#e64829]">
              ĐĂNG NHẬP
            </button>
            <a href="#" className="block text-sm text-blue-600 mt-2 hover:underline">
              Quên mật khẩu
            </a>
            <div className="flex items-center my-4">
              <hr className="flex-1 border-gray-300" />
              <span className="mx-2 text-gray-500">HOẶC</span>
              <hr className="flex-1 border-gray-300" />
            </div>
            <div className="flex justify-between">
              <button className="flex-1 flex items-center justify-center bg-blue-600 text-white py-2 rounded mr-2 hover:bg-blue-700">
                <Image
                  src="/Facebook_icon.svg.png" 
                  alt="Facebook"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Facebook
              </button>
              <button className="flex-1 flex items-center justify-center bg-gray-100 text-black py-2 rounded hover:bg-gray-200">
                <Image
                  src="/Google__G__logo.svg.png" 
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Google
              </button>
            </div>
            <p className="text-center mt-4 text-sm">
              Bạn mới biết đến Retrade Shop?{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Đăng ký
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}