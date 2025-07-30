import {
  ClientToServerEvents,
  ETokenName,
  Message,
  Room,
  ServerToClientEvents,
  socket,
} from '@retrade/util';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

export function useMessenger() {
  const [selectedContact, setSelectedContact] = useState<Room | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSomeoneTyping, setIsSomeoneTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for testing - remove this when real data is working
  const mockContacts: Room[] = [
    {
      id: '1',
      isPrivate: true,
      createdAt: new Date('2024-01-15T10:30:00Z'),
      updatedAt: new Date('2024-01-15T14:45:00Z'),
      sellerId: 'seller-1',
      customerId: 'customer-1',
      participants: [
        {
          id: 'customer-1',
          username: 'customer1',
          name: 'Nguyễn Văn A',
          role: ['customer'],
          senderRole: 'customer',
          avatarUrl: '/placeholder.svg',
          isOnline: true,
        },
        {
          id: 'seller-1',
          username: 'seller1',
          name: 'Shop ABC',
          role: ['seller'],
          senderRole: 'seller',
          avatarUrl: '/placeholder.svg',
          isOnline: true,
        },
      ],
    },
    {
      id: '2',
      isPrivate: true,
      createdAt: new Date('2024-01-14T09:15:00Z'),
      updatedAt: new Date('2024-01-14T16:20:00Z'),
      sellerId: 'seller-1',
      customerId: 'customer-2',
      participants: [
        {
          id: 'customer-2',
          username: 'customer2',
          name: 'Trần Thị B',
          role: ['customer'],
          senderRole: 'customer',
          avatarUrl: '/placeholder.svg',
          isOnline: false,
        },
        {
          id: 'seller-1',
          username: 'seller1',
          name: 'Shop ABC',
          role: ['seller'],
          senderRole: 'seller',
          avatarUrl: '/placeholder.svg',
          isOnline: true,
        },
      ],
    },
  ];

  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isAudioCall, setIsAudioCall] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const router = useRouter();

  const handleSignal = useCallback(
    async (data: {
      from: string;
      type: 'signal' | 'offer' | 'answer' | 'ice-candidate';
      data: any;
      roomId: string;
    }) => {
      const { type, data: signalData } = data;
      const peer = peerRef.current;
      if (!peer) return;

      if (type === 'offer') {
        await startCamera(true);
        await peer.setRemoteDescription(new RTCSessionDescription(signalData));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        if (socketRef.current && selectedContact) {
          socketRef.current.emit('signal', {
            to: selectedContact.customerId,
            type: 'answer',
            data: answer,
            roomId: selectedContact.id,
          });
        }
      } else if (type === 'answer') {
        await peer.setRemoteDescription(new RTCSessionDescription(signalData));
      } else if (type === 'ice-candidate') {
        try {
          await peer.addIceCandidate(new RTCIceCandidate(signalData));
        } catch {}
      }
    },
    [selectedContact],
  );

  const handleSignalRef = useRef(handleSignal);
  handleSignalRef.current = handleSignal;

  useEffect(() => {
    socketRef.current = socket;

    const token = localStorage.getItem(ETokenName.ACCESS_TOKEN);
    if (!token) {
      socket.disconnect();
      router.push('/login');
      return;
    }

    socket.on('connect', () => {
      socket.emit('authenticate', {
        token,
        senderType: 'seller',
      });
    });

    const handleAuthSuccess = () => {
      setIsAuthenticated(true);
      socket.emit('getRooms');

      // Fallback: If no rooms are received within 3 seconds, use mock data
      setTimeout(() => {
        if (contacts.length === 0) {
          setContacts(mockContacts);
        }
      }, 3000);
    };

    const handleAuthError = (error: any) => {
      console.error('Seller Chat: Authentication failed:', error);
      setIsAuthenticated(false);
      localStorage.removeItem(ETokenName.ACCESS_TOKEN);
      router.push('/login');
    };

    socket.on('authSuccess', handleAuthSuccess);
    socket.on('authError', handleAuthError);
    socket.on('rooms', (rooms) => {
      if (rooms && rooms.length > 0) {
        setContacts(rooms);
      } else {
        setContacts(mockContacts);
      }
    });
    socket.on('roomJoined', (room) => {
      setSelectedContact(room);
      setMessages(room.messages || []);
    });
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('signal', (data) => handleSignalRef.current(data));
    socket.on('typing', (data) => {
      setIsSomeoneTyping(data.isTyping);
      setTypingUser(data.isTyping ? data.username : null);
    });

    // Trigger connection if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
      socket.off('authSuccess', handleAuthSuccess);
      socket.off('authError', handleAuthError);
      socket.off('rooms');
      socket.off('roomJoined');
      socket.off('message');
      socket.off('signal');
      socket.off('typing');
    };
  }, [router]);

  useEffect(() => {
    if (!socketRef.current) return;
    if (!selectedChatId) return;
    if (!isAuthenticated) return;
    socketRef.current.emit('joinRoom', selectedChatId);
  }, [selectedChatId, isAuthenticated]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact || !socketRef.current) return;
    const customer = selectedContact.participants.filter((p) => p.senderRole === 'customer').pop();
    if (!customer) return;
    socketRef.current.emit('sendMessage', {
      content: newMessage,
      receiverId: customer.id,
    });
    setNewMessage('');
  };

  useEffect(() => {
    if (selectedContact) {
      const customer = selectedContact.participants
        .filter((p) => p.senderRole === 'customer')
        .pop();
      if (customer) {
        router.push(`/dashboard/chat/${customer.id}`);
      }
    }
  }, [selectedContact, router]);

  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (!socketRef.current || !selectedContact) return;

      const customer = selectedContact.participants.find((p) => p.senderRole === 'customer');
      if (!customer) return;

      socketRef.current.emit('typing', {
        receiverId: customer.id,
        isTyping,
      });
    },
    [selectedContact],
  );

  const startCamera = useCallback(
    async (withVideo: boolean) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: withVideo,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current && withVideo) videoRef.current.srcObject = stream;

      const remoteStream = new MediaStream();
      remoteStreamRef.current = remoteStream;
      if (remoteVideoRef.current && withVideo) {
        remoteVideoRef.current.srcObject = remoteStream;
      }

      const peer = new RTCPeerConnection();
      peerRef.current = peer;

      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      peer.ontrack = (event) => {
        event.streams[0]?.getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      peer.onicecandidate = (event) => {
        if (event.candidate && socketRef.current && selectedContact) {
          socketRef.current.emit('signal', {
            to: selectedContact.customerId,
            type: 'ice-candidate',
            data: event.candidate,
            roomId: selectedContact.id,
          });
        }
      };

      return peer;
    },
    [selectedContact],
  );

  const startVideoCall = async () => {
    setIsVideoCall(true);
    setIsCalling(true);
    const peer = await startCamera(true);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    if (socketRef.current && selectedContact) {
      socketRef.current.emit('signal', {
        to: selectedContact.customerId,
        type: 'offer',
        data: offer,
        roomId: selectedContact.id,
      });
    }
  };

  const startAudioCall = async () => {
    setIsAudioCall(true);
    setIsCalling(true);
    const peer = await startCamera(false);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    if (socketRef.current && selectedContact) {
      socketRef.current.emit('signal', {
        to: selectedContact.customerId,
        type: 'offer',
        data: offer,
        roomId: selectedContact.id,
      });
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    remoteStreamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    remoteStreamRef.current = null;
  };

  const endCall = () => {
    setIsVideoCall(false);
    setIsAudioCall(false);
    setIsCalling(false);
    setIsRecording(false);
    setRecordingTime(0);
    stopCamera();
    peerRef.current?.close();
    peerRef.current = null;
  };

  const toggleVideo = () => {
    setIsVideoEnabled((prev) => {
      const newState = !prev;
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach((track) => {
          track.enabled = newState;
        });
      }
      return newState;
    });
  };

  const toggleAudio = () => {
    setIsAudioEnabled((prev) => {
      const newState = !prev;
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = newState;
        });
      }
      return newState;
    });
  };

  const startRecording = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);

  const formatRecordingTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return {
    selectedContact,
    setSelectedContact,
    contacts,
    messages,
    newMessage,
    setNewMessage,
    setSelectedChatId,
    searchQuery,
    setSearchQuery,
    handleSendMessage,
    videoRef,
    remoteVideoRef,
    audioRef,
    handleTyping,
    isSomeoneTyping,
    typingUser,
    isVideoCall,
    isAudioCall,
    isCalling,
    isVideoEnabled,
    isAudioEnabled,
    isRecording,
    recordingTime,
    startVideoCall,
    startAudioCall,
    endCall,
    toggleVideo,
    toggleAudio,
    startRecording,
    stopRecording,
    formatRecordingTime,
  };
}
