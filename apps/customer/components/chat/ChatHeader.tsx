'use client';

import type { Room } from '@/types/chat/chat';
import { IconDots, IconPhone, IconVideo } from '@tabler/icons-react';

interface ChatHeaderProps {
  contact: Room | null;
  onAudioCall: () => void;
  onVideoCall: () => void;
}

export function ChatHeader({ contact, onAudioCall, onVideoCall }: ChatHeaderProps) {
  const otherParticipant = contact?.participants?.[0];

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={otherParticipant?.avatarUrl || '/placeholder.svg'}
          alt={otherParticipant?.name || 'Contact'}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold text-gray-900">{otherParticipant?.name || 'Contact'}</h2>
          <p className="text-sm text-gray-500">
            {otherParticipant?.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAudioCall}
          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
        >
          <IconPhone size={20} />
        </button>
        <button
          onClick={onVideoCall}
          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
        >
          <IconVideo size={20} />
        </button>
        <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors">
          <IconDots size={20} />
        </button>
      </div>
    </div>
  );
}
