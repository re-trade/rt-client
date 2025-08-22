import { ShoppingCart, User } from 'lucide-react';

interface ProfileViewSwitcherProps {
  profileView: 'seller' | 'customer';
  onProfileViewChange: (view: 'seller' | 'customer') => void;
}

const ProfileViewSwitcher = ({ profileView, onProfileViewChange }: ProfileViewSwitcherProps) => {
  return (
    <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-200 shadow-sm w-fit overflow-hidden">
      <button
        onClick={() => onProfileViewChange('seller')}
        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
          profileView === 'seller'
            ? 'bg-orange-500 text-white shadow-md'
            : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
        }`}
      >
        <ShoppingCart className="h-4 w-4" />
        <span className="hidden sm:inline">Hồ sơ bán hàng</span>
        <span className="sm:hidden">Bán hàng</span>
      </button>
      <button
        onClick={() => onProfileViewChange('customer')}
        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
          profileView === 'customer'
            ? 'bg-orange-500 text-white shadow-md'
            : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
        }`}
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Hồ sơ khách hàng</span>
        <span className="sm:hidden">Khách hàng</span>
      </button>
    </div>
  );
};

export default ProfileViewSwitcher;
