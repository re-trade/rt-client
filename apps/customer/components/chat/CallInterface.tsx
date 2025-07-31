'use client';

import type { Room } from '@retrade/util';
import {
  IconMicrophone,
  IconMicrophoneOff,
  IconVideo,
  IconVideoOff,
  IconX,
} from '@tabler/icons-react';
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
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative flex items-center justify-center">
      {isVideoCall && (
        <>
          <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay playsInline />
          <video
            ref={videoRef}
            className="absolute top-6 right-6 w-48 h-36 bg-gray-800 rounded-2xl object-cover border-2 border-orange-400 shadow-2xl"
            autoPlay
            playsInline
            muted
          />
        </>
      )}

      {isAudioCall && (
        <div className="text-center">
          <div className="relative mb-6">
            <img
              src={contact?.participants?.[0]?.avatarUrl || '/placeholder.svg'}
              alt={contact?.participants?.[0]?.name || 'Contact'}
              className="w-40 h-40 rounded-full mx-auto border-4 border-orange-400 shadow-2xl"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-orange-500/20 to-transparent"></div>
          </div>
          <h2 className="text-white text-3xl font-bold mb-3">{contact?.participants?.[0]?.name}</h2>
          <p className="text-orange-200 text-lg">
            {isCalling ? 'Đang gọi...' : 'Đang trong cuộc gọi'}
          </p>
        </div>
      )}

      {isCalling && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <div className="relative mb-6">
              <img
                src={contact?.participants?.[0]?.avatarUrl || '/placeholder.svg'}
                alt={contact?.participants?.[0]?.name || 'Contact'}
                className="w-40 h-40 rounded-full mx-auto border-4 border-orange-400 shadow-2xl animate-pulse"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-orange-500/30 to-transparent"></div>
            </div>
            <h2 className="text-white text-3xl font-bold mb-3">
              {contact?.participants?.[0]?.name}
            </h2>
            <p className="text-orange-200 text-lg mb-8">Đang gọi...</p>
            <div className="flex justify-center">
              <button
                onClick={onEndCall}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <IconX size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {isRecording && (
        <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl border border-red-400">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-bold">
            Đang ghi âm {formatRecordingTime(recordingTime)}
          </span>
        </div>
      )}

      {!isCalling && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 bg-black/30 backdrop-blur-md rounded-2xl p-4">
          <button
            onClick={onToggleVideo}
            className={`p-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl ${
              isVideoEnabled
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            } text-white`}
            title={isVideoEnabled ? 'Tắt camera' : 'Bật camera'}
          >
            {isVideoEnabled ? <IconVideo size={24} /> : <IconVideoOff size={24} />}
          </button>
          <button
            onClick={onToggleAudio}
            className={`p-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl ${
              isAudioEnabled
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            } text-white`}
            title={isAudioEnabled ? 'Tắt mic' : 'Bật mic'}
          >
            {isAudioEnabled ? <IconMicrophone size={24} /> : <IconMicrophoneOff size={24} />}
          </button>
          <button
            onClick={onEndCall}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
            title="Kết thúc cuộc gọi"
          >
            <IconX size={24} />
          </button>
          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`p-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl ${
              isRecording
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
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
