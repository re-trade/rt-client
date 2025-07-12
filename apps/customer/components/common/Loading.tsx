import { twMerge } from 'tailwind-merge';

interface LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'ring' | 'ball' | 'bars';
  color?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'info' | 'success' | 'warning' | 'error';
  fullScreen?: boolean;
  className?: string;
}

export const Loading = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  fullScreen = false,
  className,
}: LoadingProps) => {
  const sizeClasses = {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
  };

  const variantClasses = {
    spinner: 'loading-spinner',
    dots: 'loading-dots',
    ring: 'loading-ring',
    ball: 'loading-ball',
    bars: 'loading-bars',
  };

  const containerClasses = twMerge(
    'flex items-center justify-center',
    fullScreen ? 'fixed inset-0 bg-base-100/50 z-50' : '',
    className,
  );

  const loadingClasses = twMerge(
    'loading',
    sizeClasses[size],
    variantClasses[variant],
    `text-${color}`,
  );

  return (
    <div className={containerClasses}>
      <span className={loadingClasses} />
    </div>
  );
};

export default Loading;
