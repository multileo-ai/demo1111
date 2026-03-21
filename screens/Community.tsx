
import React, { useState } from 'react';
import { IconUsers, IconBell, IconShield, IconAlert, IconCheck, IconMapPin, IconFileText, IconPhone } from '../components/Icons';

const CommunityScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Feed');
  const [acknowledged, setAcknowledged] = useState<Record<number, boolean>>({});

  const handleAck = (id: number) => {
    setAcknowledged(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="px-6 py-4 space-y-6 pb-40 min-h-full bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light">Community</h2>
        <IconBell className="w-5 h-5 text-gray-600" />
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-100 pb-0">
        {['Feed', 'Events', 'Resources'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm pb-3 transition-colors relative ${activeTab === tab ? 'font-bold text-black' : 'text-gray-400'}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"></div>}
          </button>
        ))}
      </div>

      <div className="space-y-4 animate-fade-in">
        
        {/* FEED CONTENT */}
        {activeTab === 'Feed' && (
          <>
            <div className="border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3 bg-white">
               <div className="flex justify-between items-start">
                 <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                     <IconShield className="w-4 h-4 text-blue-600" />
                   </div>
                   <div>
                     <div className="text-xs font-bold">Pune Police Desk</div>
                     <div className="text-[10px] text-gray-500">2h ago</div>
                   </div>
                 </div>
                 <span className="text-[10px] px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">Official</span>
               </div>
               <p className="text-sm leading-relaxed text-gray-700">
                 Increased patrolling scheduled for Viman Nagar sector 4 tonight due to recent reports. Stay alert.
               </p>
               <div className="flex space-x-3 pt-2">
                 <button className="flex-1 py-2 text-xs border border-gray-200 rounded-lg font-medium hover:bg-gray-50">Share</button>
                 <button 
                   onClick={() => handleAck(1)}
                   className={`flex-1 py-2 text-xs rounded-lg font-medium transition-colors ${acknowledged[1] ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-black text-white'}`}
                 >
                   {acknowledged[1] ? 'Acknowledged' : 'Acknowledge'}
                 </button>
               </div>
            </div>

            <div className="border border-red-100 bg-red-50/30 rounded-2xl p-4 space-y-2">
               <div className="flex items-center space-x-2 text-red-600">
                  <IconAlert className="w-4 h-4" />
                  <span className="text-xs font-bold">Unsafe Area Alert</span>
               </div>
               <p className="text-xs text-gray-700">Poor lighting reported at lane 7, KP. Avoid walking alone post 9 PM.</p>
               <div className="text-[10px] text-gray-400 flex items-center space-x-1">
                 <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-gray-300 border border-white"></div>
                    <div className="w-4 h-4 rounded-full bg-gray-400 border border-white"></div>
                    <div className="w-4 h-4 rounded-full bg-gray-500 border border-white"></div>
                 </div>
                 <span>Confirmed by 12 users</span>
               </div>
            </div>
          </>
        )}

        {/* EVENTS CONTENT */}
        {activeTab === 'Events' && (
          <>
            <div className="border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3 bg-white">
               <div className="flex justify-between items-start">
                 <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
                     <IconUsers className="w-4 h-4 text-orange-600" />
                   </div>
                   <div>
                     <div className="text-xs font-bold">Community Event</div>
                     <div className="text-[10px] text-gray-500">Tomorrow, 10 AM</div>
                   </div>
                 </div>
               </div>
               <div className="flex space-x-3">
                  <div className="w-16 h-16 bg-orange-50 rounded-lg flex-shrink-0 flex items-center justify-center border border-orange-100">
                     <IconShield className="w-8 h-8 text-orange-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Self Defence Workshop</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Free session for women at Phoenix Market City mall. Certified trainers.</p>
                  </div>
               </div>
               <button className="w-full py-2 text-xs border border-black text-black rounded-lg font-medium active:bg-black active:text-white transition-colors">
                 Join Event
               </button>
            </div>
          </>
        )}

        {/* RESOURCES CONTENT */}
        {activeTab === 'Resources' && (
           <div className="space-y-3">
             <div className="p-4 bg-gray-50 rounded-2xl flex items-center space-x-4 border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                   <IconFileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Legal Rights Guide</h4>
                  <p className="text-xs text-gray-500">PDF • 2.4 MB</p>
                </div>
             </div>
             <div className="p-4 bg-gray-50 rounded-2xl flex items-center space-x-4 border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                   <IconPhone className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Helpline Directory</h4>
                  <p className="text-xs text-gray-500">Pune City</p>
                </div>
             </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default CommunityScreen;
