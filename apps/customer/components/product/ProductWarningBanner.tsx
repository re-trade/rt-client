import { TProduct } from '@services/product.api';
import { TSellerProfile } from '@services/seller.api';
import { motion } from 'framer-motion';
import { MdInfo, MdSecurity, MdVerified, MdWarning } from 'react-icons/md';

interface Props {
  productDetail: TProduct;
  sellerProfile?: TSellerProfile;
}

const ProductWarningBanner = ({ productDetail, sellerProfile }: Props) => {
  return (
    <>
      {!productDetail.verified && (
        <>
          {sellerProfile && productDetail.sellerId === sellerProfile.id ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-6 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 border-t border-b border-blue-300 shadow-md overflow-hidden relative"
            >
              <div className="py-3 relative">
                <motion.div
                  animate={{ x: [1000, -1000] }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="whitespace-nowrap flex items-center text-white font-semibold"
                >
                  <span className="flex items-center space-x-3 mx-8">
                    <MdInfo className="h-5 w-5 text-blue-200 flex-shrink-0" />
                    <span className="text-lg">THÔNG BÁO: Sản phẩm của bạn đang chờ xác minh</span>
                  </span>
                  <span className="text-blue-200 mx-4">•</span>
                  <span className="flex items-center space-x-3 mx-8">
                    <MdSecurity className="h-5 w-5 text-blue-200 flex-shrink-0" />
                    <span className="text-lg">Quá trình duyệt mất 1-3 ngày làm việc</span>
                  </span>
                  <span className="text-blue-200 mx-4">•</span>
                  <span className="flex items-center space-x-3 mx-8">
                    <MdVerified className="h-5 w-5 text-blue-200 flex-shrink-0" />
                    <span className="text-lg">Sản phẩm sẽ hiển thị sau khi được duyệt</span>
                  </span>
                  <span className="text-blue-200 mx-4">•</span>
                  <span className="flex items-center space-x-3 mx-8">
                    <MdInfo className="h-5 w-5 text-blue-200 flex-shrink-0" />
                    <span className="text-lg">THÔNG BÁO: Sản phẩm của bạn đang chờ xác minh</span>
                  </span>
                  <span className="text-blue-200 mx-4">•</span>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-6 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 border-t border-b border-orange-300 shadow-md overflow-hidden relative"
            >
              <div className="py-3 relative">
                <motion.div
                  animate={{ x: [1000, -1000] }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="whitespace-nowrap flex items-center text-white font-semibold"
                >
                  <span className="flex items-center space-x-3 mx-8">
                    <MdWarning className="h-5 w-5 text-yellow-200 flex-shrink-0" />
                    <span className="text-lg">CẢNH BÁO: Sản phẩm chưa được xác minh</span>
                  </span>
                  <span className="text-orange-200 mx-4">•</span>
                  <span className="flex items-center space-x-3 mx-8">
                    <MdSecurity className="h-5 w-5 text-yellow-200 flex-shrink-0" />
                    <span className="text-lg">Vui lòng kiểm tra kỹ trước khi mua</span>
                  </span>
                  <span className="text-orange-200 mx-4">•</span>
                  <span className="flex items-center space-x-3 mx-8">
                    <MdWarning className="h-5 w-5 text-yellow-200 flex-shrink-0" />
                    <span className="text-lg">CẢNH BÁO: Sản phẩm chưa được xác minh</span>
                  </span>
                  <span className="text-orange-200 mx-4">•</span>
                  <span className="flex items-center space-x-3 mx-8">
                    <MdSecurity className="h-5 w-5 text-yellow-200 flex-shrink-0" />
                    <span className="text-lg">Vui lòng kiểm tra kỹ trước khi mua</span>
                  </span>
                  <span className="text-orange-200 mx-4">•</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </>
  );
};

export default ProductWarningBanner;
