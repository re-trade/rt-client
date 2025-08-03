'use client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/use-auth';
import { IconLogout, IconPackage, IconShoppingCart, IconUser, IconBuildingStore } from '@tabler/icons-react';
import Link from 'next/link';
import { SELLER_ROUTES } from '@/lib/constants';

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const MobileMenu = ({ open, setOpen }: Props) => {
  const { auth, logout, roles } = useAuth();
  const { cartGroups } = useCart();

  const totalCartItems = Object.values(cartGroups || {}).reduce(
    (total, shop) => total + (shop.items?.length || 0),
    0,
  );

  if (!open) return null;

  return (
    <div className="lg:hidden bg-white border-t border-orange-200 shadow-lg">
      <div className="px-4 py-6 space-y-4">
        <div className="space-y-2">
          {!auth ? (
            <>
              <Link
                href="/login"
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl"
                onClick={() => setOpen(false)}
              >
                <IconUser size={20} />
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center p-3 border-2 border-orange-500 text-orange-600 rounded-xl"
                onClick={() => setOpen(false)}
              >
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/user"
                className="flex items-center gap-3 p-3 hover:bg-orange-50 rounded-xl text-gray-700"
                onClick={() => setOpen(false)}
              >
                <IconUser size={20} className="text-orange-500" />
                Hồ sơ cá nhân
              </Link>
              <Link
                href="/user/purchase"
                className="flex items-center gap-3 p-3 hover:bg-orange-50 rounded-xl text-gray-700"
                onClick={() => setOpen(false)}
              >
                <IconPackage size={20} className="text-orange-500" />
                Đơn hàng của tôi
              </Link>
              {roles.includes('ROLE_SELLER') ? (
                <button
                  onClick={() => {
                    window.open(SELLER_ROUTES.DASHBOARD, '_blank');
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  <IconBuildingStore size={20} />
                  Quản lý cửa hàng
                </button>
              ) : (
                <button
                  onClick={() => {
                    window.open(SELLER_ROUTES.REGISTER, '_blank');
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200"
                >
                  <IconBuildingStore size={20} />
                  Trở thành người bán
                </button>
              )}
              <Link
                href="/cart"
                className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-xl"
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center gap-3 text-orange-700">
                  <IconShoppingCart size={20} />
                  <span className="font-medium">Giỏ hàng</span>
                </div>
                {totalCartItems > 0 && (
                  <span className="bg-orange-500 text-white text-sm rounded-full px-3 py-1 font-bold">
                    {totalCartItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl"
              >
                <IconLogout size={20} />
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
