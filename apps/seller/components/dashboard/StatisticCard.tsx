import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorTheme: 'blue' | 'purple' | 'amber' | 'emerald';
  delay: number;
  iconAnimation?: 'rotate' | 'bounce' | 'scale';
}

const colorThemes = {
  blue: {
    text: 'text-blue-700',
    textBold: 'text-blue-900',
    icon: 'text-blue-600',
    bg: 'bg-blue-500/20',
    border: 'hover:border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
    shadow: 'rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)',
  },
  purple: {
    text: 'text-purple-700',
    textBold: 'text-purple-900',
    icon: 'text-purple-600',
    bg: 'bg-purple-500/20',
    border: 'hover:border-purple-200',
    gradient: 'from-purple-500 to-purple-600',
    shadow: 'rgba(147, 51, 234, 0.1), 0 10px 10px -5px rgba(147, 51, 234, 0.04)',
  },
  amber: {
    text: 'text-amber-700',
    textBold: 'text-amber-900',
    icon: 'text-amber-500',
    bg: 'bg-amber-500/20',
    border: 'hover:border-amber-200',
    gradient: 'from-amber-500 to-amber-600',
    shadow: 'rgba(245, 158, 11, 0.1), 0 10px 10px -5px rgba(245, 158, 11, 0.04)',
  },
  emerald: {
    text: 'text-emerald-700',
    textBold: 'text-emerald-900',
    icon: 'text-emerald-600',
    bg: 'bg-emerald-500/20',
    border: 'hover:border-emerald-200',
    gradient: 'from-emerald-500 to-emerald-600',
    shadow: 'rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(16, 185, 129, 0.04)',
  },
};

const getIconAnimation = (type?: 'rotate' | 'bounce' | 'scale') => {
  switch (type) {
    case 'rotate':
      return { rotate: 360 };
    case 'bounce':
      return {
        rotate: [0, 10, -10, 0],
        scale: [1, 1.2, 1],
      };
    case 'scale':
      return { scale: [1, 1.2, 1] };
    default:
      return { rotate: 360 };
  }
};

const StatisticCard = ({
  title,
  value,
  icon: Icon,
  colorTheme,
  delay,
  iconAnimation,
}: StatisticCardProps) => {
  const theme = colorThemes[colorTheme];

  return (
    <motion.div
      className={`group relative bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 ${theme.border} shadow-sm`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{
        y: -4,
        scale: 1.02,
        boxShadow: `0 20px 25px -5px ${theme.shadow}`,
      }}
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} rounded-2xl`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.05 }}
        transition={{ duration: 0.3 }}
      />
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-2 flex-1 min-w-0 pr-2">
          <span className={`text-sm font-semibold ${theme.text} leading-tight`}>{title}</span>
          <div className="flex items-center gap-2">
            <motion.div whileHover={getIconAnimation(iconAnimation)} transition={{ duration: 0.6 }}>
              <Icon
                className={`h-5 w-5 ${theme.icon} flex-shrink-0 ${colorTheme === 'amber' ? 'fill-amber-500' : ''}`}
              />
            </motion.div>
            <motion.span
              className={`text-lg sm:text-xl font-bold ${theme.textBold} leading-tight break-words`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
              }}
            >
              {value}
            </motion.span>
          </div>
        </div>
        <motion.div
          className={`w-12 h-12 sm:w-14 sm:h-14 ${theme.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Icon
            className={`h-6 w-6 sm:h-7 sm:w-7 ${theme.icon} ${colorTheme === 'amber' ? 'fill-amber-500' : ''}`}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatisticCard;
