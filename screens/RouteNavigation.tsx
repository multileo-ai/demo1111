
import React, { useState, useEffect } from 'react';
import { IconNavigation, IconMapPin, IconSearch, IconX, IconShield, IconClock, IconCar, IconAlert, IconCheck, IconSun, IconUsers } from '../components/Icons';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Expanded Database of Locations for "Google Maps-like" feel
const locationDatabase = [
  "Phoenix Market City, Viman Nagar",
  "Koregaon Park Plaza, KP",
  "Pune Railway Station",
  "Symbiosis College, SB Road",
  "Magarpatta City, Hadapsar",
  "Fergusson College Road",
  "Shaniwar Wada, Old City",
  "Amanora Mall, Hadapsar",
  "Hinjewadi IT Park Phase 1",
  "Hinjewadi IT Park Phase 2",
  "Hinjewadi IT Park Phase 3",
  "Balewadi High Street",
  "Camp, MG Road",
  "Swargate Bus Stand",
  "Pune Airport (PNQ), Lohegaon",
  "Kalyani Nagar, East Ave",
  "Baner - Pashan Link Road",
  "Aundh, ITI Road",
  "Kothrud Stand, Karve Road",
  "Sinhagad Road, Vadgaon",
  "Seasons Mall, Magarpatta",
  "Osho International Meditation Resort",
  "Dagadusheth Halwai Ganapati Temple",
  "Savitribai Phule Pune University",
  "E-Square, University Road",
  "Pavillion Mall, SB Road",
  "JW Marriott, SB Road",
  "Westend Mall, Aundh",
  "High Street, Baner",
  "Tech Park, Yerwada",
  "Commerzone, Yerwada",
  "World Trade Center, Kharadi",
  "EON IT Park, Kharadi",
  "Hadapsar Gliding Centre",
  "Race Course, Camp",
  "Empress Garden",
  "Saras Baug",
  "Okayama Friendship Garden",
  "Katraj Snake Park",
  "Rajiv Gandhi Zoological Park",
  "ISKCON NVCC",
  "Ruby Hall Clinic",
  "Jehangir Hospital",
  "Sancheti Hospital",
  "Deccan Gymkhana",
  "Goodluck Cafe, Deccan",
  "FC Road Social",
  "German Bakery, KP",
  "High Spirits, KP",
  "Hard Rock Cafe, KP",
  "Penthouze Nightlife",
  "Area 51, Baner"
];

