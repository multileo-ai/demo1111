
import React, { useState, useRef } from 'react';
import { IconUser, IconMapPin, IconPhone, IconAlert, IconRadio, IconX, IconShield, IconCheck, IconCar } from '../components/Icons';
import { ScreenType } from '../types';

interface HomeProps {
  userName?: string;
  userImage?: string | null;
  onFakeCallTrigger?: () => void;
  onNavigate?: (screen: ScreenType) => void;
}

const HomeScreen: React.FC<HomeProps> = ({ userName = "Aarya", userImage, onFakeCallTrigger, onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState('Heatmap ON');
  const [showToast, setShowToast] = useState(false);
  const [showScoreDetails, setShowScoreDetails] = useState(false);

  // Map Interaction State
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Expanded Grid-based Location Mapping
  const locationGrid: Record<string, string> = {
    "0,0": "Koregaon Park",
    "1,0": "Kalyani Nagar",
    "2,0": "Viman Nagar",
    "3,0": "Lohegaon",
    "-1,0": "Bund Garden",
    "-2,0": "Shivajinagar",
    "-3,0": "Aundh",
    "0,1": "Mundhwa",
    "0,2": "Hadapsar",
    "0,3": "Manjari",
    "0,-1": "Osho Park",
    "0,-2": "Boat Club Rd",
    "1,1": "Kharadi",
    "-1,-1": "Pune Station",
    "1,-1": "Yerwada",
    "-1,1": "Camp",
    "2,1": "Chandan Nagar",
    "-2,1": "Swargate",
    "-2,-1": "FC Road",
    "1,2": "Magarpatta",
    "-1,2": "Wanowrie"
  };

  // Real-time Calculation for Zone and Score
  const getZoneAndScore = () => {
    // 1. Determine Zone Name
    const gridX = Math.round(-mapOffset.x / 100); 
    const gridY = Math.round(-mapOffset.y / 100);
    const key = `${gridX},${gridY}`;
    const zone = locationGrid[key] || "Pune City Area";

    // 2. Calculate Safety Score (Deterministic Noise based on position)
    // Create meaningful fluctuations as user drags
    const x = mapOffset.x;
    const y = mapOffset.y;
    
    // Combine sine waves to create 'peaks' (safe) and 'valleys' (unsafe)
    const noise = Math.sin(x * 0.008) * Math.cos(y * 0.008) * 2.5 
                  + Math.sin(x * 0.02 + y * 0.02);
    
    // Base score 7.8, fluctuate by +/- 3.5, clamp between 3.8 and 9.9
    let rawScore = 7.8 + noise;
    rawScore = Math.max(3.8, Math.min(9.9, rawScore));
    
    let status = "Safe Condition";
    let statusColor = "text-green-600 bg-green-50";
    
    if (rawScore < 5.5) {
      status = "High Risk Area";
      statusColor = "text-red-600 bg-red-50";
    } else if (rawScore < 7.5) {
      status = "Moderate Caution";
      statusColor = "text-yellow-600 bg-yellow-50";
    }

    return { 
      zone, 
      score: rawScore.toFixed(1), 
      rawScore,
      status,
      statusColor
    };
  };

  const { zone, score, rawScore, status, statusColor } = getZoneAndScore();

  const handleSendLocation = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSafeSpot = () => {
    setActiveFilter('Safe Routes');
  };

  const getHeatmapGradient = () => {
    if (activeFilter !== 'Heatmap ON') return 'none';
    const x = mapOffset.x;
    const y = mapOffset.y;
    
    // Multi-color gradients: Green (Safe), Yellow (Caution), Red (Danger)
    // These move opposite to drag direction to stick to "map coordinates"
    return `
      radial-gradient(circle at ${50 + (x / 6)}% ${50 + (y / 6)}%, rgba(255, 0, 0, 0.4) 0%, rgba(255, 0, 0, 0) 25%),
      radial-gradient(circle at ${20 + (x / 4)}% ${20 + (y / 4)}%, rgba(34, 197, 94, 0.5) 0%, rgba(34, 197, 94, 0) 25%),
      radial-gradient(circle at ${80 + (x / 5)}% ${80 + (y / 5)}%, rgba(34, 197, 94, 0.6) 0%, rgba(34, 197, 94, 0) 28%),
      radial-gradient(circle at ${80 + (x / 7)}% ${20 + (y / 7)}%, rgba(234, 179, 8, 0.5) 0%, rgba(234, 179, 8, 0) 20%),
      radial-gradient(circle at ${20 + (x / 5)}% ${80 + (y / 5)}%, rgba(239, 68, 68, 0.5) 0%, rgba(239, 68, 68, 0) 18%),
      radial-gradient(circle at ${50 + (x / 3)}% ${10 + (y / 3)}%, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0) 30%),
      radial-gradient(circle at ${10 + (x / 4)}% ${50 + (y / 4)}%, rgba(234, 179, 8, 0.4) 0%, rgba(234, 179, 8, 0) 15%)
    `;
  };

  // Drag Handlers
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX - mapOffset.x, y: clientY - mapOffset.y };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const newX = clientX - dragStart.current.x;
    const newY = clientY - dragStart.current.y;
    const limit = 400; // Increased limit for more exploration
    if (newX > limit || newX < -limit || newY > limit || newY < -limit) return;
    setMapOffset({ x: newX, y: newY });
  };

  const handleEnd = () => setIsDragging(false);

  const renderMarkers = () => {
    switch (activeFilter) {
      case 'Police':
        return (
          <>
            <Marker top="45%" left="52%" icon={IconShield} color="bg-blue-600" label="KP Station" />
            <Marker top="35%" left="65%" icon={IconShield} color="bg-blue-600" label="Patrol #4" />
            <Marker top="60%" left="40%" icon={IconShield} color="bg-blue-600" label="Chowki" />
          </>
        );
      case 'Transport':
        return (
          <>
            <Marker top="48%" left="48%" icon={IconCar} color="bg-yellow-500" label="Auto Stand" />
            <Marker top="30%" left="60%" icon={IconCar} color="bg-yellow-500" label="Uber Zone" />
          </>
        );
      case 'Safe Routes':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" style={{ transform: 'scale(1)' }}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path d="M 400 300 Q 550 350 700 300 T 900 350" fill="none" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" strokeDasharray="15 5" className="animate-pulse" filter="url(#glow)"/>
            <circle cx="400" cy="300" r="6" fill="#15803d" />
            <circle cx="700" cy="300" r="6" fill="#15803d" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="px-6 space-y-6 animate-fade-in pb-40 pt-6 relative">
      
      {/* Redesigned Minimalist Header */}
      <div className="flex justify-between items-start mb-6">
         <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Hello, {userName.split(' ')[0]}
            </h1>
            <p className="text-sm font-medium text-gray-400">
              Here's your real-time safety overview
            </p>
         </div>
         
         <button 
           onClick={() => onNavigate?.(ScreenType.PROFILE)}
           className="w-10 h-10 rounded-full bg-gray-100 border border-white shadow-sm flex items-center justify-center overflow-hidden active:scale-95 transition-transform"
         >
           {userImage ? (
             <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
           ) : (
             <IconUser className="w-5 h-5 text-gray-500" />
           )}
         </button>
      </div>

      {/* Interactive Map Container */}
      <div 
        ref={containerRef}
        className="w-full h-[400px] rounded-[32px] border border-gray-200 overflow-hidden relative bg-gray-100 shadow-sm transition-all duration-300 group cursor-move select-none"
        onMouseDown={e => handleStart(e.clientX, e.clientY)}
        onMouseMove={e => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={e => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
      >
         {/* Instruction Hint */}
         {!isDragging && mapOffset.x === 0 && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-black/5 backdrop-blur-md text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
               Interact to explore
            </div>
         )}

         {/* Center Fixed Pin (Live Location) */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center">
            <div className={`relative ${isDragging ? '-translate-y-4' : 'translate-y-0'} transition-transform duration-200`}>
              <div className="w-4 h-4 bg-blue-500 rounded-full border-[3px] border-white shadow-lg z-20 relative"></div>
              <div className="absolute -inset-4 bg-blue-500/30 rounded-full animate-ping z-10"></div>
            </div>
         </div>

         {/* Moving Layer */}
         <div 
            className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
            style={{ 
              transform: `translate(calc(-50% + ${mapOffset.x}px), calc(-50% + ${mapOffset.y}px))`,
            }}
         >
           <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ 
                border: 0, 
                opacity: activeFilter === 'Heatmap ON' ? 0.7 : 1,
                filter: activeFilter === 'Heatmap ON' ? 'grayscale(100%) contrast(1.1)' : 'grayscale(0%)'
              }}
              src={`https://maps.google.com/maps?q=Pune+City&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              allowFullScreen
              title="Interactive Map"
              className="absolute inset-0 w-full h-full pointer-events-none"
           ></iframe>

           {activeFilter === 'Heatmap ON' && (
             <div className="absolute inset-0 pointer-events-none mix-blend-multiply transition-all duration-500"
                  style={{ background: getHeatmapGradient() }}
             ></div>
           )}

           <div className="absolute inset-0 pointer-events-none">
              {renderMarkers()}
           </div>
         </div>

         {/* Static UI Overlays */}
         <div className="absolute bottom-4 left-4 z-10 transition-transform duration-200 hover:scale-105 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/50 flex items-center space-x-2">
               <IconMapPin className="w-4 h-4 text-black" strokeWidth={2} />
               <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Zone</div>
                  <div className="text-sm font-bold flex items-center">
                    {zone}
                  </div>
               </div>
            </div>
         </div>

         {activeFilter === 'Heatmap ON' && rawScore < 6 && (
           <div className="absolute top-4 right-4 text-[10px] bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-lg flex items-center z-10 border border-red-400/50 pointer-events-none animate-pulse">
             <IconAlert className="w-3 h-3 mr-1 text-white" strokeWidth={2} /> High Risk Area detected
           </div>
         )}
         
         {activeFilter === 'Heatmap ON' && rawScore > 8.5 && (
           <div className="absolute top-4 right-4 text-[10px] bg-green-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-lg flex items-center z-10 border border-green-400/50 pointer-events-none">
             <IconCheck className="w-3 h-3 mr-1 text-white" strokeWidth={2} /> Verified Safe Zone
           </div>
         )}
      </div>

      {/* Filter Chips */}
      <div className="flex space-x-3 overflow-x-auto pb-1 no-scrollbar">
        {['Heatmap ON', 'Safe Routes', 'Police', 'Transport'].map((chip) => (
          <button 
            key={chip} 
            onClick={() => setActiveFilter(chip)}
            className={`px-4 py-2 rounded-full border text-xs font-medium whitespace-nowrap transition-all ${activeFilter === chip ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-white border-gray-100 text-gray-500 shadow-sm'}`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Interactive Safety Score - Real-time Update */}
      <button 
        onClick={() => setShowScoreDetails(true)}
        className="w-full bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 flex items-center justify-between relative active:bg-gray-50 transition-colors"
      >
        <div className="flex flex-col pl-2 text-left">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center">
             Live Safety Score
           </span>
           <span className="text-5xl font-bold tracking-tight text-black tabular-nums">{score}</span>
           <span className={`text-xs font-bold px-2 py-1 rounded-md mt-2 inline-block transition-colors ${statusColor}`}>
              {status}
           </span>
        </div>
        
        <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="36" fill="none" stroke="#F3F4F6" strokeWidth="6" />
              <circle 
                cx="50%" cy="50%" r="36" 
                fill="none" 
                stroke={rawScore > 7.5 ? "#22c55e" : rawScore > 5.5 ? "#ca8a04" : "#ef4444"} 
                strokeWidth="6" 
                strokeDasharray="226" 
                strokeDashoffset={226 - (226 * (rawScore / 10))} 
                strokeLinecap="round"
                className="transition-all duration-300 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
               <IconShield className={`w-6 h-6 ${rawScore > 7.5 ? "text-green-600" : rawScore > 5.5 ? "text-yellow-600" : "text-red-600"}`} strokeWidth={1.5} />
            </div>
        </div>
      </button>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 gap-3">
         <QuickAction icon={IconRadio} label="Share Location" onClick={handleSendLocation} />
         <QuickAction icon={IconPhone} label="Emergency 112" onClick={() => window.open('tel:112')} isRed />
         <QuickAction icon={IconUser} label="Fake Call" onClick={onFakeCallTrigger} />
         <QuickAction icon={IconMapPin} label="Safe Spots" onClick={handleSafeSpot} />
      </div>

      {/* Safety Score Details Modal */}
      {showScoreDetails && (
        <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-end justify-center animate-fade-in" onClick={() => setShowScoreDetails(false)}>
           <div className="bg-white w-full rounded-t-[40px] p-8 pb-24 space-y-6 animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-2">
                 <div>
                    <h3 className="text-2xl font-bold">Safety Breakdown</h3>
                    <p className="text-gray-500 text-xs">Analysis for {zone}</p>
                 </div>
                 <button onClick={() => setShowScoreDetails(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><IconX className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                 <ScoreRow 
                    label="Lighting Quality" 
                    score={`${Math.min(10, Math.floor(rawScore + 1))}/10`} 
                    color={rawScore > 7 ? "bg-green-500" : "bg-yellow-500"} 
                 />
                 <ScoreRow 
                    label="Police Presence" 
                    score={rawScore > 8 ? "High" : rawScore > 5 ? "Moderate" : "Low"} 
                    color={rawScore > 8 ? "bg-green-500" : "bg-yellow-500"} 
                 />
                 <ScoreRow 
                    label="Crowd Density" 
                    score={rawScore > 6 ? "Moderate" : "Sparse"} 
                    color={rawScore > 6 ? "bg-green-500" : "bg-red-500"} 
                 />
              </div>
           </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-2xl text-xs font-bold animate-fade-in z-50 whitespace-nowrap flex items-center space-x-2">
          <IconCheck className="w-4 h-4 text-green-400" />
          <span>Location Sent Successfully</span>
        </div>
      )}
    </div>
  );
};

// Helper Components
const QuickAction = ({ icon: Icon, label, onClick, isRed }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center p-4 rounded-2xl border bg-white shadow-sm space-x-3 active:scale-[0.98] transition-all hover:shadow-md ${isRed ? 'border-red-100' : 'border-gray-100'}`}
  >
    <div className={`p-2 rounded-full ${isRed ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-black'}`}>
      <Icon className="w-5 h-5" />
    </div>
    <span className={`text-xs font-bold ${isRed ? 'text-red-700' : 'text-gray-700'}`}>{label}</span>
  </button>
);

const ScoreRow = ({ label, score, color }: any) => (
  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
     <span className="font-bold text-sm text-gray-700">{label}</span>
     <div className="flex items-center space-x-2">
        <span className="text-sm font-bold text-black">{score}</span>
        <div className={`w-2.5 h-2.5 rounded-full ${color} shadow-sm`}></div>
     </div>
  </div>
);

const Marker = ({ top, left, icon: Icon, color, label }: any) => (
  <div className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2" style={{ top, left }}>
    <div className={`p-2 rounded-full shadow-lg ${color} text-white animate-bounce-small`}>
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div className="mt-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-bold shadow-sm whitespace-nowrap text-gray-800">
      {label}
    </div>
  </div>
);

export default HomeScreen;
