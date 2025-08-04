'use client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/use-auth';
import {
  IconBuildingStore,
  IconLogout,
  IconPackage,
  IconShoppingCart,
  IconUser,
} from '@tabler/icons-react';
import Link from 'next/link';

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const MobileMenu = ({ open, setOpen }: Props) => {
  const { auth, logout } = useAuth();
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
              <Link
                href={process.env.NEXT_PUBLIC_SELLER_PORTAL_URL || 'http://localhost:3001'}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl"
                onClick={() => setOpen(false)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBuildingStore size={20} />
                Tới trang người bán
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
