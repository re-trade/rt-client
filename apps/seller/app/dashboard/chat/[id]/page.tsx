'use client';

import { CallInterface } from '@/components/chat/CallInterface';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageInput } from '@/components/chat/MessageInput';
import { MessagesList } from '@/components/chat/MessagesList';
import { useMessengerContext } from '@/context/MessengerContext';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function MessageDetailPage() {
  const params = useParams();
  const pathname = usePathname();
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
    handleTyping,
    isSomeoneTyping,
    typingUser,
    startVideoCall,
    startAudioCall,
    endCall,
    toggleVideo,
    toggleAudio,
    startRecording,
    stopRecording,
    formatRecordingTime,
  } = useMessengerContext();

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (chatId) {
      setSelectedChatId(chatId);
    }
  }, [chatId, setSelectedChatId]);

  const handleMessageChange = (message: string) => {
    setNewMessage(message);

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    handleTyping(true);

    typingTimeout.current = setTimeout(() => {
      handleTyping(false);
    }, 2000);
  };

  if (isCalling && (isVideoCall || isAudioCall)) {
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

  const isOnSpecificChatPage =
    pathname.startsWith('/dashboard/chat/') && pathname !== '/dashboard/chat';

  return (
    <div
      className={`${isOnSpecificChatPage ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white h-full`}
    >
      <ChatHeader
        contact={selectedContact}
        onAudioCall={startAudioCall}
        onVideoCall={startVideoCall}
      />
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessagesList
          messages={messages}
          isSomeoneTyping={isSomeoneTyping}
          typingUser={typingUser}
        />
      </div>
      <MessageInput
        message={newMessage}
        onMessageChange={handleMessageChange}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
