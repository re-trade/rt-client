'use client';

import type { Contact } from '@/hooks/use-chat-contact';
import {
  IconMicrophone,
  IconMicrophoneOff,
  IconVideo,
  IconVideoOff,
  IconX,
} from '@tabler/icons-react';
import type { RefObject } from 'react';

interface CallInterfaceProps {
  contact: Contact;
  isVideoCall: boolean;
  isAudioCall: boolean;
  isCalling: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isRecording: boolean;
  recordingTime: number;
  videoRef: RefObject<HTMLVideoElement>;
  remoteVideoRef: RefObject<HTMLVideoElement>;
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
  return (
    <div className="flex-1 bg-gray-900 relative flex items-center justify-center">
      {isVideoCall && (
        <>
          {/* Remote video */}
          <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay playsInline />
          {/* Local video */}
          <video
            ref={videoRef}
            className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg object-cover"
            autoPlay
            playsInline
            muted
          />
        </>
      )}

      {isAudioCall && (
        <div className="text-center">
          <img
            src={contact.avatar || '/placeholder.svg'}
            alt={contact.name}
            className="w-32 h-32 rounded-full mx-auto mb-4"
          />
          <h2 className="text-white text-2xl font-semibold mb-2">{contact.name}</h2>
          <p className="text-gray-300">{isCalling ? 'Đang gọi...' : 'Đang trong cuộc gọi'}</p>
        </div>
      )}

      {isCalling && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <img
              src={contact.avatar || '/placeholder.svg'}
              alt={contact.name}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h2 className="text-white text-2xl font-semibold mb-2">{contact.name}</h2>
            <p className="text-gray-300 mb-8">Đang gọi...</p>
            <div className="flex justify-center">
              <button
                onClick={onEndCall}
                className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full transition-colors"
              >
                <IconX size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recording Indicator Overlay */}
      {isRecording && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            Đang ghi âm {formatRecordingTime(recordingTime)}
          </span>
        </div>
      )}

      {/* Call Controls */}
      {!isCalling && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={onToggleVideo}
            className={`p-4 rounded-full transition-colors ${
              isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
            } text-white`}
          >
            {isVideoEnabled ? <IconVideo size={24} /> : <IconVideoOff size={24} />}
          </button>
          <button
            onClick={onToggleAudio}
            className={`p-4 rounded-full transition-colors ${
              isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
            } text-white`}
          >
            {isAudioEnabled ? <IconMicrophone size={24} /> : <IconMicrophoneOff size={24} />}
          </button>
          <button
            onClick={onEndCall}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full transition-colors"
          >
            <IconX size={24} />
          </button>
          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`p-4 rounded-full transition-colors ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-gray-700 hover:bg-gray-600'
            } text-white`}
            title={isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
          >
            <div className="relative">
              <div
                className={`w-6 h-6 rounded-full border-2 border-white ${isRecording ? 'bg-red-500' : 'bg-transparent'}`}
              >
                {isRecording && (
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                )}
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
