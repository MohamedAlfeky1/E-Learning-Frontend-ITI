import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";
import { sessionService } from '@/services/sessionService';

export default function VideoCall() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [myPeerId, setMyPeerId] = useState('');
  const [otherPeerId, setOtherPeerId] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStream, setHasStream] = useState(false); 
  
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const myStreamRef = useRef(null);
  const containerRef = useRef(null);

  console.log("otherPeerId" , otherPeerId);
  

  useEffect(() => {
    const initSession = async () => {
      if (!bookingId) {
        toast.error('No booking ID');
        navigate('/dashboard');
        return;
      }
      
      try {
        const { data } = await sessionService.joinSession(bookingId);
        console.log('Join session response:', data);

        setOtherPeerId(data?.data?.otherPeerId);
      } catch (error) {
        console.error('Failed to join session:', error);
        toast.error(error.response?.data?.message || 'Could not join session');
        navigate('/dashboard');
      }
    };
    
    initSession();
  }, [bookingId, navigate]);

  // the configration of camera and mic
  useEffect(() => {
    const setupMedia = async () => {
      try {
        console.log('Requesting camera/microphone...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        myStreamRef.current = stream;
        setHasStream(true); 
        
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
          console.log('Local video attached to element');
        }
        
        setIsConnecting(false);
      } catch (err) {
        console.error('Failed to get media:', err);
        toast.error('Cannot access camera/microphone. Please check permissions.');
        setIsConnecting(false);
        setHasStream(false);
      }
    };
    
    setupMedia();
    
    return () => {
      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // make sure that the video attached to the stream
  useEffect(() => {
    if (myStreamRef.current && myVideoRef.current) {
      myVideoRef.current.srcObject = myStreamRef.current;
    }
  }, []);

  // PeerJS
  useEffect(() => {
    if (!otherPeerId || !myStreamRef.current) return;

    let mounted = true;

    const setupPeer = async () => {
      console.log('Setting up PeerJS...');
      
      const peer = new Peer({
        host: '0.peerjs.com',
        port: 443,
        path: '/',
        secure: true,
      });

      peer.on('open', (id) => {
        if (!mounted) return;
        setMyPeerId(id);
        console.log('My Peer ID:', id);
        
        if (myStreamRef.current) {
          console.log('Calling:', otherPeerId);
          const call = peer.call(otherPeerId, myStreamRef.current);
          
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
        }
      });

      peer.on('call', (call) => {
        console.log('Incoming call from:', call.peer);
        
        if (myStreamRef.current) {
          call.answer(myStreamRef.current);
          
          call.on('stream', (remoteStream) => {
            console.log('Received remote stream from incoming call');
            setRemoteStream(remoteStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
          
          setIsCallActive(true);
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
    };
  }, [otherPeerId]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleMic = () => {
    if (myStreamRef.current) {
      const audioTrack = myStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        toast.info(audioTrack.enabled ? 'Microphone on' : 'Microphone off');
      }
    }
  };

  const toggleCamera = () => {
    if (myStreamRef.current) {
      const videoTrack = myStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
        toast.info(videoTrack.enabled ? 'Camera on' : 'Camera off');
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
          <p className="text-slate-400">Requesting camera access...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-900">
      <div className="w-full h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          
          {/* Remote Video */}
          <div className="relative bg-slate-800 flex items-center justify-center">
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover" 
            />
            {!remoteStream && !isCallActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-slate-500">
                <User size={80} className="animate-pulse mb-4" />
                <p className="font-bold text-lg">Waiting for the other person...</p>
                <p className="text-sm mt-2">Your Peer ID: {myPeerId}</p>
              </div>
            )}
            <div className="absolute bottom-6 left-6">
              <Badge className="bg-black/60 backdrop-blur-md border-none text-white px-4 py-2 rounded-xl text-sm">
                Remote Participant
              </Badge>
            </div>
          </div>

          {/* My Video */}
          <div className="relative bg-slate-800 flex items-center justify-center">
            <video 
              ref={myVideoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-6 left-6">
              <Badge className="bg-[#6332E3]/80 backdrop-blur-md border-none text-white px-4 py-2 rounded-xl text-sm">
                You {isCameraOff && '(Camera Off)'}
              </Badge>
            </div>
            {!hasStream && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Control Bar */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-2xl p-4 rounded-full border border-white/20 shadow-2xl">
          
          <Button 
            variant="outline" 
            onClick={toggleMic}
            className={`rounded-full w-12 h-12 md:w-14 md:h-14 border-none ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>

          <Button 
            variant="outline" 
            onClick={toggleCamera}
            className={`rounded-full w-12 h-12 md:w-14 md:h-14 border-none ${isCameraOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
          </Button>

          <Button 
            variant="outline" 
            onClick={toggleFullscreen}
            className="rounded-full w-12 h-12 md:w-14 md:h-14 border-none bg-white/10 text-white hover:bg-white/20"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </Button>

          <Button 
            onClick={endCall}
            className="rounded-full w-12 h-12 md:w-14 md:h-14 bg-red-500 hover:bg-red-600 text-white border-none shadow-lg shadow-red-500/20"
          >
            <PhoneOff size={20} />
          </Button>

        </div>
      </div>
    </div>
  );
}