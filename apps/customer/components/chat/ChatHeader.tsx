'use client';

import type { Room } from '@/types/chat/chat';
import { IconArrowLeft, IconDots, IconPhone, IconVideo } from '@tabler/icons-react';
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
    router.push('/chat');
  };
  const otherParticipant = contact?.participants
    ?.filter((item: any) => item.senderRole === 'seller')
    ?.pop();

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={handleBackToContacts}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
          title="Quay lại danh sách"
        >
          <IconArrowLeft size={20} />
        </button>

        <div className="relative">
          <img
            src={otherParticipant?.avatarUrl || '/placeholder.svg'}
            alt={otherParticipant?.name || 'Contact'}
            className="w-12 h-12 rounded-full object-cover"
          />
          {otherParticipant?.isOnline && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 text-lg">
            {otherParticipant?.name || 'Contact'}
          </h2>
          <p
            className={`text-sm ${otherParticipant?.isOnline ? 'text-green-600' : 'text-gray-500'}`}
          >
            {otherParticipant?.isOnline ? 'Đang hoạt động' : 'Hoạt động gần đây'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onAudioCall}
          className="p-3 text-gray-600 hover:text-white hover:bg-orange-500 rounded-full transition-all duration-200 group"
          title="Gọi thoại"
        >
          <IconPhone
            size={22}
            className="group-hover:scale-110 transition-transform duration-200"
          />
        </button>
        <button
          onClick={onVideoCall}
          className="p-3 text-gray-600 hover:text-white hover:bg-orange-500 rounded-full transition-all duration-200 group"
          title="Gọi video"
        >
          <IconVideo
            size={22}
            className="group-hover:scale-110 transition-transform duration-200"
          />
        </button>
        <button
          onClick={handleMoreOptions}
          className="p-3 text-gray-600 hover:text-white hover:bg-orange-500 rounded-full transition-all duration-200 group"
          title="Tùy chọn khác"
        >
          <IconDots size={22} className="group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
