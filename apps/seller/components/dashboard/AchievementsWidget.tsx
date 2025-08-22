'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAchievements } from '@/hooks/use-achievements';
import { motion } from 'framer-motion';
import { Award, Sparkles, Trophy } from 'lucide-react';
import AchievementCard from './AchievementCard';

const LoadingIndicator = () => (
  <motion.div
    className="flex flex-col justify-center items-center py-12"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="relative">
      <motion.div
        className="rounded-full h-12 w-12 border-4 border-orange-100"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent absolute top-0 left-0"
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
      Đang tải thành tích...
    </motion.span>
  </motion.div>
);

const AchievementsWidget = () => {
  const { achievements, isLoading, error } = useAchievements();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-amber-50/50 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full"
            initial={{ scale: 0, x: 100, y: -100 }}
            animate={{ scale: 1, x: 64, y: -64 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full"
            initial={{ scale: 0, x: -100, y: 100 }}
            animate={{ scale: 1, x: -48, y: 48 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <CardTitle className="flex items-center gap-3 text-white relative z-10">
            <motion.div
              className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Trophy className="h-6 w-6 text-white" />
            </motion.div>
            <div className="flex-1">
              <motion.h3
                className="text-xl font-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Thành tích của bạn
              </motion.h3>
              <motion.p
                className="text-orange-100 text-sm font-normal mt-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Những cột mốc đáng tự hào
              </motion.p>
            </div>
            {achievements.length > 0 && (
              <motion.div
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="h-4 w-4 text-yellow-200" />
                </motion.div>
                <span className="text-white font-semibold text-sm">{achievements.length}</span>
              </motion.div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <LoadingIndicator />
            </div>
          ) : error ? (
            <motion.div
              className="h-[400px] flex items-center justify-center p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Award className="h-10 w-10 text-red-400" />
                </motion.div>
                <motion.h3
                  className="text-lg font-semibold text-gray-700 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Không thể tải thành tích
                </motion.h3>
                <motion.p
                  className="text-sm text-gray-500 max-w-xs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {error}
                </motion.p>
              </div>
            </motion.div>
          ) : achievements.length > 0 ? (
            <motion.div
              className="h-[400px] overflow-y-auto hover:overflow-y-scroll"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#f97316 #f3f4f6',
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.scrollbarColor = '#ea580c #e5e7eb';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.scrollbarColor = '#f97316 #f3f4f6';
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  width: 6px;
                }
                div::-webkit-scrollbar-track {
                  background: #f3f4f6;
                  border-radius: 3px;
                }
                div::-webkit-scrollbar-thumb {
                  background: #f97316;
                  border-radius: 3px;
                  transition: background 0.2s ease;
                }
                div::-webkit-scrollbar-thumb:hover {
                  background: #ea580c;
                }
              `}</style>
              <div className="p-6 space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.5,
                      type: 'spring',
                      stiffness: 100,
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <AchievementCard achievement={achievement} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="h-[400px] flex items-center justify-center p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Award className="h-10 w-10 text-orange-400" />
                </motion.div>
                <motion.h3
                  className="text-lg font-semibold text-gray-700 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Chưa có thành tích nào
                </motion.h3>
                <motion.p
                  className="text-sm text-gray-500 max-w-xs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Hãy tiếp tục hoạt động để mở khóa các thành tích mới!
                </motion.p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AchievementsWidget;
