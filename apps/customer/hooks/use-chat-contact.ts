'use client';

import { ClientToServerEvents, Message, Room, ServerToClientEvents } from '@/types/chat';
import { SignalData } from '@/types/webrtc';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useMessenger() {
  const [selectedContact, setSelectedContact] = useState<Room | null>(null);
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

  useEffect(() => {
    const socket = io('http://localhost:3001', {
      transports: ['websocket'],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('authenticate', {
        token: localStorage.getItem('access-token'),
        senderType: 'customer',
      });
      socket.emit('');
    });

    socket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('signal', async (data: SignalData) => {
      await handleSignal(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedContact && socketRef.current) {
      socketRef.current.emit('joinRoom', selectedContact.id);
    }

    return () => {
      if (selectedContact && socketRef.current) {
        socketRef.current.emit('leaveRoom', selectedContact.id);
      }
    };
  }, [selectedContact]);

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
      roomId: selectedContact.id,
    });

    setNewMessage('');
  };

  const startCamera = async (withVideo: boolean) => {
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
      event.streams[0].getTracks().forEach((track) => {
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
  };

  const startVideoCall = async () => {
    setIsVideoCall(true);
    setIsCalling(true);
    const peer = await startCamera(true);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socketRef.current?.emit('signal', {
      to: selectedContact?.id || '',
      type: 'offer',
      data: offer,
      roomId: selectedContact?.id || '',
    });
  };

  const startAudioCall = async () => {
    setIsAudioCall(true);
    setIsCalling(true);
    const peer = await startCamera(false);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socketRef.current?.emit('signal', {
      to: selectedContact?.id || '',
      type: 'offer',
      data: offer,
      roomId: selectedContact?.id || '',
    });
  };

  const handleSignal = async (data: SignalData) => {
    const { type, data: signalData } = data;
    const peer = peerRef.current;
    if (!peer) return;

    if (type === 'offer') {
      await startCamera(true);
      await peer.setRemoteDescription(new RTCSessionDescription(signalData));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socketRef.current?.emit('signal', {
        to: selectedContact?.id || '',
        type: 'answer',
        data: answer,
        roomId: selectedContact?.id || '',
      });
    } else if (type === 'answer') {
      await peer.setRemoteDescription(new RTCSessionDescription(signalData));
    } else if (type === 'ice-candidate') {
      try {
        await peer.addIceCandidate(new RTCIceCandidate(signalData));
      } catch (err) {}
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
