'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Star, TrendingUp, X } from 'lucide-react';
import StatisticCard from './StatisticCard';

interface StatisticsData {
  totalProducts: number;
  totalOrders: number;
  rating: number;
}

interface StatisticsWidgetProps {
  statistics: StatisticsData;
  isLoading: boolean;
  error: string | null;
  identityVerifiedStatus: string;
  getVerificationIcon: (status: string) => any;
  getVerificationStatusText: (status: string) => string;
}

const LoadingIndicator = () => (
  <motion.div
    className="flex flex-col items-center justify-center py-12"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="relative">
      <motion.div
        className="rounded-full h-12 w-12 border-4 border-blue-100"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
    <motion.span
      className="mt-4 text-gray-600 font-medium"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      Đang tải thống kê...
    </motion.span>
  </motion.div>
);

const ErrorState = ({ error }: { error: string }) => (
  <motion.div
    className="text-center py-12"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
    >
      <X className="h-10 w-10 text-red-400" />
    </motion.div>
    <motion.p
      className="text-lg font-semibold text-gray-700 mb-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      Không thể tải thống kê
    </motion.p>
    <motion.p
      className="text-sm text-gray-500"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {error}
    </motion.p>
  </motion.div>
);

const StatisticsWidget = ({
  statistics,
  isLoading,
  error,
  identityVerifiedStatus,
  getVerificationIcon,
  getVerificationStatusText,
}: StatisticsWidgetProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full"
            initial={{ scale: 0, x: 100, y: -100 }}
            animate={{ scale: 1, x: 64, y: -64 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full"
            initial={{ scale: 0, x: -100, y: 100 }}
            animate={{ scale: 1, x: -48, y: 48 }}
            transition={{ duration: 1, delay: 0.6 }}
          />
          <CardTitle className="flex items-center gap-3 text-white relative z-10">
            <motion.div
              className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <TrendingUp className="h-6 w-6 text-white" />
            </motion.div>
            <div className="flex-1">
              <motion.h3
                className="text-xl font-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <span className="hidden sm:inline">Thống kê tổng quan</span>
                <span className="sm:hidden">Thống kê</span>
              </motion.h3>
              <motion.p
                className="text-blue-100 text-sm font-normal mt-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Hoạt động bán hàng của bạn
              </motion.p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {isLoading ? (
            <LoadingIndicator />
          ) : error ? (
            <ErrorState error={error} />
          ) : (
            <div className="space-y-4">
              <StatisticCard
                title="Tổng sản phẩm"
                value={statistics.totalProducts.toLocaleString('vi-VN')}
                icon={Package}
                colorTheme="blue"
                delay={0.1}
                iconAnimation="rotate"
              />
              <StatisticCard
                title="Tổng đơn hàng"
                value={statistics.totalOrders.toLocaleString('vi-VN')}
                icon={ShoppingCart}
                colorTheme="purple"
                delay={0.2}
                iconAnimation="rotate"
              />
              <StatisticCard
                title="Đánh giá"
                value={`${statistics.rating ? statistics.rating.toFixed(1) : '0.0'}/5.0`}
                icon={Star}
                colorTheme="amber"
                delay={0.3}
                iconAnimation="bounce"
              />
              <StatisticCard
                title="Xác minh"
                value={getVerificationStatusText(identityVerifiedStatus)}
                icon={getVerificationIcon(identityVerifiedStatus)}
                colorTheme="emerald"
                delay={0.4}
                iconAnimation="rotate"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatisticsWidget;
