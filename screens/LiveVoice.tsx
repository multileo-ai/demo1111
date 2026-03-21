
import React, { useState, useRef, useEffect } from 'react';
import { connectToLiveSession } from '../services/geminiService';
import { IconMic, IconX, IconRadio } from '../components/Icons';

const LiveScreen: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [transcript, setTranscript] = useState<string>('');
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const disconnectRef = useRef<(() => void) | null>(null);
  
  // Audio Playback Logic
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      handleDisconnect();
    };
  }, []);

  const handleConnect = async () => {
    setStatus('connecting');
    setTranscript('Connecting to secure channel...');
    
    try {
      const session = await connectToLiveSession({
        onOpen: () => {
          setStatus('connected');
          setIsConnected(true);
          setTranscript("Secure line active. Listening...");
          
          // Init Audio Context for playback
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          nextStartTimeRef.current = audioContextRef.current.currentTime;
        },
        onMessage: async (text, audioBase64) => {
          if (text) {
            setTranscript(text);
          }
          if (audioBase64 && audioContextRef.current) {
            await playAudioChunk(audioBase64);
          }
        },
        onError: (err) => {
          console.error(err);
          setTranscript("Connection error.");
          setStatus('disconnected');
        },
        onClose: () => {
          setStatus('disconnected');
          setIsConnected(false);
        }
      });
      
      disconnectRef.current = session.disconnect;
    } catch (e) {
      console.error(e);
      setStatus('disconnected');
      setTranscript("Failed to connect. Check permissions.");
    }
  };

  const handleDisconnect = () => {
    if (disconnectRef.current) {
      disconnectRef.current();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsConnected(false);
    setStatus('disconnected');
  };

  // Helper to decode and play raw PCM
  const playAudioChunk = async (base64: string) => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }

    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
    source.start(startTime);
    nextStartTimeRef.current = startTime + buffer.duration;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-white relative overflow-hidden">
      {/* Background Animation */}
      {isConnected && (
         <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-96 h-96 bg-blue-50 rounded-full opacity-20 animate-pulse" style={{ animationDuration: '3s' }}></div>
            <div className="absolute w-64 h-64 bg-blue-100 rounded-full opacity-20 animate-pulse" style={{ animationDuration: '2s' }}></div>
         </div>
      )}

      <div className="z-10 text-center space-y-8 px-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-light">Voice Safety Companion</h2>
          <p className="text-sm text-gray-500">Real-time conversation with Savraksh AI.</p>
        </div>

        {/* Visualizer / Avatar */}
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
           <div className={`absolute inset-0 rounded-full border border-black transition-all duration-1000 ${isConnected ? 'scale-110 opacity-50 border-dashed animate-spin-slow' : 'scale-100 opacity-20'}`}></div>
           <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center shadow-2xl">
              <IconRadio className={`w-10 h-10 text-white ${isConnected ? 'animate-pulse' : ''}`} />
           </div>
        </div>

        {/* Transcript Area */}
        <div className="h-24 flex items-center justify-center">
          <p className="text-lg font-medium text-gray-800 animate-fade-in">
            {transcript || "Tap microphone to start"}
          </p>
        </div>

        {/* Controls */}
        <div className="pt-4">
          {!isConnected ? (
            <button 
              onClick={handleConnect}
              disabled={status === 'connecting'}
              className="px-8 py-4 bg-black text-white rounded-full font-bold flex items-center space-x-2 hover:scale-105 transition-transform"
            >
              <IconMic className="w-5 h-5" color="white" />
              <span>{status === 'connecting' ? 'Connecting...' : 'Start Conversation'}</span>
            </button>
          ) : (
            <button 
              onClick={handleDisconnect}
              className="px-8 py-4 border-2 border-red-500 text-red-500 rounded-full font-bold flex items-center space-x-2 hover:bg-red-50 transition-colors"
            >
              <IconX className="w-5 h-5" />
              <span>End Call</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveScreen;
