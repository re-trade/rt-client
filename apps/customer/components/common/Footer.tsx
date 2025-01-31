const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
        <div>
          <h2 className="text-lg font-semibold">Vietnam Sea</h2>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Press</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Support</h2>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">FAQs</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Legal</h2>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Cookie Policy</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Follow Us</h2>
          <div className="mt-4 flex space-x-4">
            <a href="#" className="hover:underline">Facebook</a>
            <a href="#" className="hover:underline">Instagram</a>
            <a href="#" className="hover:underline">Twitter</a>
          </div>
        </div>
      </div>
      <div className="text-center mt-10 text-sm">
        <p>&copy; {new Date().getFullYear()} Vietnam Sea. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
