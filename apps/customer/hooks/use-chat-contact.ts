'use client';

import { ClientToServerEvents, Message, Room, ServerToClientEvents } from '@/types/chat/chat';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useMessenger() {
  const [selectedContact, setSelectedContact] = useState<Room | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contacts, setContacts] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
            to: selectedContact.id,
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
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3001', {
      transports: ['websocket'],
      withCredentials: true,
    });

    socketRef.current = socket;

    const token = localStorage.getItem('access-token');
    if (!token) {
      socket.disconnect();
      router.push('/login');
      return;
    }

    socket.on('connect', () => {
      socket.emit('authenticate', {
        token,
        senderType: 'customer',
      });
    });

    const handleAuthSuccess = () => {
      setIsAuthenticated(true);
      socket.emit('getRooms');
    };

    socket.on('authSuccess', handleAuthSuccess);
    socket.on('rooms', (rooms) => setContacts(rooms));
    socket.on('roomJoined', (room) => {
      setSelectedContact(room);
      setMessages(room.messages || []);
    });
    socket.on('message', (msg) => setMessages((prev) => [...prev, msg]));
    socket.on('signal', (data) => handleSignalRef.current(data));
    return () => {
      socket.disconnect();
      socket.off('authSuccess', handleAuthSuccess);
      socket.off('rooms');
      socket.off('roomJoined');
      socket.off('message');
      socket.off('signal');
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
    socketRef.current.emit('sendMessage', {
      content: newMessage,
      receiverId: selectedContact.id,
    });
    setNewMessage('');
  };

  useEffect(() => {
    if (selectedContact) {
      const seller = selectedContact.participants.filter((p) => p.senderRole === 'seller').pop();
      if (seller) {
        router.push(`/chat/${seller.id}`);
      }
    }
  }, [selectedContact, router]);

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
            to: selectedContact.id,
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
        to: selectedContact.id,
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
        to: selectedContact.id,
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
    stopCamera();
    peerRef.current?.close();
    peerRef.current = null;
    setIsVideoCall(false);
    setIsAudioCall(false);
    setIsCalling(false);
    setIsRecording(false);
  };

  const toggleVideo = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
    }
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
