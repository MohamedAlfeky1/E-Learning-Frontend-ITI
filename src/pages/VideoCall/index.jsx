import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sessionService } from '@/services/sessionService';

export default function VideoCall() {
  const {bookingId} = useParams();
  console.log("theeId", bookingId);
  
  const navigate = useNavigate();
  
  const [myPeerId, setMyPeerId] = useState('');
  const [otherPeerId, setOtherPeerId] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  
  const myVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerInstance = useRef(null);
  const myStreamRef = useRef();

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data } = await sessionService.joinSession(bookingId);
        console.log('Join session response:', data);
        
        setOtherPeerId(data.otherPeerId);
        setIsConnecting(false);
      } catch (error) {
        console.error('Failed to join session:', error);
        toast.error(error.response?.data?.message || 'Could not join session');
        navigate('/dashboard');
      }
    };
    
    initSession();
  }, [bookingId, navigate]);

  useEffect(() => {
    if (!otherPeerId) return;

    let mounted = true;

    const setupPeer = async () => {
      const peer = new Peer({
        host: '0.peerjs.com',
        port: 443,
        path: '/',
        secure: true,
      });

      peer.on('open', async (id) => {
        if (!mounted) return;
        
        setMyPeerId(id);
        console.log('My Peer ID:', id);
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          });
          
          myStreamRef.current = stream;
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }
          
          console.log('Calling:', otherPeerId);
          const call = peer.call(otherPeerId, stream);
          
          call.on('stream', (remoteStream) => {
            console.log('Received remote stream');
            setRemoteStream(remoteStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
          
          call.on('error', (err) => {
            console.error('Call error:', err);
            toast.error('Connection error');
          });
          
          setIsCallActive(true);
          
        } catch (err) {
          console.error('Failed to get media:', err);
          toast.error('Cannot access camera/microphone');
        }
      });

      peer.on('call', async (call) => {
        console.log('Incoming call from:', call.peer);
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          });
          
          myStreamRef.current = stream;
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }
          
          call.answer(stream);
          
          call.on('stream', (remoteStream) => {
            console.log('Received remote stream from incoming call');
            setRemoteStream(remoteStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
          
          setIsCallActive(true);
        } catch (err) {
          console.error('Failed to answer call:', err);
        }
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
        toast.error('Connection error');
      });

      peerInstance.current = peer;
    };

    setupPeer();

    return () => {
      mounted = false;
      if (peerInstance.current) {
        peerInstance.current.destroy();
      }
      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [otherPeerId]);

  const toggleMic = () => {
    if (myStreamRef.current) {
      const audioTrack = myStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (myStreamRef.current) {
      const videoTrack = myStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
      }
    }
  };

  const endCall = async () => {
    try {
      await sessionService.endSession(bookingId);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
    
    if (peerInstance.current) {
      peerInstance.current.destroy();
    }
    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    navigate('/dashboard');
    toast.info('Session ended');
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-slate-400">Connecting to session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        
        <Card className="relative overflow-hidden rounded-[2.5rem] bg-slate-800 border-none aspect-video flex items-center justify-center shadow-2xl">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          {!remoteStream && isCallActive === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-slate-500">
              <User size={80} className="animate-pulse mb-4" />
              <p className="font-bold">Waiting for the other person...</p>
              <p className="text-sm mt-2">Your Peer ID: {myPeerId}</p>
            </div>
          )}
          <div className="absolute bottom-6 left-6">
            <Badge className="bg-black/40 backdrop-blur-md border-none text-white px-4 py-2 rounded-xl">
              Remote Participant
            </Badge>
          </div>
        </Card>

        <Card className="relative overflow-hidden rounded-[2.5rem] bg-slate-800 border-none aspect-video shadow-2xl">
          <video ref={myVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-6 left-6">
            
          </div>
        </Card>

      </div>

      {/* Control Bar */}
      <div className="fixed bottom-10 flex items-center gap-4 bg-white/10 backdrop-blur-2xl p-6 rounded-[3rem] border border-white/10 shadow-2xl">
        <Button 
          variant="outline" 
          onClick={toggleMic}
          className={`rounded-full w-14 h-14 border-none ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </Button>

        <Button 
          variant="outline" 
          onClick={toggleCamera}
          className={`rounded-full w-14 h-14 border-none ${isCameraOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
        </Button>

        <Button 
          onClick={endCall}
          className="rounded-full w-20 h-14 bg-red-500 hover:bg-red-600 text-white border-none shadow-lg shadow-red-500/20"
        >
          <PhoneOff size={20} />
        </Button>
      </div>
    </div>
  );
}