
import React from 'react';
import { IconPhone } from './Icons';

interface Props {
  onTrigger: () => void;
}

const FloatingFakeCall: React.FC<Props> = ({ onTrigger }) => {
  return (
    <button 
      onClick={onTrigger}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/5 backdrop-blur-sm w-12 h-12 rounded-l-full flex items-center justify-center shadow-sm z-30 active:bg-black/10 transition-all"
      aria-label="Fake Call"
    >
      <IconPhone className="w-5 h-5 text-black opacity-70" />
    </button>
  );
};

export default FloatingFakeCall;
