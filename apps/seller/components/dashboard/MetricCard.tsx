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
  <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`}></div>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <div
        className={`p-2 rounded-full bg-gradient-to-r ${color} opacity-20 group-hover:opacity-30 transition-opacity`}
      >
        <Icon className="h-4 w-4 text-gray-700" />
      </div>
    </CardHeader>
    <CardContent>
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
