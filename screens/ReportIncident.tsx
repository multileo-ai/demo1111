
import React, { useState } from 'react';
import { IconAlert, IconMapPin, IconFileText, IconCheck } from '../components/Icons';

const ReportScreen: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0].name);
    }
  };

  const handleSubmit = () => {
    if (!reportType) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 animate-fade-in pb-36">
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center shadow-xl">
           <IconCheck className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold">Report Submitted</h2>
        <p className="text-gray-500 text-sm">Thank you for making the community safer. Authorities have been notified and location geotagged.</p>
        <button 
          onClick={() => {
            setSubmitted(false);
            setReportType('');
            setDescription('');
            setAttachedFile(null);
          }} 
          className="mt-8 px-8 py-3 bg-gray-100 rounded-full text-sm font-bold"
        >
          Report Another
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 space-y-6 pb-40 overflow-y-auto h-full no-scrollbar">
      <h2 className="text-2xl font-light">Report an Incident</h2>
      
      {/* Live Map Preview */}
      <div className="w-full h-48 bg-gray-100 rounded-2xl border border-gray-200 relative overflow-hidden shadow-sm">
         <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ border: 0, filter: 'grayscale(0%)' }}
            src={`https://maps.google.com/maps?q=18.5204,73.8567&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            allowFullScreen
            title="Location"
            className="absolute inset-0 w-full h-full opacity-80"
         ></iframe>
         
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="relative">
                <IconMapPin className="w-8 h-8 text-red-600 drop-shadow-md -mt-4" fill="currentColor" />
                <div className="w-2 h-2 bg-black/50 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2 blur-[1px]"></div>
             </div>
         </div>
         <div className="absolute bottom-2 right-2 text-[10px] bg-white px-2 py-1 rounded shadow text-black font-bold">
            Pune, Maharashtra
         </div>
      </div>

      {/* Categories */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 block">Type of Incident</label>
        <div className="grid grid-cols-3 gap-3">
          {['Harassment', 'Stalking', 'Poor Light', 'Suspicious', 'Theft', 'Other'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setReportType(cat)}
              className={`py-3 border rounded-xl text-xs font-medium transition-all duration-200 ${reportType === cat ? 'bg-black text-white border-black scale-[1.02] shadow-md' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div>
         <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Details</label>
         <textarea 
           value={description}
           onChange={(e) => setDescription(e.target.value)}
           className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-1 focus:ring-black text-sm min-h-[100px] outline-none resize-none"
           placeholder="Describe what happened..."
         ></textarea>
      </div>

      {/* Photo Upload */}
      <label className={`border border-dashed rounded-xl p-4 flex items-center justify-center space-x-2 cursor-pointer transition-colors ${attachedFile ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 text-gray-400 hover:bg-gray-50'}`}>
         {attachedFile ? <IconCheck className="w-4 h-4" /> : <IconFileText className="w-4 h-4" />}
         <span className="text-xs font-bold">{attachedFile ? attachedFile : 'Attach Photo or Audio Evidence'}</span>
         <input type="file" className="hidden" accept="image/*,audio/*" onChange={handleFileChange} />
      </label>

      <button 
        onClick={handleSubmit}
        disabled={!reportType}
        className="w-full py-4 bg-black text-white rounded-full font-medium shadow-lg active:scale-[0.99] transition-all disabled:opacity-50 disabled:shadow-none"
      >
        Submit Report
      </button>
    </div>
  );
};

export default ReportScreen;
