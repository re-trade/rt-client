'use client';

import { CallInterface } from '@/components/chat/CallInterface';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageInput } from '@/components/chat/MessageInput';
import { MessagesList } from '@/components/chat/MessagesList';
import { useMessengerContext } from '@/context/MessengerContext';
import { IconSend } from '@tabler/icons-react';

export default function MessengerPage() {
  const {
    selectedContact,
    messages,
    newMessage,
    isVideoCall,
    isAudioCall,
    isCalling,
    isVideoEnabled,
    isAudioEnabled,
    isRecording,
    recordingTime,
    videoRef,
    remoteVideoRef,
    setNewMessage,
    handleSendMessage,
    startVideoCall,
    startAudioCall,
    endCall,
    toggleVideo,
    toggleAudio,
    startRecording,
    stopRecording,
    formatRecordingTime,
  } = useMessengerContext();

  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconSend className="text-orange-500" size={32} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Chào mừng đến với Chat</h2>
          <p className="text-gray-600">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
        </div>
      </div>
    );
  }

  if (isVideoCall || isAudioCall) {
    return (
      <CallInterface
        contact={selectedContact}
        isVideoCall={isVideoCall}
        isAudioCall={isAudioCall}
        isCalling={isCalling}
        isVideoEnabled={isVideoEnabled}
        isAudioEnabled={isAudioEnabled}
        isRecording={isRecording}
        recordingTime={recordingTime}
        videoRef={videoRef}
        remoteVideoRef={remoteVideoRef}
        onToggleVideo={toggleVideo}
        onToggleAudio={toggleAudio}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onEndCall={endCall}
        formatRecordingTime={formatRecordingTime}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader
        contact={selectedContact}
        onAudioCall={startAudioCall}
        onVideoCall={startVideoCall}
      />
      <MessagesList messages={messages} />
      <MessageInput
        message={newMessage}
        onMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
