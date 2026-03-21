
import React, { useEffect, useState, useRef } from 'react';
import { IconPhone, IconPhoneOff } from '../components/Icons';

interface Props {
  onEnd: () => void;
}

const FakeCallScreen: React.FC<Props> = ({ onEnd }) => {
  const [timer, setTimer] = useState<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    let vibrationInterval: any = null;

    if (timer === null) {
      // --- START RINGING ---
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          // Recursive function to play ring loops
          const playLoop = () => {
            if (!audioCtxRef.current) return;
            const t = ctx.currentTime;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            // "Digital Phone" Sound Profile
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1050, t); 
            
            // Volume Envelope (Double Beep: Beep... Beep... Silence)
            const vol = 0.5;
            
            // Beep 1
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(vol, t + 0.1);
            gain.gain.linearRampToValueAtTime(0, t + 0.4);

            // Beep 2
            gain.gain.setValueAtTime(0, t + 0.6);
            gain.gain.linearRampToValueAtTime(vol, t + 0.7);
            gain.gain.linearRampToValueAtTime(0, t + 1.0);

            osc.start(t);
            osc.stop(t + 2.5); // Stop oscillator after the sound pattern

            // Schedule next loop (every 3 seconds)
            timeoutRef.current = setTimeout(playLoop, 3000);
          };

          playLoop();
        }

        // Haptic Feedback
        if (navigator.vibrate) {
           navigator.vibrate([400, 200, 400, 2000]); // Initial
           vibrationInterval = setInterval(() => {
              navigator.vibrate([400, 200, 400, 2000]);
           }, 3000);
        }

      } catch (e) {
        console.error("Audio/Vibration init failed", e);
      }
    }

    // Cleanup function when timer changes (call accepted) or unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (vibrationInterval) {
        clearInterval(vibrationInterval);
      }
      if (navigator.vibrate) {
        navigator.vibrate(0);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [timer]);

  useEffect(() => {
    let interval: any;
    if (timer !== null) {
      interval = setInterval(() => setTimer(t => (t !== null ? t + 1 : 1)), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAccept = () => {
    setTimer(0);
  };

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col items-center pt-20 pb-12 text-black">
      <div className="flex-1 flex flex-col items-center w-full px-8">
        
        <div className="w-32 h-32 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mb-6">
          <IconPhone className="w-12 h-12 text-gray-400" strokeWidth={1} />
        </div>

        <h2 className="text-3xl font-light text-center mb-2">SafeLine Security</h2>
        <p className="text-gray-500 text-sm mb-8">
          {timer === null ? 'Incoming Secure Call...' : formatTime(timer)}
        </p>

        {timer === null && <div className="text-lg animate-pulse font-medium">Ringing...</div>}
      </div>

      {/* Call Controls */}
      <div className="w-full px-12 flex justify-between items-end mb-12">
        {timer === null ? (
          <>
             <div className="flex flex-col items-center space-y-2">
               <button onClick={onEnd} className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                 <IconPhoneOff className="w-8 h-8 text-white" fill="currentColor" />
               </button>
               <span className="text-xs text-gray-500">Decline</span>
             </div>
             
             <div className="flex flex-col items-center space-y-2">
               <button onClick={handleAccept} className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg active:scale-95 transition-transform animate-bounce">
                 <IconPhone className="w-8 h-8 text-white" fill="currentColor" />
               </button>
               <span className="text-xs text-gray-500">Accept</span>
             </div>
          </>
        ) : (
          <div className="w-full flex justify-center">
             <button onClick={onEnd} className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg active:scale-95 transition-transform">
               <IconPhoneOff className="w-8 h-8 text-white" fill="currentColor" />
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FakeCallScreen;
