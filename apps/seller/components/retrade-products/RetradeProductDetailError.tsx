import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, Repeat } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  error: string | null;
  refreshProductDetail: () => void;
}

const RetradeProductDetailError = ({ error, refreshProductDetail }: Props) => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
        </div>

        <Card className="border border-red-200 shadow-md">
          <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center min-h-[300px]">
            <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Lỗi khi tải thông tin sản phẩm</h2>
            <p className="text-gray-600 mb-6 text-center max-w-lg">
              {error || 'Đã xảy ra lỗi không xác định'}
            </p>
            <Button
              onClick={() => refreshProductDetail()}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Repeat className="h-4 w-4" />
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RetradeProductDetailError;
