'use client';

import { useMessengerContext } from '@/context/MessengerContext';
import { CallInterface } from '@components/chat/CallInterface';
import { ChatHeader } from '@components/chat/ChatHeader';
import { MessageInput } from '@components/chat/MessageInput';
import { MessagesList } from '@components/chat/MessagesList';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function MessageDetailPage() {
  const params = useParams();
  const chatId = params.id as string;

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
    setSelectedChatId,
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

  useEffect(() => {
    if (chatId) {
      setSelectedChatId(chatId);
    }
  }, [chatId, setSelectedChatId]);

  if (chatId && !selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    );
  }

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Chat not found</div>
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
