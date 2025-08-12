import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

export type EnhancedEvidenceResponse = {
  id: string;
  senderRole: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  senderId: string;
  senderName: string;
  senderAvatarUrl: string;
  notes: string;
  evidenceUrls: string[];
  createdAt?: string;
};

interface EvidenceItemProps {
  evidence: EnhancedEvidenceResponse;
  getSenderRoleStyle: (role: 'CUSTOMER' | 'SELLER' | 'ADMIN') => string;
}

export function EvidenceItem({ evidence, getSenderRoleStyle }: EvidenceItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-3">
        <Avatar>
          <AvatarImage src={evidence.senderAvatarUrl || '/placeholder-avatar.png'} />
          <AvatarFallback>{evidence.senderName?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {evidence.senderRole === 'CUSTOMER'
                ? `Khách hàng #${evidence.senderId.slice(0, 8)}`
                : evidence.senderName}
            </span>
            <Badge className={`${getSenderRoleStyle(evidence.senderRole)} text-xs`}>
              {evidence.senderRole === 'CUSTOMER'
                ? 'Khách hàng'
                : evidence.senderRole === 'SELLER'
                  ? 'Người bán'
                  : 'Admin'}
            </Badge>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatDateTime(evidence.createdAt || '')}
          </div>
        </div>
      </div>

      {/* Note section */}
      {evidence.notes && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Nội dung giải trình:</h4>
          <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
            <p className="text-gray-800 whitespace-pre-wrap">{evidence.notes}</p>
          </div>
        </div>
      )}

      {/* Evidence images section */}
      {evidence.evidenceUrls && evidence.evidenceUrls.length > 0 && (
        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-500 mb-2">
            Hình ảnh bằng chứng ({evidence.evidenceUrls.length}):
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
            {evidence.evidenceUrls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group"
              >
                <div className="aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                  <img
                    src={url}
                    alt={`Bằng chứng ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.png';
                    }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 px-2 truncate">
                  Hình ảnh {index + 1}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
