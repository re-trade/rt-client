import { TAchievementResponse } from '@/service/achievement.api';
import {
  getAchievementBgColor,
  getAchievementColor,
  getAchievementIcon,
} from '@/utils/achievement-icons';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Sparkles } from 'lucide-react';

interface AchievementCardProps {
  achievement: TAchievementResponse;
}

const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const Icon = getAchievementIcon(achievement.code);
  const bgColor = getAchievementBgColor(achievement.code);
  const gradientColor = getAchievementColor(achievement.code);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-orange-200 shadow-sm"
      whileHover={{
        y: -4,
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Background gradient overlay */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${gradientColor}`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.05 }}
        transition={{ duration: 0.3 }}
      />

      {/* Achievement glow effect */}
      {achievement.achieved && (
        <div className="absolute -top-1 -right-1 w-6 h-6">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-75"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.75, 1, 0.75],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            animate={{
              y: [0, -4, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Sparkles className="absolute inset-0 w-4 h-4 text-white m-1" />
          </motion.div>
        </div>
      )}

      <div className="relative p-5">
        <div className="flex items-start gap-4">
          {/* Icon container with enhanced styling */}
          <div className="relative flex-shrink-0">
            <motion.div
              className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center shadow-lg`}
              whileHover={{
                scale: 1.1,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradientColor} opacity-20`}
              ></div>
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                <Icon className="h-7 w-7 text-orange-600 relative z-10" />
              </motion.div>
            </motion.div>
            {achievement.achieved && (
              <motion.div
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.2 }}
              >
                <CheckCircle className="h-4 w-4 text-white" />
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <motion.h3
                className="font-bold text-gray-900 text-base leading-tight"
                whileHover={{ color: '#c2410c' }}
                transition={{ duration: 0.2 }}
                style={{
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 1,
                }}
              >
                {achievement.name}
              </motion.h3>
            </div>

            <p
              className="text-sm text-gray-600 leading-relaxed mb-3"
              style={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
              }}
            >
              {achievement.description}
            </p>

            {/* Achievement date */}
            {achievement.achieved && achievement.achievedAt && (
              <motion.div
                className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5 w-fit mb-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Calendar className="h-3.5 w-3.5 text-orange-500" />
                <span className="font-medium">Đạt được: {formatDate(achievement.achievedAt)}</span>
              </motion.div>
            )}

            {/* Achievement status badge */}
            {achievement.achieved ? (
              <motion.div
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle className="h-3 w-3" />
                Đã hoàn thành
              </motion.div>
            ) : (
              <motion.div
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                Chưa đạt được
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom border accent */}
      <motion.div
        className={`h-1 bg-gradient-to-r ${gradientColor}`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default AchievementCard;
