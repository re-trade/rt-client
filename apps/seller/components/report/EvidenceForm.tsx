import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon, Send } from 'lucide-react';

interface EvidenceFormProps {
  note: string;
  setNote: (note: string) => void;
  images: File[];
  imageUrls: string[];
  submitting: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  handleSubmit: () => Promise<void>;
}

export function EvidenceForm({
  note,
  setNote,
  images,
  imageUrls,
  submitting,
  handleImageUpload,
  removeImage,
  handleSubmit,
}: EvidenceFormProps) {
  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="text-lg font-medium mb-4">Gửi phản hồi của bạn</h3>

      <div className="space-y-4">
        <label htmlFor="evidence-note" className="block text-sm font-medium text-gray-700 mb-2">
          Nội dung giải trình của bạn:
        </label>
        <Textarea
          id="evidence-note"
          placeholder="Nhập thông tin giải trình và phản hồi của bạn..."
          className="min-h-[120px]"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {imageUrls.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Hình ảnh đính kèm ({imageUrls.length}/5):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 px-2 truncate">
                    Hình ảnh {index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={images.length >= 5 || submitting}
            className="gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            {images.length === 0 ? 'Thêm hình ảnh' : `Hình ảnh (${images.length}/5)`}
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
            disabled={images.length >= 5}
          />

          <Button
            type="button"
            onClick={handleSubmit}
            className="ml-auto gap-2 bg-orange-600 hover:bg-orange-700"
            disabled={submitting || (!note.trim() && images.length === 0)}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Gửi phản hồi
              </>
            )}
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mt-4">
          <p className="text-xs text-blue-700">
            <strong>Hướng dẫn:</strong> Bạn có thể đính kèm tối đa 5 hình ảnh làm bằng chứng. Vui
            lòng cung cấp đầy đủ thông tin giải trình và tham chiếu đến thông tin đơn hàng nếu cần
            để hỗ trợ việc xử lý báo cáo nhanh chóng.
          </p>
        </div>
      </div>
    </div>
  );
}