// Helper for deterministic data generation
const getHash = (str: string) => {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const RouteScreen: React.FC = () => {
  const [source, setSource] = useState('Current Location');
  const [destination, setDestination] = useState('');
  
  // UI State
  const [activeInput, setActiveInput] = useState<'source' | 'destination' | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [routeFound, setRouteFound] = useState(false);

  // Analysis State
  const [safetyScore, setSafetyScore] = useState(0);
  const [travelTime, setTravelTime] = useState('');
  const [crimeData, setCrimeData] = useState<any[]>([]);
  const [safeTransport, setSafeTransport] = useState<any[]>([]);
  const [bestRouteName, setBestRouteName] = useState('');
  
  // Detailed Breakdown State
  const [metrics, setMetrics] = useState({
    lighting: 0,
    police: 0,
    crowd: 0
  });

  // Filter suggestions
  const getSuggestions = (query: string) => {
    if (!query) return [];
    return locationDatabase.filter(s => 
      s.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  const suggestions = activeInput === 'source' 
    ? getSuggestions(source === 'Current Location' ? '' : source) 
    : getSuggestions(destination);

  const handleSelectSuggestion = (place: string) => {
    if (activeInput === 'source') {
      setSource(place);
    } else {
      setDestination(place);
    }
    setActiveInput(null);
    setRouteFound(false);
  };

  const handleFocus = (field: 'source' | 'destination') => {
    setActiveInput(field);
    if (field === 'source' && source === 'Current Location') {
      setSource('');
    }
  };

  const handleBlur = (field: 'source' | 'destination') => {
    setTimeout(() => {
      setActiveInput(null);
      if (field === 'source' && source.trim() === '') {
        setSource('Current Location');
      }
    }, 200);
  };

  const handleFindRoute = () => {
    if (!destination) return;
    setIsRouting(true);
    setRouteFound(false);

    // Simulate Calculation with Deterministic Randomness based on location name
    setTimeout(() => {
      const seed = getHash(destination + (source === 'Current Location' ? 'LIVE' : source));
      
      // Safety Score (vary between 55 and 99)
      const score = 55 + (seed % 45);
      setSafetyScore(score);
      
      // Travel Time
      setTravelTime(`${12 + (seed % 40)} min`);
      
      const routes = ["Nagar Road", "Old Highway", "River View Path", "Main City Road", "Expressway", "Ring Road"];
      setBestRouteName(`Via ${routes[seed % routes.length]}`);

      // Risk Data Generation (Shift peaks based on hash)
      const riskData = [
        { time: '6am', risk: 10 + (seed % 15) },
        { time: '10am', risk: 15 + ((seed >> 2) % 20) },
        { time: '2pm', risk: 10 + ((seed >> 3) % 15) },
        { time: '6pm', risk: 30 + ((seed >> 1) % 40) }, 
        { time: '10pm', risk: 40 + (seed % 50) }, 
        { time: '2am', risk: 25 + ((seed >> 4) % 30) },
      ];
      setCrimeData(riskData);

      // Breakdown Metrics (0-10) with variance
      setMetrics({
        lighting: Math.min(10, 4 + (seed % 7)), 
        police: Math.min(10, 3 + ((seed >> 2) % 8)),   
        crowd: Math.min(10, 2 + ((seed >> 5) % 9))     
      });

      // Transport Options with dynamic pricing
      setSafeTransport([
        { type: 'Uber Premier', time: `${2 + (seed % 5)} min`, price: `₹${100 + (seed % 150)}`, safe: true },
        { type: 'Pink Auto', time: `${3 + (seed % 8)} min`, price: `₹${40 + (seed % 80)}`, safe: true },
        { type: 'City Bus', time: `${10 + (seed % 20)} min`, price: '₹25', safe: false },
      ]);

      setIsRouting(false);
      setRouteFound(true);
    }, 1200);
  };

  const clearRoute = () => {
    setRouteFound(false);
    setDestination('');
    setSource('Current Location');
  };

  const getSafetyColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getMapUrl = () => {
    const baseUrl = "https://maps.google.com/maps?";
    let query = "";
    
    // If route is found, we try to show a path. 
    // If source is 'Current Location', we fallback to a central point 'Pune Station' for the visual map route only.
    if (routeFound) {
      const start = source === 'Current Location' ? 'Pune Station' : source;
      query = `q=${encodeURIComponent(start)}+to+${encodeURIComponent(destination)}`;
    } else {
      // If no route, just show destination or default pune
      query = `q=${encodeURIComponent(destination || 'Pune City')}`;
    }

    return `${baseUrl}${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="h-full flex flex-col bg-white pb-36 overflow-y-auto no-scrollbar relative">
      {/* Search Header */}
      <div className="bg-white p-6 pb-4 rounded-b-3xl z-30 space-y-4 sticky top-0 border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center">
           <h2 className="text-xl font-light">Route Planner</h2>
           {routeFound && (
             <button onClick={clearRoute} className="text-xs font-bold text-gray-500 hover:text-black">RESET</button>
           )}
        </div>
        
        <div className="space-y-3 relative">
           {/* Visual Connector Line */}
           <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-100 -z-10"></div>
           
           {/* Source Input Wrapper */}
           <div className="relative z-20">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 bg-black rounded-full ml-[11px] ring-4 ring-white shrink-0"></div>
                <input 
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  onFocus={() => handleFocus('source')}
                  onBlur={() => handleBlur('source')}
                  className="flex-1 p-3.5 bg-gray-50 rounded-xl text-sm outline-none border border-transparent focus:border-black/10 focus:bg-white transition-all font-medium text-gray-700 placeholder-gray-400"
                  placeholder="Start Point"
                />
                {source && source !== 'Current Location' && activeInput === 'source' && (
                  <button onMouseDown={() => setSource('')} className="absolute right-3 p-1">
                    <IconX className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>
              {/* Suggestions for Source */}
              {activeInput === 'source' && suggestions.length > 0 && (
                <div className="absolute top-full left-8 right-0 bg-white shadow-xl rounded-b-xl border-x border-b border-gray-100 mt-1 z-50 max-h-48 overflow-y-auto">
                  {suggestions.map((place, idx) => (
                    <div key={idx} onMouseDown={() => handleSelectSuggestion(place)} className="p-3 text-sm hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center space-x-2 text-gray-700">
                      <IconMapPin className="w-3 h-3 text-gray-400" />
                      <span className="truncate">{place}</span>
                    </div>
                  ))}
                </div>
              )}
           </div>
           
           {/* Destination Input Wrapper */}
           <div className="relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-sm ml-[11px] ring-4 ring-white shrink-0"></div>
                <div className="flex-1 relative">
                  <input 
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    onFocus={() => handleFocus('destination')}
                    onBlur={() => handleBlur('destination')}
                    className="w-full p-3.5 bg-gray-50 rounded-xl text-sm outline-none border border-transparent focus:border-black/10 focus:bg-white transition-all font-medium pr-10 placeholder-gray-400"
                    placeholder="Where to?"
                  />
                  {destination && (
                    <button onMouseDown={() => setDestination('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1 hover:bg-gray-200 rounded-full">
                      <IconX className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              {/* Suggestions for Destination */}
              {activeInput === 'destination' && suggestions.length > 0 && (
                <div className="absolute top-full left-8 right-0 bg-white shadow-xl rounded-b-xl border-x border-b border-gray-100 mt-1 z-50 max-h-48 overflow-y-auto">
                  {suggestions.map((place, idx) => (
                    <div key={idx} onMouseDown={() => handleSelectSuggestion(place)} className="p-3 text-sm hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center space-x-2 text-gray-700">
                      <IconMapPin className="w-3 h-3 text-gray-400" />
                      <span className="truncate">{place}</span>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>

        <button 
          onClick={handleFindRoute}
          disabled={!destination || isRouting}
          className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex justify-center items-center space-x-2"
        >
          {isRouting ? (
             <div className="flex space-x-1.5">
               <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
               <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-100"></div>
               <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-200"></div>
             </div>
          ) : (
            <>
              <IconNavigation className="w-4 h-4" />
              <span>Analyze & Find Safest Route</span>
            </>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-4 space-y-6 mt-4 pb-8">
        
        {/* Map View */}
        <div className="w-full h-64 rounded-[32px] overflow-hidden border border-gray-200 shadow-sm relative bg-gray-100 group">
           <iframe 
              key={routeFound ? `${destination}-${source}` : 'static-map'} // Force re-render on route change
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0, opacity: 0.9, filter: 'grayscale(100%) contrast(1.1)' }}
              src={getMapUrl()}
              allowFullScreen
              title="Google Map"
              className="absolute inset-0 w-full h-full transition-opacity duration-500"
           ></iframe>
           
           {!routeFound && !isRouting && !destination && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm text-center p-4 pointer-events-none">
                <IconMapPin className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs font-bold text-gray-500">Enter a destination to view<br/>safety analysis and route.</p>
             </div>
           )}

           {routeFound && (
             <div className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-xl shadow-md text-[10px] font-bold border border-gray-100 flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Traffic</span>
             </div>
           )}
        </div>

        {/* Results Section */}
        {routeFound && (
          <div className="space-y-6 animate-slide-up">
             
             {/* Primary Route Info Card */}
             <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[100px] -mr-4 -mt-4 z-0 ${safetyScore > 80 ? 'bg-green-50' : safetyScore > 65 ? 'bg-yellow-50' : 'bg-red-50'}`}></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Recommended Path</div>
                        <h3 className="font-bold text-xl">{bestRouteName}</h3>
                     </div>
                     <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center ${getSafetyColor(safetyScore)}`}>
                        <IconShield className="w-3 h-3 mr-1" />
                        {safetyScore}% Safe
                     </div>
                  </div>

                  <div className="flex items-center space-x-6 mb-4">
                     <div>
                        <div className="text-2xl font-bold">{travelTime}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold">Est. Time</div>
                     </div>
                     <div className="h-8 w-px bg-gray-100"></div>
                     <div>
                        <div className="text-2xl font-bold">{safetyScore > 85 ? 'Low' : safetyScore > 70 ? 'Med' : 'High'}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold">Risk Level</div>
                     </div>
                  </div>

                  <button className="w-full py-3.5 bg-black text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg active:scale-[0.98] transition-all">
                     <IconNavigation className="w-4 h-4 text-white" />
                     <span>Start Navigation</span>
                  </button>
                </div>
             </div>
             
             {/* Detailed Metrics Breakdown */}
             <div className="grid grid-cols-3 gap-3">
               <div className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-gray-100 py-4">
                 <IconSun className={`w-5 h-5 mb-2 ${metrics.lighting > 6 ? 'text-green-500' : 'text-yellow-500'}`} />
                 <span className="text-lg font-bold">{metrics.lighting}/10</span>
                 <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Lighting</span>
               </div>
               <div className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-gray-100 py-4">
                 <IconShield className={`w-5 h-5 mb-2 ${metrics.police > 5 ? 'text-blue-500' : 'text-blue-300'}`} />
                 <span className="text-lg font-bold">{metrics.police}/10</span>
                 <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Police</span>
               </div>
               <div className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-gray-100 py-4">
                 <IconUsers className={`w-5 h-5 mb-2 ${metrics.crowd > 6 ? 'text-green-500' : 'text-gray-500'}`} />
                 <span className="text-lg font-bold">{metrics.crowd}/10</span>
                 <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Crowd</span>
               </div>
             </div>

             {/* Safety Analysis Chart */}
             <div className="bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-sm font-bold flex items-center">
                      <IconAlert className="w-4 h-4 mr-2 text-red-500" />
                      Risk Forecast (24h)
                   </h3>
                   <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500">Historical Data</span>
                </div>
                
                <div className="h-48 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={crimeData}>
                        <defs>
                          <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                          cursor={{ stroke: '#ef4444', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="risk" 
                          stroke="#ef4444" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorRisk)" 
                        />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Transport Options */}
             <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Safe Commute Options</h3>
                <div className="grid grid-cols-1 gap-3">
                   {safeTransport.map((option, idx) => (
                     <div key={idx} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-black/10 transition-colors">
                        <div className="flex items-center space-x-3">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${option.safe ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                              <IconCar className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="font-bold text-sm flex items-center">
                                {option.type}
                                {option.safe && <IconCheck className="w-3 h-3 text-green-500 ml-1" strokeWidth={3} />}
                              </div>
                              <div className="text-xs text-gray-500">{option.time} away</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="font-bold text-sm">{option.price}</div>
                           <button className="text-[10px] font-bold text-blue-600">BOOK</button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default RouteScreen;
