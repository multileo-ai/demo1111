
import React, { useState } from 'react';
import { ScreenType } from './types';
import { IconHome, IconNavigation, IconFileText, IconUsers, IconMessage, IconMic, IconX } from './components/Icons';

// Screens
import HomeScreen from './screens/Home';
import RouteScreen from './screens/RouteNavigation';
import ReportScreen from './screens/ReportIncident';
import CommunityScreen from './screens/Community';
import ChatScreen from './screens/Chatbot';
import LiveScreen from './screens/LiveVoice';
import SosScreen from './screens/SosScreen';
import FakeCallScreen from './screens/FakeCallScreen';
import ProfileContactsScreen from './screens/ProfileContacts';

// Components
import SosSlider from './components/SosSlider';
import SosButton from './components/SosButton';
import FloatingFakeCall from './components/FloatingFakeCall';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(ScreenType.HOME);
  const [isSosActive, setIsSosActive] = useState(false);
  const [isFakeCallActive, setIsFakeCallActive] = useState(false);
  const [showSosSliderModal, setShowSosSliderModal] = useState(false);

  // Global User State
  const [userName, setUserName] = useState("Aarya Sharma");
  const [userImage, setUserImage] = useState<string | null>(null);

  // Helper to switch screens
  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenType.HOME: 
        return <HomeScreen 
                 userName={userName}
                 userImage={userImage}
                 onFakeCallTrigger={() => setIsFakeCallActive(true)} 
                 onNavigate={(screen) => setCurrentScreen(screen)}
               />;
      case ScreenType.ROUTE: return <RouteScreen />;
      case ScreenType.REPORT: return <ReportScreen />;
      case ScreenType.COMMUNITY: return <CommunityScreen />;
      case ScreenType.CHAT: return <ChatScreen />;
      case ScreenType.LIVE: return <LiveScreen />;
      case ScreenType.PROFILE: 
        return <ProfileContactsScreen 
                  currentName={userName}
                  currentImage={userImage}
                  onUpdateProfile={(name, img) => {
                    setUserName(name);
                    setUserImage(img);
                  }}
                  onBack={() => setCurrentScreen(ScreenType.HOME)} 
               />;
      default: return <HomeScreen userName={userName} userImage={userImage} />;
    }
  };

  const handleSosTrigger = () => {
    setShowSosSliderModal(false);
    setIsSosActive(true);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col relative font-sans text-black overflow-hidden">
      
      {/* Top Status Bar Placeholder (mock) */}
      <div className="h-10 w-full flex items-end justify-between px-6 pb-2 text-[10px] font-bold select-none absolute top-0 left-0 z-30 bg-gradient-to-b from-white to-transparent pointer-events-none">
        <span>9:41</span>
        <div className="flex space-x-1">
          <span>5G</span>
          <div className="w-5 h-2.5 border border-black rounded-[2px] relative">
            <div className="bg-black h-full w-[80%]"></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full h-full pt-10 overflow-y-auto no-scrollbar relative z-0">
        {renderScreen()}
      </main>

      {/* Persistent Controls (Only show if NOT in SOS/FakeCall mode) */}
      {!isSosActive && !isFakeCallActive && currentScreen !== ScreenType.PROFILE && (
        <>
          <FloatingFakeCall onTrigger={() => setIsFakeCallActive(true)} />
          
          {/* Global SOS Button */}
          <SosButton onClick={() => setShowSosSliderModal(true)} />

          {/* Bottom Navigation */}
          <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around items-center py-3 pb-6 z-40 text-[10px] font-medium shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            <NavBtn 
              active={currentScreen === ScreenType.HOME} 
              onClick={() => setCurrentScreen(ScreenType.HOME)} 
              icon={IconHome} label="Home" 
            />
            <NavBtn 
              active={currentScreen === ScreenType.ROUTE} 
              onClick={() => setCurrentScreen(ScreenType.ROUTE)} 
              icon={IconNavigation} label="Route" 
            />
             <NavBtn 
              active={currentScreen === ScreenType.LIVE} 
              onClick={() => setCurrentScreen(ScreenType.LIVE)} 
              icon={IconMic} label="Live" 
            />
            <NavBtn 
              active={currentScreen === ScreenType.CHAT} 
              onClick={() => setCurrentScreen(ScreenType.CHAT)} 
              icon={IconMessage} label="Chat" 
            />
             <NavBtn 
              active={currentScreen === ScreenType.REPORT} 
              onClick={() => setCurrentScreen(ScreenType.REPORT)} 
              icon={IconFileText} label="Report" 
            />
            <NavBtn 
              active={currentScreen === ScreenType.COMMUNITY} 
              onClick={() => setCurrentScreen(ScreenType.COMMUNITY)} 
              icon={IconUsers} label="Community" 
            />
          </nav>
        </>
      )}

      {/* SOS Slider Modal Overlay */}
      {showSosSliderModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in">
          <button 
            onClick={() => setShowSosSliderModal(false)}
            className="absolute top-12 right-6 p-2 bg-white/20 rounded-full text-white"
          >
            <IconX className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-white text-center mb-8 space-y-2">
            <h2 className="text-2xl font-bold">Emergency Mode</h2>
            <p className="text-sm opacity-80">Slide below to trigger SOS alert immediately.</p>
          </div>

          <div className="w-full relative h-20">
             <SosSlider onActivate={handleSosTrigger} />
          </div>
        </div>
      )}

      {/* Overlays - Using absolute positioning to stay within the phone frame */}
      {isSosActive && <SosScreen onCancel={() => setIsSosActive(false)} />}
      {isFakeCallActive && <FakeCallScreen onEnd={() => setIsFakeCallActive(false)} />}

    </div>
  );
}

const NavBtn = ({ active, onClick, icon: Icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center space-y-1 w-14 transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-40 hover:opacity-60'}`}>
    <Icon strokeWidth={active ? 2 : 1.5} className="w-6 h-6" />
    <span>{label}</span>
  </button>
);
