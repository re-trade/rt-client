import { CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { EvidenceForm } from './EvidenceForm';
import { EvidenceItem, type EnhancedEvidenceResponse } from './EvidenceItem';

interface EvidenceListProps {
  evidences: EnhancedEvidenceResponse[];
  evidenceLoading: boolean;
  reportResolutionStatus: string;

  // Pagination props
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;

  // Form props
  note: string;
  setNote: (note: string) => void;
  images: File[];
  imageUrls: string[];
  submitting: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  handleSubmit: () => Promise<void>;

  // Styling helper
  getSenderRoleStyle: (role: 'CUSTOMER' | 'SELLER' | 'ADMIN') => string;
}

export function EvidenceList({
  evidences,
  evidenceLoading,
  reportResolutionStatus,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  handlePageChange,
  handlePageSizeChange,
  note,
  setNote,
  images,
  imageUrls,
  submitting,
  handleImageUpload,
  removeImage,
  handleSubmit,
  getSenderRoleStyle,
}: EvidenceListProps) {
  const isResolved = reportResolutionStatus.toLowerCase() === 'resolved';

  return (
    <CardContent>
      {evidenceLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-20 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : evidences.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">Chưa có bằng chứng</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
            Chưa có bằng chứng nào được cung cấp. Hãy gửi bằng chứng và giải trình của bạn bên dưới
            để hỗ trợ việc giải quyết báo cáo này.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {evidences.map((evidence) => (
              <EvidenceItem
                key={evidence.id}
                evidence={evidence}
                getSenderRoleStyle={getSenderRoleStyle}
              />
            ))}
          </div>

          {/* Pagination for evidences */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                showPageSizeSelector={true}
                pageSizeOptions={[10, 20, 50]}
                loading={evidenceLoading}
                className="mt-4"
              />
            </div>
          )}
        </>
      )}

      {/* Reply Form */}
      {!isResolved && (
        <EvidenceForm
          note={note}
          setNote={setNote}
          images={images}
          imageUrls={imageUrls}
          submitting={submitting}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          handleSubmit={handleSubmit}
        />
      )}
    </CardContent>
  );
}
