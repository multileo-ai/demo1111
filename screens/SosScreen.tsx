
import React, { useEffect, useState } from 'react';
import { IconMapPin, IconShield, IconUsers, IconHome, IconCheck, IconX } from '../components/Icons';

interface Props {
  onCancel: () => void;
}

const SosScreen: React.FC<Props> = ({ onCancel }) => {
  const [statusStep, setStatusStep] = useState(0);

  useEffect(() => {
    // Simulate progression of SOS actions
    const timers = [
      setTimeout(() => setStatusStep(1), 500),
      setTimeout(() => setStatusStep(2), 1500),
      setTimeout(() => setStatusStep(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="absolute inset-0 z-[100] bg-red-600 flex flex-col pt-12 animate-fade-in overflow-hidden text-white">
      
      {/* Background Pulse Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500 rounded-full animate-ping opacity-30 duration-[3000ms]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500 rounded-full animate-ping opacity-40 delay-300 duration-[3000ms]"></div>
      </div>

      {/* Header */}
      <div className="px-6 flex justify-between items-start z-10">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">SOS ACTIVE</h1>
           <p className="text-sm text-red-100 mt-1">Help is on the way.</p>
        </div>
        <div className="animate-pulse">
          <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
        </div>
      </div>

      {/* Location Card */}
      <div className="mx-6 mt-8 p-4 bg-red-700/50 backdrop-blur-md border border-red-400/30 rounded-2xl flex items-start space-x-3 shadow-lg z-10">
        <div className="bg-white/20 p-2 rounded-full border border-white/20">
          <IconMapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase text-red-200 tracking-wider">Current Location</h3>
          <p className="font-semibold text-lg text-white">Koregaon Park, Lane 5</p>
          <p className="text-xs text-red-200 mt-0.5">Lat: 18.5362° N, Lng: 73.8940° E</p>
          <p className="text-[10px] text-white/80 font-medium mt-1">Accuracy: High (GPS)</p>
        </div>
      </div>

      {/* Status Checklist */}
      <div className="px-8 mt-10 space-y-6 z-10">
        <StatusItem 
          icon={IconShield} 
          label="Alert sent to Police Control Room" 
          active={statusStep >= 1} 
          delay={0}
        />
        <StatusItem 
          icon={IconUsers} 
          label="Live Location shared with Contacts" 
          active={statusStep >= 2} 
          delay={200}
        />
        <StatusItem 
          icon={IconHome} 
          label="Nearby Safe Spots notified" 
          active={statusStep >= 3} 
          delay={400}
        />
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Cancel Button */}
      <div className="px-6 mb-12 z-20">
        <button 
          onClick={onCancel}
          className="w-full py-4 bg-white text-red-600 font-bold rounded-xl active:bg-red-50 transition-colors flex items-center justify-center space-x-2 shadow-xl"
        >
          <IconX className="w-5 h-5" />
          <span>CANCEL EMERGENCY</span>
        </button>
      </div>

      {/* Line Art Illustration (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none opacity-20 z-0">
         <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
             <IconShield className="w-40 h-40 text-black" strokeWidth={0.5} />
         </div>
      </div>

    </div>
  );
};

const StatusItem = ({ icon: Icon, label, active, delay }: any) => (
  <div className={`flex items-center space-x-4 transition-all duration-500 ${active ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'}`} style={{ transitionDelay: `${delay}ms` }}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${active ? 'bg-white text-red-600 border-white' : 'bg-transparent border-red-300 text-red-300'}`}>
      {active ? <IconCheck className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
    </div>
    <span className={`text-sm font-medium ${active ? 'text-white' : 'text-red-200'}`}>{label}</span>
  </div>
);

export default SosScreen;
