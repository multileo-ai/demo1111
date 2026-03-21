
import React, { useState, useRef } from 'react';

interface SosSliderProps {
  onActivate: () => void;
}

const SosSlider: React.FC<SosSliderProps> = ({ onActivate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const maxDrag = 240; // Approximate width minus button

  const handleStart = (clientX: number) => {
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const sliderLeft = sliderRef.current?.getBoundingClientRect().left || 0;
    let x = clientX - sliderLeft - 25; // Center offset
    if (x < 0) x = 0;
    if (x > maxDrag) x = maxDrag;
    setDragX(x);
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (dragX > maxDrag * 0.9) {
      onActivate();
    }
    setDragX(0);
  };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  
  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => handleEnd();

  return (
    <div 
      className="w-full h-14 border border-red-500/50 rounded-full bg-red-900/30 overflow-hidden flex items-center select-none shadow-sm relative"
      ref={sliderRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <div className="absolute inset-0 flex items-center justify-center text-white font-medium tracking-widest text-sm pointer-events-none opacity-80 animate-pulse">
        SLIDE TO SOS &rarr;
      </div>
      
      <div 
        className="w-12 h-12 bg-red-600 rounded-full ml-1 cursor-pointer flex items-center justify-center shadow-md relative z-10"
        style={{ transform: `translateX(${dragX}px)`, transition: isDragging ? 'none' : 'transform 0.3s ease' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleEnd}
        onMouseDown={onMouseDown}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8l4 4-4 4"/>
          <path d="M2 12h20"/>
        </svg>
      </div>
    </div>
  );
};

export default SosSlider;
