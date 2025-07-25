'use client';

import type { Room } from '@retrade/util';
import { ArrowLeft, MoreHorizontal, Phone, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ChatHeaderProps {
  contact: Room | null;
  onAudioCall: () => void;
  onVideoCall: () => void;
}

export function ChatHeader({ contact, onAudioCall, onVideoCall }: ChatHeaderProps) {
  const router = useRouter();

  const handleMoreOptions = () => {
    console.log('More options clicked');
  };

  const handleBackToContacts = () => {
    router.push('/dashboard/chat');
  };

  const customerParticipant = contact?.participants
    ?.filter((item: any) => item.senderRole === 'customer')
    ?.pop();

  if (!contact) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={handleBackToContacts}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
          title="Quay lại danh sách"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="relative">
          <img
            src={customerParticipant?.avatarUrl || '/placeholder.svg'}
            alt={customerParticipant?.name || 'Customer'}
            className="w-12 h-12 rounded-full object-cover"
          />
          {customerParticipant?.isOnline && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 text-lg">
            {customerParticipant?.name || 'Khách hàng'}
          </h2>
          <p
            className={`text-sm ${
              customerParticipant?.isOnline ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {customerParticipant?.isOnline ? 'Đang hoạt động' : 'Hoạt động gần đây'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onAudioCall}
          className="p-3 text-gray-600 hover:text-white hover:bg-orange-500 rounded-full transition-all duration-200 group"
          title="Gọi điện"
        >
          <Phone size={20} className="group-hover:scale-110 transition-transform duration-200" />
        </button>
        <button
          onClick={onVideoCall}
          className="p-3 text-gray-600 hover:text-white hover:bg-orange-500 rounded-full transition-all duration-200 group"
          title="Gọi video"
        >
          <Video size={20} className="group-hover:scale-110 transition-transform duration-200" />
        </button>
        <button
          onClick={handleMoreOptions}
          className="p-3 text-gray-600 hover:text-white hover:bg-orange-500 rounded-full transition-all duration-200 group"
          title="Tùy chọn khác"
        >
          <MoreHorizontal
            size={20}
            className="group-hover:scale-110 transition-transform duration-200"
          />
        </button>
      </div>
    </div>
  );
}
