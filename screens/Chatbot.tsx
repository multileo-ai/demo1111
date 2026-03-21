
import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { IconMessage, IconMapPin, IconNavigation } from '../components/Icons';

interface Message {
  role: 'user' | 'model';
  text: string;
  links?: any[];
}

const ChatScreen: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm Savraksh AI. I can help you find safe routes, nearby police stations, or answer safety questions." }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Convert chat history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await sendChatMessage(userMsg.text, history);
    
    setMessages(prev => [...prev, { 
      role: 'model', 
      text: response.text || "I'm sorry, I couldn't get that info.",
      links: response.groundingChunks
    }]);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 pb-36">
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-100 z-10">
        <h2 className="text-xl font-light flex items-center">
          <IconMessage className="w-5 h-5 mr-2" />
          Safety Assistant
        </h2>
        <p className="text-[10px] text-gray-400 mt-1">Powered by Gemini 3 Pro</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-black text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
               {msg.text}
            </div>
            
            {/* Render Grounding Sources (Maps Data) */}
            {msg.links && msg.links.length > 0 && (
              <div className="mt-2 space-y-2 w-full max-w-[85%]">
                {msg.links.map((chunk: any, idx: number) => {
                   return (
                     <div key={idx} className="bg-white p-2 rounded-lg border border-gray-200 flex items-center space-x-2 text-xs shadow-sm">
                       <IconMapPin className="w-4 h-4 text-red-500" />
                       <div className="flex-1 overflow-hidden">
                         <div className="font-bold truncate">Location Data Source</div>
                         <div className="text-gray-400 truncate text-[10px]">Google Maps Verified</div>
                       </div>
                     </div>
                   );
                })}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-gray-400 text-xs ml-4">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-sm"
            placeholder="Ask about safe places..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="p-2 bg-black rounded-full text-white ml-2">
            <IconNavigation className="w-4 h-4" strokeWidth={2} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
