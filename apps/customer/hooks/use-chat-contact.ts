'use client';

import {
  ClientToServerEvents,
  getWebRTCConfig,
  mediaConstraints,
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

  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isAudioCall, setIsAudioCall] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [incomingCall, setIncomingCall] = useState<{
    callerId: string;
    callerName: string;
    roomId: string;
  } | null>(null);
  const [callState, setCallState] = useState<
    'idle' | 'calling' | 'ringing' | 'connected' | 'ended'
  >('idle');

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
          const sellerId =
            selectedContact.participants?.find((p) => p.senderRole === 'seller')?.id ||
            selectedContact.id;
          socketRef.current.emit('signal', {
            to: sellerId,
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

    socket.on('incomingCall', (data) => {
      setIncomingCall(data);
      setCallState('ringing');
    });

    socket.on('callAccepted', async (data) => {
      setCallState('connected');
      setIsCalling(false);

      if (!peerRef.current) {
        await startCamera(isVideoCall);
      }

      if (peerRef.current) {
        const offer = await peerRef.current.createOffer();
        await peerRef.current.setLocalDescription(offer);

        socket.emit('signal', {
          to: data.acceptedId,
          type: 'offer',
          data: offer,
          roomId: data.roomId,
        });
      }
    });

    socket.on('callRejected', (data) => {
      setCallState('ended');
      setIsCalling(false);
      setIsVideoCall(false);
      setIsAudioCall(false);
      stopCamera();
      console.log('Call rejected:', data.reason);
    });

    socket.on('call-ended', (data) => {
      setCallState('ended');
      setIsCalling(false);
      setIsVideoCall(false);
      setIsAudioCall(false);
      setIncomingCall(null);
      stopCamera();
    });

    // Add error handling for WebRTC issues
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      if (error.code === 'USER_OFFLINE') {
        alert('Người dùng hiện không trực tuyến. Vui lòng thử lại sau.');
      } else if (error.code === 'CALL_IN_PROGRESS') {
        alert('Người dùng đang trong cuộc gọi khác.');
      } else if (error.code === 'AUTH_ERROR') {
        alert('Lỗi xác thực. Vui lòng đăng nhập lại.');
      } else {
        alert('Có lỗi xảy ra khi thực hiện cuộc gọi.');
      }
      // Reset call state on error
      setCallState('idle');
      setIsCalling(false);
      setIsVideoCall(false);
      setIsAudioCall(false);
    });

    const handleTypingEvent = (data: {
      isTyping: boolean;
      username?: string;
      senderId?: string;
    }) => {
      setIsSomeoneTyping(data.isTyping);
      setTypingUser(data.isTyping ? data.username || 'Người bán' : null);
    };

    socket.on('typing', handleTypingEvent);
    return () => {
      socket.disconnect();
      socket.off('authSuccess', handleAuthSuccess);
      socket.off('rooms');
      socket.off('roomJoined');
      socket.off('message');
      socket.off('signal');
      socket.off('incomingCall');
      socket.off('callAccepted');
      socket.off('callRejected');
      socket.off('call-ended');
      socket.off('error');
      socket.off('typing', handleTypingEvent);
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
    const seller = selectedContact.participants.filter((p) => p.senderRole === 'seller').pop();
    if (!seller) return;
    socketRef.current.emit('sendMessage', {
      content: newMessage,
      receiverId: seller.id,
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

  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (!socketRef.current || !selectedContact) {
        return;
      }

      const seller = selectedContact.participants.find((p) => p.senderRole === 'seller');
      if (!seller) {
        return;
      }

      socketRef.current.emit('typing', {
        receiverId: seller.id,
        isTyping,
      });
    },
    [selectedContact],
  );

  const startCamera = useCallback(
    async (withVideo: boolean) => {
      try {
        const constraints = withVideo ? mediaConstraints.video : mediaConstraints.audio;
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (videoRef.current && withVideo) videoRef.current.srcObject = stream;

        const remoteStream = new MediaStream();
        remoteStreamRef.current = remoteStream;
        if (remoteVideoRef.current && withVideo) {
          remoteVideoRef.current.srcObject = remoteStream;
        }

        const webRTCConfig = getWebRTCConfig();
        const peer = new RTCPeerConnection(webRTCConfig);
        peerRef.current = peer;

        peer.onconnectionstatechange = () => {
          console.log('Connection state:', peer.connectionState);
        };

        peer.oniceconnectionstatechange = () => {
          console.log('ICE connection state:', peer.iceConnectionState);
        };

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
            const sellerId =
              selectedContact.participants?.find((p) => p.senderRole === 'seller')?.id ||
              selectedContact.id;
            socketRef.current.emit('signal', {
              to: sellerId,
              type: 'ice-candidate',
              data: event.candidate,
              roomId: selectedContact.id,
            });
          }
        };

        return peer;
      } catch (error) {
        console.error('Failed to start camera:', error);
        throw error;
      }
    },
    [selectedContact],
  );

  const startVideoCall = async () => {
    if (!socketRef.current || !selectedContact) {
      console.error('Socket or contact not available');
      return;
    }

    setIsVideoCall(true);
    setIsCalling(true);
    setCallState('calling');

    // Find the seller ID for customer app
    const sellerId =
      selectedContact.participants?.find((p) => p.senderRole === 'seller')?.id ||
      selectedContact.id;

    const callData = {
      recipientId: sellerId,
      roomId: selectedContact.id,
    };

    console.log('Starting video call with data:', callData);
    socketRef.current.emit('initiateCall', callData);

    setTimeout(() => {
      if (callState === 'calling') {
        console.log('Call timeout - no answer');
        endCall();
      }
    }, 30000);
  };

  const startAudioCall = async () => {
    if (!socketRef.current || !selectedContact) {
      console.error('Socket or contact not available');
      return;
    }

    setIsAudioCall(true);
    setIsCalling(true);
    setCallState('calling');

    socketRef.current.emit('initiateCall', {
      recipientId: selectedContact.id,
      roomId: selectedContact.id,
    });

    setTimeout(() => {
      if (callState === 'calling') {
        console.log('Call timeout - no answer');
        endCall();
      }
    }, 30000);
  };

  const acceptCall = async () => {
    if (!incomingCall || !socketRef.current) return;

    setCallState('connected');
    setIsVideoCall(true);
    setIncomingCall(null);

    await startCamera(true);

    socketRef.current.emit('acceptCall', {
      callerId: incomingCall.callerId,
      roomId: incomingCall.roomId,
    });
  };

  const rejectCall = () => {
    if (!incomingCall || !socketRef.current) return;

    socketRef.current.emit('rejectCall', {
      callerId: incomingCall.callerId,
      reason: 'Call declined',
    });

    setIncomingCall(null);
    setCallState('idle');
  };

  const endCall = () => {
    if (socketRef.current && selectedContact) {
      socketRef.current.emit('endCall', {
        roomId: selectedContact.id,
      });
    }

    setCallState('ended');
    setIsCalling(false);
    setIsVideoCall(false);
    setIsAudioCall(false);
    setIncomingCall(null);
    stopCamera();
    peerRef.current?.close();
    peerRef.current = null;
    setIsRecording(false);
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    remoteStreamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    remoteStreamRef.current = null;
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
    acceptCall,
    rejectCall,
    endCall,
    toggleVideo,
    toggleAudio,
    startRecording,
    stopRecording,
    formatRecordingTime,
    incomingCall,
    callState,
  };
}
