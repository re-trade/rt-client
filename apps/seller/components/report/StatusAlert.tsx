import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDateTime } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface StatusAlertProps {
  status: string;
  resolutionDate?: string;
}

export function StatusAlert({ status, resolutionDate }: StatusAlertProps) {
  const statusLower = status.toLowerCase();

  if (statusLower === 'pending') {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-800" />
        <AlertDescription className="text-yellow-800">
          Báo cáo này đang chờ xử lý. Vui lòng cung cấp bằng chứng và giải trình của bạn để hỗ trợ
          việc giải quyết báo cáo.
        </AlertDescription>
      </Alert>
    );
  }

  if (statusLower === 'resolved') {
    return (
      <Alert className="bg-green-50 border-green-200">
        <AlertDescription className="text-green-800">
          Báo cáo này đã được giải quyết vào ngày {formatDateTime(resolutionDate || '')}.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
