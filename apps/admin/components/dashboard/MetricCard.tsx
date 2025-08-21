import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: string | number;
  change: string;
  icon: React.ComponentType<{ className: string }>;
  color: string;
  trend: 'up' | 'down' | 'neutral';
}) => (
  <Card className="border-2 border-gray-200 hover:shadow-lg shadow-md transition-all duration-300 bg-white">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
      <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
      <div
        className={`p-2 rounded-full ${
          color === 'from-blue-500 to-blue-600'
            ? 'bg-blue-50'
            : color === 'from-green-500 to-green-600'
              ? 'bg-green-50'
              : color === 'from-purple-500 to-purple-600'
                ? 'bg-purple-50'
                : color === 'from-orange-500 to-orange-600'
                  ? 'bg-orange-50'
                  : color === 'from-teal-500 to-teal-600'
                    ? 'bg-teal-50'
                    : color === 'from-indigo-500 to-indigo-600'
                      ? 'bg-indigo-50'
                      : color === 'from-yellow-500 to-yellow-600'
                        ? 'bg-yellow-50'
                        : color === 'from-red-500 to-red-600'
                          ? 'bg-red-50'
                          : 'bg-gray-50'
        }`}
      >
        <Icon
          className={`h-5 w-5 ${
            color === 'from-blue-500 to-blue-600'
              ? 'text-blue-600'
              : color === 'from-green-500 to-green-600'
                ? 'text-green-600'
                : color === 'from-purple-500 to-purple-600'
                  ? 'text-purple-600'
                  : color === 'from-orange-500 to-orange-600'
                    ? 'text-orange-600'
                    : color === 'from-teal-500 to-teal-600'
                      ? 'text-teal-600'
                      : color === 'from-indigo-500 to-indigo-600'
                        ? 'text-indigo-600'
                        : color === 'from-yellow-500 to-yellow-600'
                          ? 'text-yellow-600'
                          : color === 'from-red-500 to-red-600'
                            ? 'text-red-600'
                            : 'text-gray-600'
          }`}
        />
      </div>
    </CardHeader>
    <div
      className={`h-1 w-full ${
        color === 'from-blue-500 to-blue-600'
          ? 'bg-blue-500'
          : color === 'from-green-500 to-green-600'
            ? 'bg-green-500'
            : color === 'from-purple-500 to-purple-600'
              ? 'bg-purple-500'
              : color === 'from-orange-500 to-orange-600'
                ? 'bg-orange-500'
                : color === 'from-teal-500 to-teal-600'
                  ? 'bg-teal-500'
                  : color === 'from-indigo-500 to-indigo-600'
                    ? 'bg-indigo-500'
                    : color === 'from-yellow-500 to-yellow-600'
                      ? 'bg-yellow-500'
                      : color === 'from-red-500 to-red-600'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
      }`}
    ></div>
    <CardContent className="pt-3">
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="flex items-center gap-1 text-xs">
        {trend === 'up' ? (
          <ArrowUp className="h-3 w-3 text-green-500" />
        ) : trend === 'down' ? (
          <ArrowDown className="h-3 w-3 text-red-500" />
        ) : (
          <Minus className="h-3 w-3 text-gray-400" />
        )}
        <span
          className={`${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}
        >
          {change}
        </span>
      </div>
    </CardContent>
  </Card>
);

export default MetricCard;
