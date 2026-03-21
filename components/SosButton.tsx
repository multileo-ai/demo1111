
import React from 'react';
import { IconShield } from './Icons';

interface Props {
  onClick: () => void;
}

const SosButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="absolute bottom-24 right-4 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl z-30 active:scale-90 transition-transform animate-pulse-slow border-4 border-white/20"
      aria-label="Trigger SOS"
    >
      <span className="font-bold text-white text-xs absolute top-10">SOS</span>
      <IconShield className="w-6 h-6 text-white mb-1" strokeWidth={2.5} />
    </button>
  );
};

export default SosButton;
