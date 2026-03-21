
import React, { useState, useRef } from 'react';
import { EmergencyContact } from '../types';
import { IconUser, IconPhone, IconX, IconCheck, IconFileText } from '../components/Icons';

interface Props {
  currentName: string;
  currentImage: string | null;
  onUpdateProfile: (name: string, image: string | null) => void;
  onBack: () => void;
}

const ProfileContactsScreen: React.FC<Props> = ({ currentName, currentImage, onUpdateProfile, onBack }) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Mom', phone: '+91 9876543210', relationship: 'Parent' },
    { id: '2', name: 'Brother', phone: '+91 8765432109', relationship: 'Sibling' },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(currentName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');

  const handleEdit = (contact: EmergencyContact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
    setRelation(contact.relationship);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setRelation('');
    setShowModal(true);
  };

  const handleSaveContact = () => {
    if (!name || !phone) return;

    if (editingId) {
      setContacts(prev => prev.map(c => c.id === editingId ? { ...c, name, phone, relationship: relation } : c));
    } else {
      setContacts(prev => [...prev, { id: Date.now().toString(), name, phone, relationship: relation }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    setShowModal(false);
  };

  // Profile Image Handling
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onUpdateProfile(tempName, imageUrl);
    }
  };

  const saveProfile = () => {
    onUpdateProfile(tempName, currentImage);
    setIsEditingProfile(false);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-2 pb-4 border-b border-gray-100 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-gray-100">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-lg font-medium">Profile & Contacts</h1>
        <div className="w-10"></div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        
        {/* Profile Card */}
        <div className="flex items-center space-x-4 mb-8">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center relative group cursor-pointer overflow-hidden border border-gray-200"
            onClick={() => fileInputRef.current?.click()}
          >
             {currentImage ? (
                <img src={currentImage} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-black flex items-center justify-center text-white">
                  <IconUser className="w-8 h-8" />
               </div>
             )}
             <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-white font-bold">CHANGE</span>
             </div>
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>
          
          <div className="flex-1">
            {isEditingProfile ? (
              <div className="flex space-x-2">
                 <input 
                   value={tempName} 
                   onChange={e => setTempName(e.target.value)}
                   className="flex-1 p-2 bg-gray-50 rounded-lg text-sm border border-gray-200"
                   autoFocus
                 />
                 <button onClick={saveProfile} className="p-2 bg-black text-white rounded-lg"><IconCheck className="w-4 h-4" /></button>
              </div>
            ) : (
              <div>
                <h2 className="font-bold text-xl flex items-center">
                  {currentName} 
                  <button onClick={() => setIsEditingProfile(true)} className="ml-2 text-gray-300 hover:text-black">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                </h2>
                <p className="text-xs text-gray-500">Tap photo to update</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">My Circle</h3>
          <div className="space-y-3">
            {contacts.map(contact => (
              <div key={contact.id} onClick={() => handleEdit(contact)} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 active:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-400 font-bold text-lg">
                      {contact.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{contact.name}</div>
                    <div className="text-xs text-gray-500">{contact.relationship}</div>
                  </div>
                </div>
                <IconPhone className="w-4 h-4 text-gray-300" />
              </div>
            ))}
          </div>

          <button 
            onClick={handleAdd}
            className="w-full mt-4 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium flex items-center justify-center space-x-2 active:bg-gray-50 text-sm"
          >
            <span>+ Add New Contact</span>
          </button>
        </div>

      </div>

      {/* Add/Edit Contact Modal */}
      {showModal && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
          <div className="bg-white w-full sm:w-[90%] sm:rounded-3xl rounded-t-3xl p-6 space-y-4 shadow-2xl">
             <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">{editingId ? 'Edit Contact' : 'New Contact'}</h3>
                <button onClick={() => setShowModal(false)}><IconX className="w-6 h-6" /></button>
             </div>
             
             <div className="space-y-3">
               <input 
                 value={name} onChange={e => setName(e.target.value)} 
                 placeholder="Full Name" 
                 className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-1 focus:ring-black"
               />
               <input 
                 value={relation} onChange={e => setRelation(e.target.value)} 
                 placeholder="Relationship (e.g. Sister)" 
                 className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-1 focus:ring-black"
               />
               <input 
                 value={phone} onChange={e => setPhone(e.target.value)} 
                 placeholder="Phone Number" 
                 type="tel"
                 className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-1 focus:ring-black"
               />
             </div>

             <div className="flex space-x-3 pt-4">
                {editingId && (
                  <button onClick={() => handleDelete(editingId)} className="flex-1 py-3 text-red-500 font-bold bg-red-50 rounded-xl">Delete</button>
                )}
                <button onClick={handleSaveContact} className="flex-[2] py-3 bg-black text-white font-bold rounded-xl shadow-lg">Save Contact</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileContactsScreen;
