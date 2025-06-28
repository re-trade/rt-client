'use client';

import { useEffect, useRef, useState } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'seller';
  timestamp: Date;
  type: 'text' | 'image';
  imageUrl?: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
}

export function useMessenger() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isAudioCall, setIsAudioCall] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mock contacts data
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'Sản phẩm còn không bạn?',
      timestamp: '2 phút',
      isOnline: true,
      unreadCount: 2,
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'Cảm ơn bạn nhé!',
      timestamp: '15 phút',
      isOnline: false,
      unreadCount: 0,
    },
    {
      id: '3',
      name: 'Lê Minh Cường',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'Giá này có thương lượng được không?',
      timestamp: '1 giờ',
      isOnline: true,
      unreadCount: 1,
    },
  ];

  // Mock messages for selected contact - Fixed to trigger when selectedContact changes
  useEffect(() => {
    if (selectedContact) {
      console.log('Loading messages for contact:', selectedContact.name); // Debug log

      // Simulate loading delay
      const loadMessages = () => {
        const mockMessages: Message[] = [
          {
            id: '1',
            text: 'Chào bạn, tôi quan tâm đến sản phẩm này',
            sender: 'customer',
            timestamp: new Date(Date.now() - 3600000),
            type: 'text',
          },
          {
            id: '2',
            text: 'Chào bạn! Sản phẩm vẫn còn nhé. Bạn có câu hỏi gì không?',
            sender: 'seller',
            timestamp: new Date(Date.now() - 3500000),
            type: 'text',
          },
          {
            id: '3',
            text: `Tình trạng sản phẩm như thế nào ạ? (Tin nhắn với ${selectedContact.name})`,
            sender: 'customer',
            timestamp: new Date(Date.now() - 3000000),
            type: 'text',
          },
        ];
        setMessages(mockMessages);
      };

      // Small delay to simulate real data loading
      const timer = setTimeout(loadMessages, 100);
      return () => clearTimeout(timer);
    } else {
      setMessages([]);
    }
  }, [selectedContact]); // This dependency ensures messages reload when contact changes

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      // Cleanup streams on component unmount
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream, remoteStream]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'seller',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    }
  };

  const startVideoCall = async () => {
    setIsVideoCall(true);
    setIsCalling(true);
    if (audioRef.current) {
      audioRef.current.play();
    }

    // Start camera when video call begins
    await startCamera();

    setTimeout(() => {
      setIsCalling(false);
    }, 3000);
  };

  const startAudioCall = async () => {
    setIsAudioCall(true);
    setIsCalling(true);
    if (audioRef.current) {
      audioRef.current.play();
    }

    // Start audio stream for audio call
    await startCamera();

    setTimeout(() => {
      setIsCalling(false);
    }, 3000);
  };

  const endCall = () => {
    setIsVideoCall(false);
    setIsAudioCall(false);
    setIsCalling(false);
    setIsRecording(false);
    stopCamera();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: isVideoCall,
        audio: true,
      });
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const simulatedRemoteStream = await navigator.mediaDevices.getUserMedia({
        video: isVideoCall,
        audio: true,
      });
      setRemoteStream(simulatedRemoteStream);

      if (remoteVideoRef.current && isVideoCall) {
        remoteVideoRef.current.srcObject = simulatedRemoteStream;
      }
    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return {
    selectedContact,
    messages,
    newMessage,
    isVideoCall,
    isAudioCall,
    isCalling,
    isVideoEnabled,
    isAudioEnabled,
    searchQuery,
    stream,
    remoteStream,
    isRecording,
    recordingTime,
    contacts: filteredContacts,

    videoRef,
    remoteVideoRef,
    audioRef,

    setSelectedContact,
    setNewMessage,
    setSearchQuery,
    handleSendMessage,
    startVideoCall,
    startAudioCall,
    endCall,
    startCamera,
    stopCamera,
    toggleVideo,
    toggleAudio,
    startRecording,
    stopRecording,
    formatRecordingTime,
  };
}
