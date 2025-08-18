'use client';

import { LucideIcon, Package, RefreshCw, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductSectionEmptyProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  showBrowseButton?: boolean;
  showRefreshButton?: boolean;
  showCategories?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  browseButtonText?: string;
  browseButtonPath?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProductSectionEmpty({
  title = 'Không có sản phẩm',
  description = 'Hiện tại chúng tôi chưa có sản phẩm nào để hiển thị.',
  icon: Icon = Package,
  showBrowseButton = true,
  showRefreshButton = false,
  showCategories = false,
  onRefresh,
  isRefreshing = false,
  browseButtonText = 'Khám phá sản phẩm',
  browseButtonPath = '/product',
  size = 'md',
}: ProductSectionEmptyProps) {
  const router = useRouter();

  const sizeClasses = {
    sm: {
      container: 'py-8 md:py-10',
      icon: 'w-12 h-12 md:w-14 md:h-14',
      iconContainer: 'w-16 h-16 md:w-18 md:h-18 rounded-xl',
      iconSize: 'w-6 h-6 md:w-7 md:h-7',
      title: 'text-base md:text-lg',
      description: 'text-sm',
      button: 'px-4 py-2 text-sm',
      buttonIcon: 'w-3 h-3',
    },
    md: {
      container: 'py-12 md:py-16',
      icon: 'w-16 h-16 md:w-20 md:h-20',
      iconContainer: 'w-20 h-20 md:w-24 md:h-24 rounded-2xl',
      iconSize: 'w-8 h-8 md:w-10 md:h-10',
      title: 'text-lg md:text-xl',
      description: 'text-sm md:text-base',
      button: 'px-6 py-3 text-sm md:text-base',
      buttonIcon: 'w-4 h-4',
    },
    lg: {
      container: 'py-16 md:py-20',
      icon: 'w-20 h-20 md:w-24 md:h-24',
      iconContainer: 'w-24 h-24 md:w-28 md:h-28 rounded-3xl',
      iconSize: 'w-10 h-10 md:w-12 md:h-12',
      title: 'text-xl md:text-2xl',
      description: 'text-base md:text-lg',
      button: 'px-8 py-4 text-base md:text-lg',
      buttonIcon: 'w-5 h-5',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center justify-center ${classes.container} px-4`}>
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div
          className={`mx-auto ${classes.iconContainer} bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-lg`}
        >
          <Icon className={`${classes.iconSize} text-orange-500`} />
        </div>

        <div className="space-y-3">
          <h3 className={`${classes.title} font-bold text-gray-800`}>{title}</h3>
          <p className={`${classes.description} text-gray-600 leading-relaxed`}>{description}</p>
        </div>

        {(showBrowseButton || showRefreshButton) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            {showBrowseButton && (
              <button
                onClick={() => router.push(browseButtonPath)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 ${classes.button} font-semibold text-white hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95`}
              >
                <ShoppingBag className={classes.buttonIcon} />
                {browseButtonText}
              </button>
            )}

            {showRefreshButton && onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border-2 border-orange-200 bg-white ${classes.button} font-semibold text-orange-600 hover:bg-orange-50 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <RefreshCw
                  className={`${classes.buttonIcon} ${isRefreshing ? 'animate-spin' : ''}`}
                />
                {isRefreshing ? 'Đang tải...' : 'Thử lại'}
              </button>
            )}
          </div>
        )}

        {showCategories && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs md:text-sm text-gray-500 mb-4">Danh mục phổ biến:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { name: 'Điện thoại', path: '/product?category=dien-thoai' },
                { name: 'Laptop', path: '/product?category=laptop' },
                { name: 'Thời trang', path: '/product?category=thoi-trang' },
                { name: 'Gia dụng', path: '/product?category=gia-dung' },
                { name: 'Sách', path: '/product?category=sach' },
              ].map((category) => (
                <button
                  key={category.name}
                  onClick={() => router.push(category.path)}
                  className="px-3 py-1.5 text-xs md:text-sm bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 hover:text-orange-700 transition-all duration-200 border border-orange-100 hover:border-orange-200"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
