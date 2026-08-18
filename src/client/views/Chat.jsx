import React from 'react';
import { Search } from 'lucide-react';

export default function Chat() {
  const messages = [
    { name: 'Federal Police - Bole Branch', time: '10:42 AM', preview: 'We have dispatched a unit to the loc...', unread: 2, icon: 'F' },
    { name: 'Abebe Kebede', time: 'Yesterday', preview: 'Yes, that\'s my laptop! I can verify the seri...', unread: 0, icon: 'A', bg: 'bg-purple-500' },
    { name: 'Community Alert', time: 'Mon', preview: 'Update on missing person: Found safe.', unread: 0, icon: 'C' },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Messages</h1>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col">
        {messages.map((msg, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full ${msg.bg || 'bg-slate-900'} text-white flex items-center justify-center font-bold text-lg`}>
                {msg.icon}
              </div>
              {i !== 1 && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className={`font-bold text-sm truncate ${msg.unread ? 'text-slate-900' : 'text-slate-700'}`}>{msg.name}</h3>
                <span className={`text-[10px] shrink-0 ${msg.unread ? 'font-bold text-slate-900' : 'text-slate-400'}`}>{msg.time}</span>
              </div>
              <p className={`text-xs truncate ${msg.unread ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                {msg.preview}
              </p>
            </div>
            {msg.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {msg.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}