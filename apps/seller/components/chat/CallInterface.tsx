'use client';

import type { Room } from '@retrade/util';
import { Mic, MicOff, Video, VideoOff, X } from 'lucide-react';
import type { RefObject } from 'react';

interface CallInterfaceProps {
  contact: Room | null;
  isVideoCall: boolean;
  isAudioCall: boolean;
  isCalling: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isRecording: boolean;
  recordingTime: number;
  videoRef: RefObject<HTMLVideoElement | null>;
  remoteVideoRef: RefObject<HTMLVideoElement | null>;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onEndCall: () => void;
  formatRecordingTime: (seconds: number) => string;
}

export function CallInterface({
  contact,
  isVideoCall,
  isAudioCall,
  isCalling,
  isVideoEnabled,
  isAudioEnabled,
  isRecording,
  recordingTime,
  videoRef,
  remoteVideoRef,
  onToggleVideo,
  onToggleAudio,
  onStartRecording,
  onStopRecording,
  onEndCall,
  formatRecordingTime,
}: CallInterfaceProps) {
  if (!isCalling || (!isVideoCall && !isAudioCall)) {
    return null;
  }

  const customerParticipant = contact?.participants?.find((p: any) => p.senderRole === 'customer');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl mx-auto">
        {isVideoCall && (
          <div className="relative w-full h-full">
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />

            <video
              ref={videoRef}
              className="absolute top-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-white shadow-lg"
              autoPlay
              playsInline
              muted
            />
          </div>
        )}

        {isAudioCall && (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="text-center mb-8">
              <img
                src={customerParticipant?.avatarUrl || '/placeholder.svg'}
                alt={customerParticipant?.name || 'Customer'}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
              />
              <h2 className="text-2xl font-semibold mb-2">
                {customerParticipant?.name || 'Khách hàng'}
              </h2>
              <p className="text-gray-300">Đang gọi...</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-4 bg-black bg-opacity-50 rounded-full px-6 py-4">
            {isVideoCall && (
              <button
                onClick={onToggleVideo}
                className={`p-4 rounded-full transition-all duration-200 ${
                  isVideoEnabled
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                title={isVideoEnabled ? 'Tắt camera' : 'Bật camera'}
              >
                {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
              </button>
            )}

            <button
              onClick={onToggleAudio}
              className={`p-4 rounded-full transition-all duration-200 ${
                isAudioEnabled
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title={isAudioEnabled ? 'Tắt mic' : 'Bật mic'}
            >
              {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            <button
              onClick={onEndCall}
              className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-200"
              title="Kết thúc cuộc gọi"
            >
              <X size={24} />
            </button>
          </div>

          {isRecording && (
            <div className="text-center mt-4 text-white">
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Đang ghi âm: {formatRecordingTime(recordingTime)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
