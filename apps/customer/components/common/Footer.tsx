const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-sm text-gray-100">
      <div className="max-w-7xl mx-auto py-10 px-6">
        <h1 className="text-lg font-semibold text-gray-200 mb-8">ReTrade</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          <div>
            <h2 className="text-xs font-bold uppercase text-gray-100">
              Customer Service
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  How to Buy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Return & Refund
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase text-gray-100">
              About Us
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  About ReTrade
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase text-gray-100">
              Payment
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Cash on Delivery
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Bank Transfer
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  E-Wallet
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase text-gray-100">
              Follow Us
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Tiktok
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-8 py-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} ReTrade. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
